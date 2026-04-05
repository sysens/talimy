import { Module } from "@nestjs/common"

import { PermifyModule } from "../authz/permify/permify.module"
import { AuthModule } from "../auth/auth.module"
import { TeachersDetailController } from "./teachers-detail.controller"
import { TeachersDetailRepository } from "./teachers-detail.repository"
import { TeachersDetailService } from "./teachers-detail.service"
import { TeachersAnalyticsRepository } from "./teachers-analytics.repository"
import { TeachersAnalyticsService } from "./teachers-analytics.service"
import { TeachersCreateRepository } from "./teachers-create.repository"
import { TeachersController } from "./teachers.controller"
import { TeachersFormRepository } from "./teachers-form.repository"
import { TeachersFormService } from "./teachers-form.service"
import { TeachersRepository } from "./teachers.repository"
import { TeachersService } from "./teachers.service"

@Module({
  imports: [AuthModule, PermifyModule],
  controllers: [TeachersController, TeachersDetailController],
  providers: [
    TeachersAnalyticsRepository,
    TeachersAnalyticsService,
    TeachersCreateRepository,
    TeachersDetailRepository,
    TeachersDetailService,
    TeachersFormRepository,
    TeachersFormService,
    TeachersService,
    TeachersRepository,
  ],
  exports: [TeachersService],
})
export class TeachersModule {}
