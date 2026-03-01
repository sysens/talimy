import { randomBytes } from "node:crypto"

import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import type { AcceptInviteInput, ForgotPasswordInput, MagicLinkPurpose, ResetPasswordInput } from "@talimy/shared"

import { CacheService } from "@/modules/cache/cache.service"
import { EmailService } from "@/modules/email/email.service"

import { AuthRateLimitService } from "./auth-rate-limit.service"
import { AuthStoreRepository } from "./auth.store.repository"
import type { AuthRequestContext, MagicLinkRecord, StoredUser } from "./auth.types"
import { AuthWorkspaceService } from "./auth-workspace.service"

@Injectable()
export class AuthMagicLinkService {
  private readonly magicLinkTtlSeconds = 60 * 60

  constructor(
    private readonly store: AuthStoreRepository,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
    private readonly rateLimitService: AuthRateLimitService,
    private readonly workspaceService: AuthWorkspaceService
  ) {}

  async requestPasswordReset(
    payload: ForgotPasswordInput,
    context: AuthRequestContext
  ): Promise<{ sent: true }> {
    const hostScope = this.workspaceService.resolveHostScope(context)
    if (hostScope.kind === "public") {
      throw new UnauthorizedException(
        "Use your school workspace or platform workspace to request a reset magic link"
      )
    }

    const normalizedEmail = payload.email.toLowerCase()
    await this.rateLimitService.assertForgotPasswordWithinLimit(context, normalizedEmail)

    const user = await this.resolvePasswordResetUser(normalizedEmail, context)
    if (!user) {
      return { sent: true }
    }

    const targetOrigin = this.resolvePasswordResetOrigin(user, context)
    const token = randomBytes(32).toString("base64url")
    const issuedAtEpochSeconds = Math.floor(Date.now() / 1000)

    await this.cacheService.setJson(
      this.magicLinkCacheKey(token),
      {
        email: normalizedEmail,
        host: new URL(targetOrigin).host,
        issuedAtEpochSeconds,
        purpose: "password_reset",
        tenantId: user.tenantId,
        tenantSlug: user.tenantSlug ?? null,
        userId: user.id,
      } satisfies MagicLinkRecord,
      this.magicLinkTtlSeconds
    )

    const resetUrl = new URL("/reset-password", `${targetOrigin}/`)
    resetUrl.searchParams.set("token", token)

    await this.emailService.sendTemplate({
      tenantId: user.tenantId,
      to: [normalizedEmail],
      template: "password-reset",
      subject: "Talimy parolini tiklash",
      variables: {
        firstName: this.extractFirstName(user.fullName),
        resetUrl: resetUrl.toString(),
      },
      tags: {
        module: "auth",
        kind: "password_reset",
      },
    })

    return { sent: true }
  }

  async resetPassword(
    payload: ResetPasswordInput,
    context: AuthRequestContext
  ): Promise<{ updated: true }> {
    return this.consumeMagicLink(payload, "password_reset", context)
  }

  async acceptInvite(
    payload: AcceptInviteInput,
    context: AuthRequestContext
  ): Promise<{ updated: true }> {
    return this.consumeMagicLink(payload, "invite", context)
  }

  private async consumeMagicLink(
    payload: ResetPasswordInput,
    expectedPurpose: MagicLinkPurpose,
    context: AuthRequestContext
  ): Promise<{ updated: true }> {
    const hostScope = this.workspaceService.resolveHostScope(context)
    if (hostScope.kind === "public") {
      throw new UnauthorizedException("Magic links must be opened from a valid workspace host")
    }

    if (expectedPurpose === "invite" && hostScope.kind !== "school") {
      throw new UnauthorizedException("Invite magic links can only be used on the school subdomain")
    }

    const magicLinkRateLimitKey = await this.rateLimitService.assertMagicLinkWithinLimit(
      expectedPurpose,
      context,
      payload.token
    )

    const record = await this.cacheService.getJson<MagicLinkRecord>(this.magicLinkCacheKey(payload.token))

    if (!record?.email) {
      throw new UnauthorizedException("Magic link is invalid or expired")
    }

    if (record.purpose !== expectedPurpose) {
      throw new UnauthorizedException("Magic link purpose mismatch")
    }

    this.assertMagicLinkHost(record, context)

    const updated = await this.store.updatePasswordByUser(record.userId, record.tenantId, payload.password)
    if (!updated) {
      throw new NotFoundException("User not found for magic link")
    }

    await this.store.setSessionsRevokedAfter(record.userId, Math.floor(Date.now() / 1000))
    await this.cacheService.del(this.magicLinkCacheKey(payload.token))
    await this.rateLimitService.clear(magicLinkRateLimitKey)

    return { updated: true }
  }

  private assertMagicLinkHost(record: MagicLinkRecord, context: AuthRequestContext): void {
    const currentHost = this.workspaceService.normalizeForwardedHost(context.forwardedHost)
    if (!currentHost) {
      throw new UnauthorizedException("Workspace host is required")
    }

    if (currentHost !== record.host) {
      throw new UnauthorizedException("Magic link host mismatch")
    }

    if (record.tenantSlug) {
      if (context.tenantSlug !== record.tenantSlug || context.tenantId !== record.tenantId) {
        throw new UnauthorizedException("Magic link tenant mismatch")
      }
    }
  }

  private resolvePasswordResetOrigin(user: StoredUser, context: AuthRequestContext): string {
    if (user.roles.includes("platform_admin")) {
      return this.workspaceService.buildPlatformOrigin(context)
    }

    if (!user.tenantSlug) {
      throw new NotFoundException("Tenant slug is missing for reset link")
    }

    return this.workspaceService.buildTenantOrigin(user.tenantSlug, context)
  }

  private async resolvePasswordResetUser(
    normalizedEmail: string,
    context: AuthRequestContext
  ): Promise<StoredUser | null> {
    const hostScope = this.workspaceService.resolveHostScope(context)

    if (hostScope.kind === "school") {
      return this.store.getUserByEmail(normalizedEmail, hostScope.tenantId)
    }

    if (hostScope.kind === "platform") {
      return this.store.getUserByEmailForRole(normalizedEmail, "platform_admin")
    }

    return null
  }

  private magicLinkCacheKey(token: string): string {
    return `auth:magic-link:${token}`
  }

  private extractFirstName(fullName: string): string {
    return fullName.trim().split(/\s+/)[0] ?? fullName
  }
}
