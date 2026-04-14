export type StudentDashboardAdviceRecord = {
  aiAdvice: string
  avatarUrl: string | null
  classLabel: string | null
  dateOfBirth: string | null
  email: string
  fullName: string
  phone: string | null
}

export type StudentDashboardStatsRecord = {
  attendancePercentage: number
  rewardPoints: number
  taskCompletedCount: number
  taskInProgressPercentage: number
}

export type StudentDashboardPerformanceSummaryRecord = {
  averageGpaMax: number
  averageGpaValue: number
  rangeLabel: string
}

export type StudentDashboardScoreActivityPeriod = "weekly"

export type StudentDashboardScoreActivityRecord = {
  period: StudentDashboardScoreActivityPeriod
  points: ReadonlyArray<{
    id: string
    recordedAt: string
    value: number
  }>
}

export type StudentDashboardLessonRecord = {
  dayScope: "today" | "tomorrow"
  endTime: string
  id: string
  roomLabel: string | null
  startTime: string
  subjectName: string
  teacherName: string
}

export type StudentDashboardLessonsRecord = {
  sections: ReadonlyArray<{
    id: "today" | "tomorrow"
    lessons: ReadonlyArray<StudentDashboardLessonRecord>
  }>
}

export type StudentDashboardSubjectGradesRecord = {
  subjects: ReadonlyArray<{
    score: number
    subjectName: string
  }>
}

export type StudentDashboardAssignmentStatus = "inProgress" | "notStarted" | "submitted"

export type StudentDashboardAssignmentsRecord = {
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  rows: ReadonlyArray<{
    dueAt: string
    id: string
    order: number
    status: StudentDashboardAssignmentStatus
    subjectName: string
    taskTitle: string
  }>
}

export type StudentDashboardAttendanceCalendarRecord = ReadonlyArray<{
  key: string
  monthNumber: number
  selectedDay: number | null
  statuses: Partial<Record<number, "absent" | "late" | "present" | "sick">>
  summary: ReadonlyArray<{
    label: "Absent" | "Late" | "Present" | "Sick"
    status: "absent" | "late" | "present" | "sick"
    value: number
  }>
  year: number
}>

export type StudentDashboardAgendaRecord = {
  data: ReadonlyArray<{
    createdAt: string
    description: string | null
    endDate: string
    id: string
    location: string | null
    startDate: string
    tenantId: string
    title: string
    type:
      | "academic"
      | "administration"
      | "events"
      | "exam"
      | "finance"
      | "holiday"
      | "other"
      | "sports"
    updatedAt: string
    visibility: "admin" | "all" | "students" | "teachers"
  }>
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
}
