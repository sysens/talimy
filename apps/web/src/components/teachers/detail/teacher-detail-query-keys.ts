export const teacherDetailQueryKeys = {
  attendanceCalendar: (teacherId: string, month: string) =>
    ["teacher-detail", "attendance-calendar", teacherId, month] as const,
  documents: (teacherId: string) => ["teacher-detail", "documents", teacherId] as const,
  leaveRequests: (teacherId: string) => ["teacher-detail", "leave-requests", teacherId] as const,
  overview: (teacherId: string) => ["teacher-detail", "overview", teacherId] as const,
  performance: (teacherId: string, period: string) =>
    ["teacher-detail", "performance", teacherId, period] as const,
  training: (teacherId: string, semester: string) =>
    ["teacher-detail", "training", teacherId, semester] as const,
  workload: (teacherId: string, range: string) =>
    ["teacher-detail", "workload", teacherId, range] as const,
}
