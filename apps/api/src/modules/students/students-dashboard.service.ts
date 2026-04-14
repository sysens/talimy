import { Injectable } from "@nestjs/common"

import type {
  StudentDashboardAssignmentsQueryInput,
  StudentDashboardMeQueryInput,
  StudentDashboardScoreActivityQueryInput,
} from "@talimy/shared"

import { StudentsDetailRepository } from "./students-detail.repository"
import { StudentsDashboardRepository } from "./students-dashboard.repository"
import { StudentsRepository } from "./students.repository"

@Injectable()
export class StudentsDashboardService {
  constructor(
    private readonly studentsDashboardRepository: StudentsDashboardRepository,
    private readonly studentsDetailRepository: StudentsDetailRepository,
    private readonly studentsRepository: StudentsRepository
  ) {}

  getAiAdvice(userId: string, query: StudentDashboardMeQueryInput) {
    return this.studentsDashboardRepository.getAiAdvice(query.tenantId, userId)
  }

  getStats(userId: string, query: StudentDashboardMeQueryInput) {
    return this.studentsDashboardRepository.getStats(query.tenantId, userId)
  }

  getPerformanceSummary(userId: string, query: StudentDashboardMeQueryInput) {
    return this.studentsDashboardRepository.getPerformanceSummary(query.tenantId, userId)
  }

  getScoreActivity(userId: string, query: StudentDashboardScoreActivityQueryInput) {
    return this.studentsDashboardRepository.getScoreActivity(query.tenantId, userId)
  }

  getLessons(userId: string, query: StudentDashboardMeQueryInput) {
    return this.studentsDashboardRepository.getLessons(query.tenantId, userId)
  }

  getGradesBySubject(userId: string, query: StudentDashboardMeQueryInput) {
    return this.studentsDashboardRepository.getGradesBySubject(query.tenantId, userId)
  }

  getAssignments(userId: string, query: StudentDashboardAssignmentsQueryInput) {
    return this.studentsDashboardRepository.getAssignments(
      query.tenantId,
      userId,
      query.page,
      query.limit,
      query.search
    )
  }

  async getAttendanceCalendar(userId: string, month: string, query: StudentDashboardMeQueryInput) {
    const studentRow = await this.studentsRepository.findStudentRowByUserIdOrThrow(
      query.tenantId,
      userId
    )

    return this.studentsDetailRepository.getAttendanceCalendar(
      query.tenantId,
      studentRow.student.id,
      month
    )
  }
}
