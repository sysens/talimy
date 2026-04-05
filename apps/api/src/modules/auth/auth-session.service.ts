import { randomUUID } from "node:crypto"

import bcrypt from "bcrypt"
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"

import { AuthRateLimitService } from "./auth-rate-limit.service"
import { AuthStoreRepository } from "./auth.store.repository"
import { AuthTokenService } from "./auth.token.service"
import type {
  AuthIdentity,
  AuthRequestContext,
  AuthSession,
  StoredUser,
  TokenPayload,
} from "./auth.types"
import { AuthWorkspaceService } from "./auth-workspace.service"
import { LoginDto } from "./dto/login.dto"
import { LogoutDto } from "./dto/logout.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthSessionService {
  private static readonly BCRYPT_ROUNDS = 12
  private static readonly PLATFORM_TENANT_SLUG = "platform"

  constructor(
    private readonly store: AuthStoreRepository,
    private readonly tokenService: AuthTokenService,
    private readonly rateLimitService: AuthRateLimitService,
    private readonly workspaceService: AuthWorkspaceService
  ) {}

  async login(payload: LoginDto, context: AuthRequestContext = {}): Promise<AuthSession> {
    const hostScope = this.workspaceService.resolveHostScope(context)
    if (hostScope.kind === "public") {
      throw new UnauthorizedException("Use your school workspace or platform workspace to sign in")
    }

    const normalizedEmail = payload.email.toLowerCase()
    const loginRateLimitKey = await this.rateLimitService.assertLoginWithinLimit(
      context,
      normalizedEmail
    )

    const identity = await this.validateUserCredentials(payload.email, payload.password, context)
    if (!identity) {
      throw new UnauthorizedException("Invalid credentials")
    }

    await this.rateLimitService.clear(loginRateLimitKey)
    await this.store.markUserLoggedIn(identity.sub, identity.tenantId)
    return this.tokenService.createSession({
      ...identity,
      rememberMe: payload.rememberMe ?? false,
    })
  }

  async register(payload: RegisterDto, context: AuthRequestContext = {}): Promise<AuthSession> {
    const normalizedEmail = payload.email.toLowerCase()
    const role = payload.role ?? "platform_admin"
    const hostScope = this.workspaceService.resolveHostScope(context)

    if (role !== "platform_admin") {
      throw new UnauthorizedException("Public registration is disabled")
    }

    if (hostScope.kind !== "platform") {
      throw new UnauthorizedException(
        "Platform admin registration is only allowed on platform workspace"
      )
    }

    const expectedBootstrapKey = process.env.AUTH_PLATFORM_ADMIN_BOOTSTRAP_KEY?.trim()
    if (!expectedBootstrapKey || payload.bootstrapKey !== expectedBootstrapKey) {
      throw new UnauthorizedException("Platform admin registration is disabled")
    }

    const platformTenantId = await this.store.getTenantIdBySlug(
      AuthSessionService.PLATFORM_TENANT_SLUG
    )
    if (!platformTenantId) {
      throw new NotFoundException("Platform tenant not found")
    }

    if (await this.store.hasUserByEmail(normalizedEmail, platformTenantId)) {
      throw new UnauthorizedException("Email already exists")
    }

    const passwordHash = await bcrypt.hash(payload.password, AuthSessionService.BCRYPT_ROUNDS)
    const user: StoredUser = {
      id: randomUUID(),
      fullName: payload.fullName,
      email: normalizedEmail,
      tenantId: platformTenantId,
      passwordHash,
      roles: [role],
      genderScope: "all",
    }

    await this.store.saveUser(user)
    const persistedUser = await this.store.getUserByEmail(normalizedEmail, platformTenantId)
    if (!persistedUser) {
      throw new NotFoundException("Registered user could not be resolved")
    }

    return this.tokenService.createSession(this.toIdentity(persistedUser))
  }

  async refresh(payload: RefreshTokenDto): Promise<AuthSession> {
    const tokenPayload = this.tokenService.verifyRefreshTokenPayload(payload.refreshToken)
    if (await this.store.isRefreshJtiRevoked(tokenPayload.jti)) {
      throw new UnauthorizedException("Refresh token has been revoked")
    }

    await this.assertTokenActive(tokenPayload)

    const user = await this.store.getUserByEmail(tokenPayload.email, tokenPayload.tenantId)
    if (!user) {
      throw new UnauthorizedException("User not found for refresh token")
    }

    await this.store.revokeRefreshJtiWithTtl(
      tokenPayload.jti,
      this.resolveRefreshRevocationTtlSec(tokenPayload.exp)
    )
    return this.tokenService.createSession({
      ...this.toIdentity(user),
      rememberMe: tokenPayload.rememberMe === true,
    })
  }

  async logout(payload?: LogoutDto): Promise<{ loggedOut: true }> {
    if (payload?.refreshToken) {
      const tokenPayload = this.tokenService.verifyRefreshTokenPayload(payload.refreshToken)
      await this.store.revokeRefreshJtiWithTtl(
        tokenPayload.jti,
        this.resolveRefreshRevocationTtlSec(tokenPayload.exp)
      )
    }

    return { loggedOut: true }
  }

  async verifyAccessToken(token: string): Promise<AuthIdentity> {
    const tokenPayload = this.tokenService.verifyAccessTokenPayload(token)
    await this.assertTokenActive(tokenPayload)
    return {
      sub: tokenPayload.sub,
      email: tokenPayload.email,
      tenantId: tokenPayload.tenantId,
      tenantSlug: tokenPayload.tenantSlug ?? undefined,
      roles: tokenPayload.roles,
      genderScope: tokenPayload.genderScope,
      rememberMe: tokenPayload.rememberMe === true,
    }
  }

  async reissueSessionForUser(userId: string, tenantId: string): Promise<AuthSession> {
    const user = await this.store.getUserById(userId, tenantId)
    if (!user) {
      throw new UnauthorizedException("User not found")
    }

    return this.tokenService.createSession(this.toIdentity(user))
  }

  async validateUserCredentials(
    email: string,
    password: string,
    context: AuthRequestContext = {}
  ): Promise<AuthIdentity | null> {
    const normalizedEmail = email.toLowerCase()
    const hostScope = this.workspaceService.resolveHostScope(context)
    if (hostScope.kind === "public") {
      return null
    }

    const user =
      hostScope.kind === "school"
        ? await this.store.getUserByEmail(normalizedEmail, hostScope.tenantId)
        : await this.store.getUserByEmailForRole(normalizedEmail, "platform_admin")
    if (!user) {
      return null
    }

    if (hostScope.kind === "school" && user.roles.includes("platform_admin")) {
      return null
    }

    if (hostScope.kind === "platform" && !user.roles.includes("platform_admin")) {
      return null
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return null
    }

    return this.toIdentity(user)
  }

  private async assertTokenActive(payload: TokenPayload): Promise<void> {
    const revokedAfterEpochSeconds = await this.store.getSessionsRevokedAfter(payload.sub)
    if (
      revokedAfterEpochSeconds !== null &&
      typeof payload.iat === "number" &&
      payload.iat <= revokedAfterEpochSeconds
    ) {
      throw new UnauthorizedException("Session no longer active")
    }
  }

  private toIdentity(
    user: Pick<StoredUser, "email" | "genderScope" | "id" | "roles" | "tenantId" | "tenantSlug">
  ): AuthIdentity {
    return {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      tenantSlug: user.tenantSlug ?? undefined,
      roles: user.roles,
      genderScope: user.genderScope,
      rememberMe: false,
    }
  }

  private resolveRefreshRevocationTtlSec(expiresAtEpochSeconds: number): number {
    return Math.max(expiresAtEpochSeconds - Math.floor(Date.now() / 1000), 1)
  }
}
