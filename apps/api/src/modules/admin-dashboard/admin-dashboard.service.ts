import { Injectable } from "@nestjs/common"

import type { AdminActivityQueryDto } from "./dto/admin-activity-query.dto"
import type { AdminAttendanceOverviewQueryDto } from "./dto/admin-attendance-overview-query.dto"
import type { AdminDashboardStatsQueryDto } from "./dto/admin-dashboard-stats-query.dto"
import type { AdminFinanceEarningsQueryDto } from "./dto/admin-finance-earnings-query.dto"
import type { AdminStudentsByGenderQueryDto } from "./dto/admin-students-by-gender-query.dto"
import type { AdminStudentsPerformanceQueryDto } from "./dto/admin-students-performance-query.dto"
import { AdminDashboardRepository } from "./admin-dashboard.repository"

@Injectable()
export class AdminDashboardService {
  constructor(private readonly repository: AdminDashboardRepository) {}

  getStats(query: AdminDashboardStatsQueryDto) {
    return this.repository.getStats(query)
  }

  getStudentsPerformance(query: AdminStudentsPerformanceQueryDto) {
    return this.repository.getStudentsPerformance(query)
  }

  getStudentsByGender(query: AdminStudentsByGenderQueryDto) {
    return this.repository.getStudentsByGender(query)
  }

  getAttendanceOverview(query: AdminAttendanceOverviewQueryDto) {
    return this.repository.getAttendanceOverview(query)
  }

  getFinanceEarnings(query: AdminFinanceEarningsQueryDto) {
    return this.repository.getFinanceEarnings(query)
  }

  getRecentActivity(query: AdminActivityQueryDto) {
    return this.repository.getRecentActivity(query)
  }
}
