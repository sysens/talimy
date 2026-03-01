import { HttpException, HttpStatus, Injectable } from "@nestjs/common"

import { CacheService } from "@/modules/cache/cache.service"

import type { AuthRequestContext } from "./auth.types"

const RATE_LIMIT_WINDOW_SECONDS = 60
const MAX_FORGOT_PASSWORD_ATTEMPTS_PER_MINUTE = 5
const MAX_LOGIN_ATTEMPTS_PER_MINUTE = 5
const MAX_MAGIC_LINK_ATTEMPTS_PER_MINUTE = 10

type AuthRateLimitBucket = "forgot-password" | "invite" | "login" | "password_reset"

@Injectable()
export class AuthRateLimitService {
  constructor(private readonly cacheService: CacheService) {}

  async assertLoginWithinLimit(context: AuthRequestContext, subject: string): Promise<string> {
    const key = this.buildKey("login", context, subject)
    await this.assertWithinRateLimit(
      key,
      MAX_LOGIN_ATTEMPTS_PER_MINUTE,
      "Too many login attempts. Try again in a minute."
    )
    return key
  }

  async assertForgotPasswordWithinLimit(
    context: AuthRequestContext,
    subject: string
  ): Promise<void> {
    await this.assertWithinRateLimit(
      this.buildKey("forgot-password", context, subject),
      MAX_FORGOT_PASSWORD_ATTEMPTS_PER_MINUTE,
      "Too many reset requests. Try again in a minute."
    )
  }

  async assertMagicLinkWithinLimit(
    bucket: "invite" | "password_reset",
    context: AuthRequestContext,
    subject: string
  ): Promise<string> {
    const key = this.buildKey(bucket, context, subject)
    await this.assertWithinRateLimit(
      key,
      MAX_MAGIC_LINK_ATTEMPTS_PER_MINUTE,
      "Too many magic link attempts. Try again in a minute."
    )
    return key
  }

  async clear(key: string): Promise<void> {
    await this.cacheService.del(key)
  }

  private async assertWithinRateLimit(
    key: string,
    maxAttempts: number,
    message: string
  ): Promise<void> {
    const record = await this.cacheService.getJson<{ attempts?: number }>(key)
    const nextAttempts = (record?.attempts ?? 0) + 1

    await this.cacheService.setJson(key, { attempts: nextAttempts }, RATE_LIMIT_WINDOW_SECONDS)

    if (nextAttempts > maxAttempts) {
      throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS)
    }
  }

  private buildKey(
    bucket: AuthRateLimitBucket,
    context: AuthRequestContext,
    subject: string
  ): string {
    const host = this.normalizeForwardedHost(context.forwardedHost) ?? "unknown-host"
    const clientIp = context.clientIp?.trim() || "unknown-ip"
    return `auth:rate-limit:${bucket}:${host}:${clientIp}:${subject}`
  }

  private normalizeForwardedHost(value: string | null | undefined): string | null {
    if (!value) {
      return null
    }

    const firstHost = value.split(",")[0]?.trim().toLowerCase()
    return firstHost ? firstHost : null
  }
}
