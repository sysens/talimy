export const studentsOverviewQueryKeys = {
  academicPerformance: (period: "last_semester" | "this_semester") =>
    ["students-overview", "academic-performance", period] as const,
  attendanceWeekly: () => ["students-overview", "attendance-weekly"] as const,
  enrollmentTrends: (years: number) => ["students-overview", "enrollment-trends", years] as const,
  specialPrograms: (limit: number) => ["students-overview", "special-programs", limit] as const,
  stats: () => ["students-overview", "stats"] as const,
}
