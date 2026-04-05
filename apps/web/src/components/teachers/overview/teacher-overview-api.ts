import type {
  TeacherOverviewAttendancePeriod,
  TeacherOverviewAttendanceResponse,
  TeacherOverviewDepartmentResponse,
  TeacherOverviewStatsResponse,
  TeacherOverviewWorkloadPeriod,
  TeacherOverviewWorkloadResponse,
} from "@/components/teachers/overview/teacher-overview-api.types"
import { webApiFetch } from "@/lib/api"

type SuccessEnvelope<T> = {
  success: true
  data: T
}

function buildSearch(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }
  }

  const search = searchParams.toString()
  return search.length > 0 ? `?${search}` : ""
}

export function getTeacherOverviewStats() {
  return webApiFetch<SuccessEnvelope<TeacherOverviewStatsResponse>>("/teachers/stats").then(
    (response) => response.data
  )
}

export function getTeacherAttendanceOverview(period: TeacherOverviewAttendancePeriod) {
  return webApiFetch<SuccessEnvelope<TeacherOverviewAttendanceResponse>>(
    `/teachers/attendance-overview${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getTeacherWorkload(period: TeacherOverviewWorkloadPeriod, subjectId?: string) {
  return webApiFetch<SuccessEnvelope<TeacherOverviewWorkloadResponse>>(
    `/teachers/workload${buildSearch({ period, subjectId })}`
  ).then((response) => response.data)
}

export function getTeachersByDepartment() {
  return webApiFetch<SuccessEnvelope<TeacherOverviewDepartmentResponse>>(
    "/teachers/by-department"
  ).then((response) => response.data)
}
