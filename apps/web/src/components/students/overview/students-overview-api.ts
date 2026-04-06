import { webApiFetch } from "@/lib/api"

import type {
  StudentsAcademicPerformanceResponse,
  StudentsAttendanceWeeklyResponse,
  StudentsEnrollmentTrendsResponse,
  StudentsSpecialProgramsResponse,
  StudentsStatsResponse,
} from "@/components/students/overview/students-overview-api.types"

type SuccessEnvelope<T> = {
  success: true
  data: T
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

export function getStudentsStats() {
  return webApiFetch<SuccessEnvelope<StudentsStatsResponse>>("/students/stats").then(
    (response) => response.data
  )
}

export function getStudentsAcademicPerformance(period: "last_semester" | "this_semester") {
  return webApiFetch<SuccessEnvelope<StudentsAcademicPerformanceResponse>>(
    `/admin/students/performance${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getStudentsEnrollmentTrends(years: number) {
  return webApiFetch<SuccessEnvelope<StudentsEnrollmentTrendsResponse>>(
    `/admin/students/enrollment-trends${buildSearch({ years })}`
  ).then((response) => response.data)
}

export function getStudentsAttendanceWeekly() {
  return webApiFetch<SuccessEnvelope<StudentsAttendanceWeeklyResponse>>(
    `/admin/attendance/weekly${buildSearch({ week: "current" })}`
  ).then((response) => response.data)
}

export function getStudentsSpecialPrograms(limit: number) {
  return webApiFetch<SuccessEnvelope<StudentsSpecialProgramsResponse>>(
    `/students/special-programs${buildSearch({ hasGrant: "true", limit })}`
  ).then((response) => response.data)
}
