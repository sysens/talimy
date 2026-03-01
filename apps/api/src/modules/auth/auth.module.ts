import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"

import { EmailModule } from "@/modules/email/email.module"

import { AuthController } from "./auth.controller"
import { AuthMagicLinkService } from "./auth-magic-link.service"
import { AuthRateLimitService } from "./auth-rate-limit.service"
import { AuthSessionService } from "./auth-session.service"
import { AuthStoreRepository } from "./auth.store.repository"
import { AuthService } from "./auth.service"
import { AuthTokenService } from "./auth.token.service"
import { AuthWorkspaceService } from "./auth-workspace.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { LocalStrategy } from "./strategies/local.strategy"
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy"

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), EmailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSessionService,
    AuthMagicLinkService,
    AuthRateLimitService,
    AuthWorkspaceService,
    AuthStoreRepository,
    AuthTokenService,
    JwtStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
