export const studentDetailQueryKeys = {
  academicPerformance: (studentId: string, period: string) =>
    ["student-detail", studentId, "academic-performance", period] as const,
  attendanceCalendar: (studentId: string, month: string) =>
    ["student-detail", studentId, "attendance-calendar", month] as const,
  behaviorLog: (studentId: string) => ["student-detail", studentId, "behavior-log"] as const,
  documents: (studentId: string) => ["student-detail", studentId, "documents"] as const,
  extracurricular: (studentId: string) => ["student-detail", studentId, "extracurricular"] as const,
  health: (studentId: string) => ["student-detail", studentId, "health"] as const,
  overview: (studentId: string) => ["student-detail", studentId, "overview"] as const,
  scholarships: (studentId: string) => ["student-detail", studentId, "scholarships"] as const,
} as const
