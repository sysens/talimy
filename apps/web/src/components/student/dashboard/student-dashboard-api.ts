import { webApiFetch } from "@/lib/api"

import type {
  StudentDashboardAdviceRecord,
  StudentDashboardAgendaRecord,
  StudentDashboardAssignmentsRecord,
  StudentDashboardAttendanceCalendarRecord,
  StudentDashboardLessonsRecord,
  StudentDashboardPerformanceSummaryRecord,
  StudentDashboardScoreActivityPeriod,
  StudentDashboardScoreActivityRecord,
  StudentDashboardStatsRecord,
  StudentDashboardSubjectGradesRecord,
} from "@/components/student/dashboard/student-dashboard-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

function buildSearch(params: Record<string, number | string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      searchParams.set(key, String(value))
    }
  }

  const serialized = searchParams.toString()
  return serialized.length > 0 ? `?${serialized}` : ""
}

export function getStudentDashboardAdvice() {
  return webApiFetch<SuccessEnvelope<StudentDashboardAdviceRecord>>("/students/me/ai-advice").then(
    (response) => response.data
  )
}

export function getStudentDashboardStats() {
  return webApiFetch<SuccessEnvelope<StudentDashboardStatsRecord>>("/students/me/stats").then(
    (response) => response.data
  )
}

export function getStudentDashboardPerformanceSummary() {
  return webApiFetch<SuccessEnvelope<StudentDashboardPerformanceSummaryRecord>>(
    "/students/me/performance-summary"
  ).then((response) => response.data)
}

export function getStudentDashboardScoreActivity(period: StudentDashboardScoreActivityPeriod) {
  return webApiFetch<SuccessEnvelope<StudentDashboardScoreActivityRecord>>(
    `/students/me/score-activity${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getStudentDashboardLessons() {
  return webApiFetch<SuccessEnvelope<StudentDashboardLessonsRecord>>("/students/me/lessons").then(
    (response) => response.data
  )
}

export function getStudentDashboardGradesBySubject() {
  return webApiFetch<SuccessEnvelope<StudentDashboardSubjectGradesRecord>>(
    "/students/me/grades-by-subject"
  ).then((response) => response.data)
}

export function getStudentDashboardAssignments(params: {
  limit: number
  page: number
  search?: string
}) {
  return webApiFetch<SuccessEnvelope<StudentDashboardAssignmentsRecord>>(
    `/students/me/assignments${buildSearch(params)}`
  ).then((response) => response.data)
}

export function getStudentDashboardAttendanceCalendar(month: string) {
  return webApiFetch<SuccessEnvelope<StudentDashboardAttendanceCalendarRecord>>(
    `/students/me/attendance-calendar${buildSearch({ month })}`
  ).then((response) => response.data)
}

export function getStudentDashboardAgenda(limit: number, dateFrom: "today" | string = "today") {
  return webApiFetch<SuccessEnvelope<StudentDashboardAgendaRecord>>(
    `/events/me${buildSearch({ dateFrom, limit })}`
  ).then((response) => response.data)
}
