import { Module } from "@nestjs/common"

import { AuthModule } from "@/modules/auth/auth.module"

import { AdminDashboardController } from "./admin-dashboard.controller"
import { AdminDashboardRepository } from "./admin-dashboard.repository"
import { AdminDashboardService } from "./admin-dashboard.service"

@Module({
  imports: [AuthModule],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardRepository, AdminDashboardService],
  exports: [AdminDashboardService],
})
export class AdminDashboardModule {}
