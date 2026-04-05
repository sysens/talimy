import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common"
import {
  teacherAttendanceCalendarQuerySchema,
  teacherDocumentsQuerySchema,
  teacherLeaveRequestsQuerySchema,
  teacherPerformanceQuerySchema,
  teacherTrainingQuerySchema,
  teacherWorkloadDetailQuerySchema,
  updateTeacherLeaveRequestSchema,
} from "@talimy/shared"

import {
  CurrentUser,
  type CurrentUser as CurrentUserType,
} from "@/common/decorators/current-user.decorator"
import { Roles } from "@/common/decorators/roles.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { GenderGuard } from "@/common/guards/gender.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { TeacherDetailAttendanceCalendarQueryDto } from "./dto/teacher-detail-attendance-calendar-query.dto"
import { TeacherDetailDocumentsQueryDto } from "./dto/teacher-detail-documents-query.dto"
import { TeacherDetailLeaveRequestsQueryDto } from "./dto/teacher-detail-leave-requests-query.dto"
import { TeacherDetailPerformanceQueryDto } from "./dto/teacher-detail-performance-query.dto"
import { TeacherDetailTrainingQueryDto } from "./dto/teacher-detail-training-query.dto"
import { TeacherDetailWorkloadQueryDto } from "./dto/teacher-detail-workload-query.dto"
import { UpdateTeacherLeaveRequestDto } from "./dto/update-teacher-leave-request.dto"
import { TeachersDetailService } from "./teachers-detail.service"

@Controller("teachers")
@UseGuards(AuthGuard, RolesGuard, TenantGuard, GenderGuard)
@Roles("platform_admin", "school_admin")
export class TeachersDetailController {
  constructor(private readonly teachersDetailService: TeachersDetailService) {}

  @Get(":id/documents")
  getDocuments(
    @Param("id") teacherId: string,
    @Query(new ZodValidationPipe(teacherDocumentsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherDetailDocumentsQueryDto
    return this.teachersDetailService.getDocuments(teacherId, query)
  }

  @Get(":id/workload")
  getWorkload(
    @Param("id") teacherId: string,
    @Query(new ZodValidationPipe(teacherWorkloadDetailQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherDetailWorkloadQueryDto
    return this.teachersDetailService.getWorkload(teacherId, query)
  }

  @Get(":id/training")
  getTraining(
    @Param("id") teacherId: string,
    @Query(new ZodValidationPipe(teacherTrainingQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherDetailTrainingQueryDto
    return this.teachersDetailService.getTraining(teacherId, query)
  }

  @Get(":id/attendance-calendar")
  getAttendanceCalendar(
    @Param("id") teacherId: string,
    @Query(new ZodValidationPipe(teacherAttendanceCalendarQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherDetailAttendanceCalendarQueryDto
    return this.teachersDetailService.getAttendanceCalendar(teacherId, query.tenantId, query.month)
  }

  @Get(":id/leave-requests")
  getLeaveRequests(
    @Param("id") teacherId: string,
    @Query(new ZodValidationPipe(teacherLeaveRequestsQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherDetailLeaveRequestsQueryDto
    return this.teachersDetailService.getLeaveRequests(teacherId, query.tenantId)
  }

  @Patch(":id/leave-requests/:requestId")
  updateLeaveRequest(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Param("id") teacherId: string,
    @Param("requestId") requestId: string,
    @Query(new ZodValidationPipe(teacherLeaveRequestsQuerySchema)) queryInput: unknown,
    @Body(new ZodValidationPipe(updateTeacherLeaveRequestSchema)) payloadInput: unknown
  ) {
    const query = queryInput as TeacherDetailLeaveRequestsQueryDto
    const payload = payloadInput as UpdateTeacherLeaveRequestDto
    return this.teachersDetailService.updateLeaveRequest(
      teacherId,
      query.tenantId,
      requestId,
      payload,
      currentUser?.id ?? null
    )
  }

  @Get(":id/performance")
  getPerformance(
    @Param("id") teacherId: string,
    @Query(new ZodValidationPipe(teacherPerformanceQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as TeacherDetailPerformanceQueryDto
    return this.teachersDetailService.getPerformance(teacherId, query)
  }
}
