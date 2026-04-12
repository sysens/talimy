import { Module } from "@nestjs/common"

import { AuthModule } from "../auth/auth.module"
import { AdminAttendanceController } from "./admin-attendance.controller"
import { AdminAttendanceRepository } from "./admin-attendance.repository"
import { AdminAttendanceService } from "./admin-attendance.service"

@Module({
  imports: [AuthModule],
  controllers: [AdminAttendanceController],
  providers: [AdminAttendanceRepository, AdminAttendanceService],
  exports: [AdminAttendanceRepository, AdminAttendanceService],
})
export class AdminAttendanceModule {}
