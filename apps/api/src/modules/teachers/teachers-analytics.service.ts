import { Injectable } from "@nestjs/common"

import type { TeacherAttendanceOverviewQueryDto } from "./dto/teacher-attendance-overview-query.dto"
import type { TeacherStatsQueryDto } from "./dto/teacher-stats-query.dto"
import type { TeacherWorkloadQueryDto } from "./dto/teacher-workload-query.dto"
import type { TeachersByDepartmentQueryDto } from "./dto/teachers-by-department-query.dto"
import { TeachersAnalyticsRepository } from "./teachers-analytics.repository"

@Injectable()
export class TeachersAnalyticsService {
  constructor(private readonly repository: TeachersAnalyticsRepository) {}

  getStats(query: TeacherStatsQueryDto) {
    return this.repository.getStats(query)
  }

  getAttendanceOverview(query: TeacherAttendanceOverviewQueryDto) {
    return this.repository.getAttendanceOverview(query)
  }

  getWorkload(query: TeacherWorkloadQueryDto) {
    return this.repository.getWorkload(query)
  }

  getByDepartment(query: TeachersByDepartmentQueryDto) {
    return this.repository.getByDepartment(query)
  }
}
