import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import {
  adminAttendanceMarkSchema,
  type AdminAttendanceMarkInput,
  adminAttendanceGridQuerySchema,
  type AdminAttendanceGridQueryInput,
  adminAttendanceOptionsQuerySchema,
  type AdminAttendanceOptionsQueryInput,
  adminAttendanceSummaryQuerySchema,
  type AdminAttendanceSummaryQueryInput,
  adminAttendanceTrendQuerySchema,
  type AdminAttendanceTrendQueryInput,
} from "@talimy/shared"

import {
  CurrentUser,
  type CurrentUser as CurrentUserType,
} from "@/common/decorators/current-user.decorator"
import { Roles } from "@/common/decorators/roles.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { AdminAttendanceService } from "./admin-attendance.service"

@Controller("admin/attendance")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Roles("school_admin")
export class AdminAttendanceController {
  constructor(private readonly adminAttendanceService: AdminAttendanceService) {}

  @Get("summary")
  getSummary(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(adminAttendanceSummaryQuerySchema))
    query: AdminAttendanceSummaryQueryInput
  ) {
    return this.adminAttendanceService.getSummary(query, resolveScopedGender(currentUser))
  }

  @Get("trends")
  getTrends(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(adminAttendanceTrendQuerySchema))
    query: AdminAttendanceTrendQueryInput
  ) {
    return this.adminAttendanceService.getTrends(query, resolveScopedGender(currentUser))
  }

  @Get("options")
  getOptions(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(adminAttendanceOptionsQuerySchema))
    query: AdminAttendanceOptionsQueryInput
  ) {
    return this.adminAttendanceService.getOptions(query, resolveScopedGender(currentUser))
  }

  @Get("grid")
  getGrid(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(adminAttendanceGridQuerySchema))
    query: AdminAttendanceGridQueryInput
  ) {
    return this.adminAttendanceService.getGrid(query, resolveScopedGender(currentUser))
  }

  @Post("mark")
  mark(
    @Body(new ZodValidationPipe(adminAttendanceMarkSchema))
    payload: AdminAttendanceMarkInput
  ) {
    return this.adminAttendanceService.mark(payload)
  }
}

function resolveScopedGender(currentUser: CurrentUserType | null): "female" | "male" | undefined {
  if (currentUser?.genderScope === "male" || currentUser?.genderScope === "female") {
    return currentUser.genderScope
  }

  return undefined
}
