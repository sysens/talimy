import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import {
  adminActivityQuerySchema,
  adminAttendanceOverviewQuerySchema,
  adminDashboardStatsQuerySchema,
  adminFinanceEarningsQuerySchema,
  adminStudentsByGenderQuerySchema,
  adminStudentsPerformanceQuerySchema,
} from "@talimy/shared"

import { Roles } from "@/common/decorators/roles.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { AdminDashboardService } from "./admin-dashboard.service"
import { AdminActivityQueryDto } from "./dto/admin-activity-query.dto"
import { AdminAttendanceOverviewQueryDto } from "./dto/admin-attendance-overview-query.dto"
import { AdminDashboardStatsQueryDto } from "./dto/admin-dashboard-stats-query.dto"
import { AdminFinanceEarningsQueryDto } from "./dto/admin-finance-earnings-query.dto"
import { AdminStudentsByGenderQueryDto } from "./dto/admin-students-by-gender-query.dto"
import { AdminStudentsPerformanceQueryDto } from "./dto/admin-students-performance-query.dto"

@Controller("admin")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Roles("school_admin")
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get("dashboard/stats")
  getStats(@Query(new ZodValidationPipe(adminDashboardStatsQuerySchema)) queryInput: unknown) {
    const query = queryInput as AdminDashboardStatsQueryDto
    return this.adminDashboardService.getStats(query)
  }

  @Get("students/performance")
  getStudentsPerformance(
    @Query(new ZodValidationPipe(adminStudentsPerformanceQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as AdminStudentsPerformanceQueryDto
    return this.adminDashboardService.getStudentsPerformance(query)
  }

  @Get("students/by-gender")
  getStudentsByGender(
    @Query(new ZodValidationPipe(adminStudentsByGenderQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as AdminStudentsByGenderQueryDto
    return this.adminDashboardService.getStudentsByGender(query)
  }

  @Get("attendance/overview")
  getAttendanceOverview(
    @Query(new ZodValidationPipe(adminAttendanceOverviewQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as AdminAttendanceOverviewQueryDto
    return this.adminDashboardService.getAttendanceOverview(query)
  }

  @Get("finance/earnings")
  getFinanceEarnings(
    @Query(new ZodValidationPipe(adminFinanceEarningsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as AdminFinanceEarningsQueryDto
    return this.adminDashboardService.getFinanceEarnings(query)
  }

  @Get("activity")
  getRecentActivity(@Query(new ZodValidationPipe(adminActivityQuerySchema)) queryInput: unknown) {
    const query = queryInput as AdminActivityQueryDto
    return this.adminDashboardService.getRecentActivity(query)
  }
}
