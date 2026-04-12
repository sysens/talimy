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
  type CreateStudentInput,
  createStudentSchema,
  type StudentFormOptionsQueryInput,
  type UpdateStudentInput,
  studentFormOptionsQuerySchema,
  updateStudentSchema,
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

import { StudentsService } from "./students.service"

@Controller("students")
@UseGuards(AuthGuard, RolesGuard, TenantGuard, GenderGuard)
@Roles("platform_admin", "school_admin", "teacher")
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly permifyPdpService: PermifyPdpService
  ) {}

  @Get("form-options")
  @Roles("platform_admin", "school_admin")
  async getFormOptions(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(studentFormOptionsQuerySchema)) query: StudentFormOptionsQueryInput
  ) {
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
        entity: "student",
        action: "create",
      })
    }

    return this.studentsService.getFormOptions(resolvedTenantId, resolvedGenderScope)
  }

  @Get(":id")
  getById(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: { tenantId: string },
    @Param("id") id: string
  ) {
    return this.studentsService.getById(queryInput.tenantId, id)
  }

  @Get(":id/grades")
  grades(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: { tenantId: string },
    @Param("id") id: string
  ) {
    return this.studentsService.getGrades(queryInput.tenantId, id)
  }

  @Get(":id/attendance")
  attendance(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: { tenantId: string },
    @Param("id") id: string
  ) {
    return this.studentsService.getAttendance(queryInput.tenantId, id)
  }

  @Get(":id/parents")
  parents(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: { tenantId: string },
    @Param("id") id: string
  ) {
    return this.studentsService.getParents(queryInput.tenantId, id)
  }

  @Get(":id/summary")
  summary(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: { tenantId: string },
    @Param("id") id: string
  ) {
    return this.studentsService.getSummary(queryInput.tenantId, id)
  }

  @Post()
  @Roles("platform_admin", "school_admin")
  async create(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Body(new ZodValidationPipe(createStudentSchema)) payload: CreateStudentInput
  ) {
    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: payload.tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "student",
        action: "create",
        targetGender: payload.gender,
      })
    }
    if (currentUser?.genderScope && currentUser.genderScope !== "all") {
      if (payload.gender !== currentUser.genderScope) {
        throw new ForbiddenException("Gender scope mismatch")
      }
    }
    return this.studentsService.create(payload)
  }

  @Patch(":id")
  async update(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: { tenantId: string },
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateStudentSchema)) payload: UpdateStudentInput
  ) {
    if (currentUser && currentUser.roles?.includes("school_admin")) {
      await this.permifyPdpService.assertGenderAccess({
        tenantId: query.tenantId,
        userId: currentUser.id,
        roles: currentUser.roles ?? [],
        userGenderScope: currentUser.genderScope ?? "all",
        entity: "student",
        action: "update",
        targetGender: payload.gender,
      })
    }
    if (currentUser?.genderScope && currentUser.genderScope !== "all" && payload.gender) {
      if (payload.gender !== currentUser.genderScope) {
        throw new ForbiddenException("Gender scope mismatch")
      }
    }
    return this.studentsService.update(query.tenantId, id, payload)
  }

  @Delete(":id")
  delete(
    @Query(new ZodValidationPipe(userTenantQuerySchema)) query: { tenantId: string },
    @Param("id") id: string
  ) {
    return this.studentsService.delete(query.tenantId, id)
  }
}
