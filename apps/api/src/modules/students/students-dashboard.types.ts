export type StudentDashboardAdviceView = {
  aiAdvice: string
  avatarUrl: string | null
  classLabel: string | null
  dateOfBirth: string | null
  email: string
  fullName: string
  phone: string | null
}

export type StudentDashboardStatsView = {
  attendancePercentage: number
  rewardPoints: number
  taskCompletedCount: number
  taskInProgressPercentage: number
}

export type StudentDashboardPerformanceSummaryView = {
  averageGpaMax: number
  averageGpaValue: number
  rangeLabel: string
}

export type StudentDashboardScoreActivityPointView = {
  id: string
  recordedAt: string
  value: number
}

export type StudentDashboardScoreActivityView = {
  period: "weekly"
  points: readonly StudentDashboardScoreActivityPointView[]
}

export type StudentDashboardLessonItemView = {
  dayScope: "today" | "tomorrow"
  endTime: string
  id: string
  roomLabel: string | null
  startTime: string
  subjectName: string
  teacherName: string
}

export type StudentDashboardLessonsSectionView = {
  id: "today" | "tomorrow"
  lessons: readonly StudentDashboardLessonItemView[]
}

export type StudentDashboardLessonsView = {
  sections: readonly StudentDashboardLessonsSectionView[]
}

export type StudentDashboardSubjectGradeView = {
  score: number
  subjectName: string
}

export type StudentDashboardSubjectGradesView = {
  subjects: readonly StudentDashboardSubjectGradeView[]
}

export type StudentDashboardAssignmentStatusView = "inProgress" | "notStarted" | "submitted"

export type StudentDashboardAssignmentItemView = {
  dueAt: string
  id: string
  order: number
  status: StudentDashboardAssignmentStatusView
  subjectName: string
  taskTitle: string
}

export type StudentDashboardAssignmentsView = {
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  rows: readonly StudentDashboardAssignmentItemView[]
}
