import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import {
  listStudentsQuerySchema,
  studentAttendanceWeeklyQuerySchema,
  studentEnrollmentTrendsQuerySchema,
  studentSpecialProgramsQuerySchema,
  studentStatsQuerySchema,
} from "@talimy/shared"

import { Roles } from "@/common/decorators/roles.decorator"
import {
  CurrentUser,
  type CurrentUser as CurrentUserType,
} from "@/common/decorators/current-user.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { GenderGuard } from "@/common/guards/gender.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"
import { PermifyPdpService } from "../authz/permify/permify-pdp.service"

import type { AdminStudentEnrollmentTrendsQueryDto } from "./dto/admin-student-enrollment-trends-query.dto"
import type { ListStudentsQueryDto } from "./dto/list-students-query.dto"
import type { StudentAttendanceWeeklyQueryDto } from "./dto/student-attendance-weekly-query.dto"
import type { StudentSpecialProgramsQueryDto } from "./dto/student-special-programs-query.dto"
import type { StudentStatsQueryDto } from "./dto/student-stats-query.dto"
import { StudentsDirectoryService } from "./students-directory.service"

@Controller()
@UseGuards(AuthGuard, RolesGuard, TenantGuard, GenderGuard)
@Roles("platform_admin", "school_admin", "teacher")
export class StudentsDirectoryController {
  constructor(
    private readonly studentsDirectoryService: StudentsDirectoryService,
    private readonly permifyPdpService: PermifyPdpService
  ) {}

  @Get("students")
  async list(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(listStudentsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as ListStudentsQueryDto

    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: query.tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "student",
        action: "list",
      })
    }

    if (currentUser?.genderScope && currentUser.genderScope !== "all") {
      query.gender = currentUser.genderScope
    }

    return this.studentsDirectoryService.list(query)
  }

  @Get("students/stats")
  async getStats(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentStatsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as StudentStatsQueryDto
    const gender = await this.resolveScopedGender(currentUser, query.tenantId)
    return this.studentsDirectoryService.getStats(query.tenantId, gender)
  }

  @Get("students/special-programs")
  async getSpecialPrograms(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentSpecialProgramsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as StudentSpecialProgramsQueryDto
    const gender = await this.resolveScopedGender(currentUser, query.tenantId)
    return this.studentsDirectoryService.getSpecialPrograms(query, gender)
  }

  @Get("admin/students/enrollment-trends")
  async getEnrollmentTrends(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentEnrollmentTrendsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as AdminStudentEnrollmentTrendsQueryDto
    const gender = await this.resolveScopedGender(currentUser, query.tenantId)
    return this.studentsDirectoryService.getEnrollmentTrends(query, gender)
  }

  @Get("admin/attendance/weekly")
  async getAttendanceWeekly(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentAttendanceWeeklyQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as StudentAttendanceWeeklyQueryDto
    const gender = await this.resolveScopedGender(currentUser, query.tenantId)
    return this.studentsDirectoryService.getAttendanceWeekly(query, gender)
  }

  private async resolveScopedGender(
    currentUser: CurrentUserType | null,
    tenantId: string
  ): Promise<"male" | "female" | undefined> {
    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "student",
        action: "list",
      })
    }

    if (currentUser?.genderScope === "male" || currentUser?.genderScope === "female") {
      return currentUser.genderScope
    }

    return undefined
  }
}
