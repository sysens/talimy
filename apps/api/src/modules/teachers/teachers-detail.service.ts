import { Injectable } from "@nestjs/common"

import type {
  TeacherDocumentsQueryInput,
  TeacherPerformanceQueryInput,
  TeacherTrainingQueryInput,
  TeacherWorkloadDetailQueryInput,
  UpdateTeacherLeaveRequestInput,
} from "@talimy/shared"

import { TeachersDetailRepository } from "./teachers-detail.repository"

@Injectable()
export class TeachersDetailService {
  constructor(private readonly repository: TeachersDetailRepository) {}

  getDocuments(teacherId: string, query: TeacherDocumentsQueryInput) {
    return this.repository.getDocuments(query.tenantId, teacherId)
  }

  getWorkload(teacherId: string, query: TeacherWorkloadDetailQueryInput) {
    return this.repository.getWorkload(query.tenantId, teacherId, query.range)
  }

  getTraining(teacherId: string, query: TeacherTrainingQueryInput) {
    return this.repository.getTraining(query.tenantId, teacherId, query.semester)
  }

  getAttendanceCalendar(teacherId: string, tenantId: string, month: string) {
    return this.repository.getAttendanceCalendar(tenantId, teacherId, month)
  }

  getLeaveRequests(teacherId: string, tenantId: string) {
    return this.repository.getLeaveRequests(tenantId, teacherId)
  }

  updateLeaveRequest(
    teacherId: string,
    tenantId: string,
    requestId: string,
    payload: UpdateTeacherLeaveRequestInput,
    decidedByUserId: string | null
  ) {
    return this.repository.updateLeaveRequest(
      tenantId,
      teacherId,
      requestId,
      payload.status,
      decidedByUserId
    )
  }

  getPerformance(teacherId: string, query: TeacherPerformanceQueryInput) {
    return this.repository.getPerformance(query.tenantId, teacherId, query.period)
  }
}
