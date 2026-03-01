import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common"
import {
  type AcceptInviteInput,
  acceptInviteSchema,
  type ForgotPasswordInput,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@talimy/shared"

import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { LogoutDto } from "./dto/logout.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { RegisterDto } from "./dto/register.dto"

type AuthHttpRequest = {
  headers: Record<string, string | string[] | undefined>
  ip?: string
  tenantId?: string
  tenantSlug?: string
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  async login(
    @Req() request: AuthHttpRequest,
    @Body(new ZodValidationPipe(loginSchema)) payload: unknown
  ) {
    return this.authService.login(payload as LoginDto, this.buildRequestContext(request))
  }

  @Post("register")
  async register(
    @Req() request: AuthHttpRequest,
    @Body(new ZodValidationPipe(registerSchema)) payload: unknown
  ) {
    return this.authService.register(payload as RegisterDto, this.buildRequestContext(request))
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body(new ZodValidationPipe(refreshTokenSchema)) payload: unknown) {
    return this.authService.refresh(payload as RefreshTokenDto)
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Body(new ZodValidationPipe(logoutSchema)) payload?: unknown) {
    return this.authService.logout(payload as LogoutDto | undefined)
  }

  @Post("forgot-password")
  @HttpCode(200)
  async requestPasswordReset(
    @Req() request: AuthHttpRequest,
    @Body(new ZodValidationPipe(forgotPasswordSchema)) payload: unknown
  ) {
    return this.authService.requestPasswordReset(
      payload as ForgotPasswordInput,
      this.buildRequestContext(request)
    )
  }

  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(
    @Req() request: AuthHttpRequest,
    @Body(new ZodValidationPipe(resetPasswordSchema)) payload: unknown
  ) {
    return this.authService.resetPassword(
      payload as ResetPasswordInput,
      this.buildRequestContext(request)
    )
  }

  @Post("invite/accept")
  @HttpCode(200)
  async acceptInvite(
    @Req() request: AuthHttpRequest,
    @Body(new ZodValidationPipe(acceptInviteSchema)) payload: unknown
  ) {
    return this.authService.acceptInvite(
      payload as AcceptInviteInput,
      this.buildRequestContext(request)
    )
  }

  private buildRequestContext(request: AuthHttpRequest) {
    return {
      tenantId: request.tenantId ?? null,
      tenantSlug: request.tenantSlug ?? null,
      clientIp:
        this.readHeader(request.headers, "x-forwarded-for")?.split(",")[0]?.trim() ??
        request.ip ??
        null,
      forwardedHost:
        this.readHeader(request.headers, "x-forwarded-host") ??
        this.readHeader(request.headers, "host"),
      forwardedProto: this.readHeader(request.headers, "x-forwarded-proto"),
    }
  }

  private readHeader(
    headers: Record<string, string | string[] | undefined>,
    key: string
  ): string | null {
    const rawValue = headers[key]
    if (Array.isArray(rawValue)) {
      return rawValue[0] ?? null
    }

    return rawValue ?? null
  }
}
