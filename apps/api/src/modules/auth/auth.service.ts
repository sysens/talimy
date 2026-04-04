import { Injectable } from "@nestjs/common"
import type { AcceptInviteInput, ForgotPasswordInput, ResetPasswordInput } from "@talimy/shared"

import { AuthMagicLinkService } from "./auth-magic-link.service"
import { AuthSessionService } from "./auth-session.service"
import { LoginDto } from "./dto/login.dto"
import { LogoutDto } from "./dto/logout.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { RegisterDto } from "./dto/register.dto"
import type { AuthIdentity, AuthRequestContext, AuthSession } from "./auth.types"

export type { AuthRequestContext } from "./auth.types"

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: AuthSessionService,
    private readonly magicLinkService: AuthMagicLinkService
  ) {}

  login(payload: LoginDto, context: AuthRequestContext = {}): Promise<AuthSession> {
    return this.sessionService.login(payload, context)
  }

  register(payload: RegisterDto, context: AuthRequestContext = {}): Promise<AuthSession> {
    return this.sessionService.register(payload, context)
  }

  refresh(payload: RefreshTokenDto): Promise<AuthSession> {
    return this.sessionService.refresh(payload)
  }

  logout(payload?: LogoutDto): Promise<{ loggedOut: true }> {
    return this.sessionService.logout(payload)
  }

  requestPasswordReset(
    payload: ForgotPasswordInput,
    context: AuthRequestContext
  ): Promise<{ sent: true }> {
    return this.magicLinkService.requestPasswordReset(payload, context)
  }

  resetPassword(
    payload: ResetPasswordInput,
    context: AuthRequestContext
  ): Promise<{ updated: true }> {
    return this.magicLinkService.resetPassword(payload, context)
  }

  acceptInvite(
    payload: AcceptInviteInput,
    context: AuthRequestContext
  ): Promise<{ updated: true }> {
    return this.magicLinkService.acceptInvite(payload, context)
  }

  verifyAccessToken(token: string): Promise<AuthIdentity> {
    return this.sessionService.verifyAccessToken(token)
  }

  reissueSessionForUser(userId: string, tenantId: string): Promise<AuthSession> {
    return this.sessionService.reissueSessionForUser(userId, tenantId)
  }

  validateUserCredentials(
    email: string,
    password: string,
    context: AuthRequestContext = {}
  ): Promise<AuthIdentity | null> {
    return this.sessionService.validateUserCredentials(email, password, context)
  }
}
