import type { StudentDashboardScoreActivityPeriod } from "@/components/student/dashboard/student-dashboard-api.types"

export const studentDashboardQueryKeys = {
  root: ["student-dashboard"] as const,
  advice: () => [...studentDashboardQueryKeys.root, "advice"] as const,
  stats: () => [...studentDashboardQueryKeys.root, "stats"] as const,
  performanceSummary: () => [...studentDashboardQueryKeys.root, "performance-summary"] as const,
  scoreActivity: (period: StudentDashboardScoreActivityPeriod) =>
    [...studentDashboardQueryKeys.root, "score-activity", period] as const,
  lessons: () => [...studentDashboardQueryKeys.root, "lessons"] as const,
  gradesBySubject: () => [...studentDashboardQueryKeys.root, "grades-by-subject"] as const,
  assignments: (page: number, limit: number, search: string) =>
    [...studentDashboardQueryKeys.root, "assignments", page, limit, search] as const,
  attendanceCalendar: (month: string) =>
    [...studentDashboardQueryKeys.root, "attendance-calendar", month] as const,
  agenda: (limit: number, dateFrom: string) =>
    [...studentDashboardQueryKeys.root, "agenda", limit, dateFrom] as const,
}
