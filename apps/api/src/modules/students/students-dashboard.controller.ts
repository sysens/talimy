import { Controller, Get, Query, UnauthorizedException, UseGuards } from "@nestjs/common"
import {
  studentAttendanceCalendarQuerySchema,
  studentDashboardAssignmentsQuerySchema,
  studentDashboardMeQuerySchema,
  studentDashboardScoreActivityQuerySchema,
  type StudentAttendanceCalendarQueryInput,
  type StudentDashboardAssignmentsQueryInput,
  type StudentDashboardMeQueryInput,
  type StudentDashboardScoreActivityQueryInput,
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

import { StudentsDashboardService } from "./students-dashboard.service"

@Controller("students/me")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Roles("student")
export class StudentsDashboardController {
  constructor(private readonly studentsDashboardService: StudentsDashboardService) {}

  @Get("ai-advice")
  getAiAdvice(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardMeQuerySchema)) query: StudentDashboardMeQueryInput
  ) {
    return this.studentsDashboardService.getAiAdvice(resolveUserId(currentUser), query)
  }

  @Get("stats")
  getStats(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardMeQuerySchema)) query: StudentDashboardMeQueryInput
  ) {
    return this.studentsDashboardService.getStats(resolveUserId(currentUser), query)
  }

  @Get("performance-summary")
  getPerformanceSummary(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardMeQuerySchema)) query: StudentDashboardMeQueryInput
  ) {
    return this.studentsDashboardService.getPerformanceSummary(resolveUserId(currentUser), query)
  }

  @Get("score-activity")
  getScoreActivity(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardScoreActivityQuerySchema))
    query: StudentDashboardScoreActivityQueryInput
  ) {
    return this.studentsDashboardService.getScoreActivity(resolveUserId(currentUser), query)
  }

  @Get("lessons")
  getLessons(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardMeQuerySchema)) query: StudentDashboardMeQueryInput
  ) {
    return this.studentsDashboardService.getLessons(resolveUserId(currentUser), query)
  }

  @Get("grades-by-subject")
  getGradesBySubject(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardMeQuerySchema)) query: StudentDashboardMeQueryInput
  ) {
    return this.studentsDashboardService.getGradesBySubject(resolveUserId(currentUser), query)
  }

  @Get("assignments")
  getAssignments(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentDashboardAssignmentsQuerySchema))
    query: StudentDashboardAssignmentsQueryInput
  ) {
    return this.studentsDashboardService.getAssignments(resolveUserId(currentUser), query)
  }

  @Get("attendance-calendar")
  getAttendanceCalendar(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentAttendanceCalendarQuerySchema))
    query: StudentAttendanceCalendarQueryInput
  ) {
    return this.studentsDashboardService.getAttendanceCalendar(
      resolveUserId(currentUser),
      query.month,
      { tenantId: query.tenantId }
    )
  }
}

function resolveUserId(currentUser: CurrentUserType | null): string {
  if (!currentUser?.id) {
    throw new UnauthorizedException("Authenticated user is required")
  }

  return currentUser.id
}
