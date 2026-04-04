import type {
  DashboardEarningsPeriod,
  DashboardGradeFilter,
  DashboardStudentAttendancePeriod,
  DashboardStudentPerformancePeriod,
} from "@/components/dashboard/admin/dashboard.types"

export const adminDashboardQueryKeys = {
  calendar: (locale: string, selectedDate: string) =>
    ["admin-dashboard", locale, "calendar", selectedDate] as const,
  earnings: (locale: string, period: DashboardEarningsPeriod) =>
    ["admin-dashboard", locale, "earnings", period] as const,
  events: (locale: string, selectedDate: string) =>
    ["admin-dashboard", locale, "events", selectedDate] as const,
  notices: (locale: string) => ["admin-dashboard", locale, "notices"] as const,
  recentActivity: (locale: string) => ["admin-dashboard", locale, "recent-activity"] as const,
  stats: (locale: string) => ["admin-dashboard", locale, "stats"] as const,
  studentAttendance: (locale: string, period: DashboardStudentAttendancePeriod) =>
    ["admin-dashboard", locale, "student-attendance", period] as const,
  studentPerformance: (locale: string, period: DashboardStudentPerformancePeriod) =>
    ["admin-dashboard", locale, "student-performance", period] as const,
  studentsByGender: (locale: string, grade: DashboardGradeFilter) =>
    ["admin-dashboard", locale, "students-by-gender", grade] as const,
  todos: (locale: string) => ["admin-dashboard", locale, "todos"] as const,
} as const
