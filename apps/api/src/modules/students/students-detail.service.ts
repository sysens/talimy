import { Injectable } from "@nestjs/common"

import type {
  StudentAcademicPerformanceQueryInput,
  StudentAttendanceCalendarQueryInput,
  StudentBehaviorLogQueryInput,
  StudentDocumentsQueryInput,
  StudentExtracurricularQueryInput,
  StudentHealthQueryInput,
  StudentScholarshipsQueryInput,
} from "@talimy/shared"

import { StudentsDetailRepository } from "./students-detail.repository"

@Injectable()
export class StudentsDetailService {
  constructor(private readonly repository: StudentsDetailRepository) {}

  getDocuments(studentId: string, query: StudentDocumentsQueryInput) {
    return this.repository.getDocuments(query.tenantId, studentId)
  }

  getAttendanceCalendar(studentId: string, query: StudentAttendanceCalendarQueryInput) {
    return this.repository.getAttendanceCalendar(query.tenantId, studentId, query.month)
  }

  getScholarships(studentId: string, query: StudentScholarshipsQueryInput) {
    return this.repository.getScholarships(query.tenantId, studentId)
  }

  getHealth(studentId: string, query: StudentHealthQueryInput) {
    return this.repository.getHealth(query.tenantId, studentId)
  }

  getAcademicPerformance(studentId: string, query: StudentAcademicPerformanceQueryInput) {
    return this.repository.getAcademicPerformance(query.tenantId, studentId, query.period)
  }

  getExtracurricular(studentId: string, query: StudentExtracurricularQueryInput) {
    return this.repository.getExtracurricular(query.tenantId, studentId)
  }

  getBehaviorLog(studentId: string, query: StudentBehaviorLogQueryInput) {
    return this.repository.getBehaviorLog(query.tenantId, studentId)
  }
}
