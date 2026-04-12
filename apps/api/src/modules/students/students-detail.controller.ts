import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common"
import {
  studentAcademicPerformanceQuerySchema,
  studentAttendanceCalendarQuerySchema,
  studentBehaviorLogQuerySchema,
  studentDocumentsQuerySchema,
  studentExtracurricularQuerySchema,
  studentHealthQuerySchema,
  studentScholarshipsQuerySchema,
  type StudentAcademicPerformanceQueryInput,
  type StudentAttendanceCalendarQueryInput,
  type StudentBehaviorLogQueryInput,
  type StudentDocumentsQueryInput,
  type StudentExtracurricularQueryInput,
  type StudentHealthQueryInput,
  type StudentScholarshipsQueryInput,
} from "@talimy/shared"

import { Roles } from "@/common/decorators/roles.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { GenderGuard } from "@/common/guards/gender.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { StudentsDetailService } from "./students-detail.service"

@Controller("students")
@UseGuards(AuthGuard, RolesGuard, TenantGuard, GenderGuard)
@Roles("platform_admin", "school_admin", "teacher")
export class StudentsDetailController {
  constructor(private readonly studentsDetailService: StudentsDetailService) {}

  @Get(":id/documents")
  getDocuments(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentDocumentsQuerySchema)) query: StudentDocumentsQueryInput
  ) {
    return this.studentsDetailService.getDocuments(studentId, query)
  }

  @Get(":id/attendance-calendar")
  getAttendanceCalendar(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentAttendanceCalendarQuerySchema))
    query: StudentAttendanceCalendarQueryInput
  ) {
    return this.studentsDetailService.getAttendanceCalendar(studentId, query)
  }

  @Get(":id/scholarships")
  getScholarships(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentScholarshipsQuerySchema))
    query: StudentScholarshipsQueryInput
  ) {
    return this.studentsDetailService.getScholarships(studentId, query)
  }

  @Get(":id/health")
  getHealth(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentHealthQuerySchema)) query: StudentHealthQueryInput
  ) {
    return this.studentsDetailService.getHealth(studentId, query)
  }

  @Get(":id/academic-performance")
  getAcademicPerformance(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentAcademicPerformanceQuerySchema))
    query: StudentAcademicPerformanceQueryInput
  ) {
    return this.studentsDetailService.getAcademicPerformance(studentId, query)
  }

  @Get(":id/extracurricular")
  getExtracurricular(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentExtracurricularQuerySchema))
    query: StudentExtracurricularQueryInput
  ) {
    return this.studentsDetailService.getExtracurricular(studentId, query)
  }

  @Get(":id/behavior-log")
  getBehaviorLog(
    @Param("id", new ParseUUIDPipe()) studentId: string,
    @Query(new ZodValidationPipe(studentBehaviorLogQuerySchema)) query: StudentBehaviorLogQueryInput
  ) {
    return this.studentsDetailService.getBehaviorLog(studentId, query)
  }
}
