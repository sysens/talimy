import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import {
  createTeacherSchema,
  listTeachersQuerySchema,
  teacherAttendanceOverviewQuerySchema,
  teacherFormOptionsQuerySchema,
  teacherStatsQuerySchema,
  teacherWorkloadQuerySchema,
  teachersByDepartmentQuerySchema,
  updateTeacherSchema,
  userTenantQuerySchema,
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

import { CreateTeacherDto } from "./dto/create-teacher.dto"
import { ListTeachersQueryDto } from "./dto/list-teachers-query.dto"
import { TeacherAttendanceOverviewQueryDto } from "./dto/teacher-attendance-overview-query.dto"
import { TeacherFormOptionsQueryDto } from "./dto/teacher-form-options-query.dto"
import { TeacherStatsQueryDto } from "./dto/teacher-stats-query.dto"
import { TeacherWorkloadQueryDto } from "./dto/teacher-workload-query.dto"
import { TeachersByDepartmentQueryDto } from "./dto/teachers-by-department-query.dto"
import { UpdateTeacherDto } from "./dto/update-teacher.dto"
import { TeachersAnalyticsService } from "./teachers-analytics.service"
import { TeachersService } from "./teachers.service"

@Controller("teachers")
@UseGuards(AuthGuard, RolesGuard, TenantGuard, GenderGuard)
@Roles("platform_admin", "school_admin")
export class TeachersController {
  constructor(
    private readonly teachersAnalyticsService: TeachersAnalyticsService,
    private readonly teachersService: TeachersService,
    private readonly permifyPdpService: PermifyPdpService
  ) {}

  @Get("stats")
  getStats(@Query(new ZodValidationPipe(teacherStatsQuerySchema)) queryInput: unknown) {
    const query = queryInput as TeacherStatsQueryDto
    return this.teachersAnalyticsService.getStats(query)
  }

  @Get("attendance-overview")
  getAttendanceOverview(
    @Query(new ZodValidationPipe(teacherAttendanceOverviewQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherAttendanceOverviewQueryDto
    return this.teachersAnalyticsService.getAttendanceOverview(query)
  }

  @Get("workload")
  getWorkload(@Query(new ZodValidationPipe(teacherWorkloadQuerySchema)) queryInput: unknown) {
    const query = queryInput as TeacherWorkloadQueryDto
    return this.teachersAnalyticsService.getWorkload(query)
  }

  @Get("by-department")
  getByDepartment(
    @Query(new ZodValidationPipe(teachersByDepartmentQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeachersByDepartmentQueryDto
    return this.teachersAnalyticsService.getByDepartment(query)
  }

  @Get("form-options")
  async getFormOptions(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(teacherFormOptionsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherFormOptionsQueryDto
    const resolvedTenantId =
      typeof currentUser?.tenantId === "string" && currentUser.tenantId.length > 0
        ? currentUser.tenantId
        : query.tenantId
    const resolvedGenderScope =
      currentUser?.genderScope && currentUser.genderScope !== "all"
        ? currentUser.genderScope
        : (query.genderScope ?? "all")

    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: resolvedTenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "teacher",
        action: "create",
      })
    }

    return this.teachersService.getFormOptions(resolvedTenantId, resolvedGenderScope)
  }

  @Get()
  async list(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(listTeachersQuerySchema)) query: unknown
  ) {
    const listQuery = query as ListTeachersQueryDto
    const resolvedGenderScope =
      currentUser?.genderScope && currentUser.genderScope !== "all"
        ? currentUser.genderScope
        : listQuery.genderScope && listQuery.genderScope !== "all"
          ? listQuery.genderScope
          : null

    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: listQuery.tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "teacher",
        action: "list",
      })
    }

    if (resolvedGenderScope) {
      listQuery.gender = [resolvedGenderScope]
    }
    return this.teachersService.list(listQuery)
  }

  @Get(":id/schedule")
  schedule(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: unknown,
    @Param("id") id: string
  ) {
    const tenantQuery = query as { tenantId: string }
    return this.teachersService.getSchedule(tenantQuery.tenantId, id)
  }

  @Get(":id/classes")
  classes(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: unknown,
    @Param("id") id: string
  ) {
    const tenantQuery = query as { tenantId: string }
    return this.teachersService.getClasses(tenantQuery.tenantId, id)
  }

  @Get(":id/subjects")
  subjects(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: unknown,
    @Param("id") id: string
  ) {
    const tenantQuery = query as { tenantId: string }
    return this.teachersService.getSubjects(tenantQuery.tenantId, id)
  }

  @Get(":id")
  getById(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: unknown,
    @Param("id") id: string
  ) {
    const tenantQuery = query as { tenantId: string }
    return this.teachersService.getById(tenantQuery.tenantId, id)
  }

  @Post()
  async create(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Body(new ZodValidationPipe(createTeacherSchema)) payload: unknown
  ) {
    const createPayload = payload as CreateTeacherDto
    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: createPayload.tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "teacher",
        action: "create",
        targetGender: createPayload.gender,
      })
    }
    if (currentUser?.genderScope && currentUser.genderScope !== "all") {
      if (createPayload.gender !== currentUser.genderScope) {
        throw new ForbiddenException("Gender scope mismatch")
      }
    }
    return this.teachersService.create(createPayload)
  }

  @Patch(":id")
  async update(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: unknown,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateTeacherSchema)) payload: unknown
  ) {
    const tenantQuery = query as { tenantId: string }
    const updatePayload = payload as UpdateTeacherDto
    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: tenantQuery.tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "teacher",
        action: "update",
        targetGender: updatePayload.gender,
      })
    }
    if (currentUser?.genderScope && currentUser.genderScope !== "all" && updatePayload.gender) {
      if (updatePayload.gender !== currentUser.genderScope) {
        throw new ForbiddenException("Gender scope mismatch")
      }
    }
    return this.teachersService.update(tenantQuery.tenantId, id, updatePayload)
  }

  @Delete(":id")
  delete(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: unknown,
    @Param("id") id: string
  ) {
    const tenantQuery = query as { tenantId: string }
    return this.teachersService.delete(tenantQuery.tenantId, id)
  }
}
