export type DashboardGradeFilter = "grade7" | "grade8" | "grade9"

export type DashboardStudentPerformancePeriod = "lastSemester" | "thisSemester"
export type DashboardStudentAttendancePeriod = "weekly" | "monthly"
export type DashboardEarningsPeriod = "lastYear" | "thisYear"

export type DashboardPeriodFilters = {
  earnings: DashboardEarningsPeriod
  studentAttendance: DashboardStudentAttendancePeriod
  studentPerformance: DashboardStudentPerformancePeriod
}
