import { webApiFetch } from "@/lib/api"
import type {
  AdminActivityResponse,
  AdminAttendanceOverviewResponse,
  AdminDashboardStatsResponse,
  AdminFinanceEarningsResponse,
  AdminStudentPerformanceResponse,
  AdminStudentsByGenderResponse,
  EventsResponse,
  NoticesResponse,
} from "@/components/dashboard/admin/dashboard-api.types"

type SuccessEnvelope<T> = {
  success: true
  data: T
}

function buildSearch(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      searchParams.set(key, String(value))
    }
  }

  const search = searchParams.toString()
  return search.length > 0 ? `?${search}` : ""
}

export function getAdminDashboardStats() {
  return webApiFetch<SuccessEnvelope<AdminDashboardStatsResponse>>("/admin/dashboard/stats").then(
    (response) => response.data
  )
}

export function getAdminStudentsPerformance(period: "last_semester" | "this_semester") {
  return webApiFetch<SuccessEnvelope<AdminStudentPerformanceResponse>>(
    `/admin/students/performance${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getAdminStudentsByGender(gradeId: "7" | "8" | "9") {
  return webApiFetch<SuccessEnvelope<AdminStudentsByGenderResponse>>(
    `/admin/students/by-gender${buildSearch({ gradeId })}`
  ).then((response) => response.data)
}

export function getAdminAttendanceOverview(period: "weekly" | "monthly") {
  return webApiFetch<SuccessEnvelope<AdminAttendanceOverviewResponse>>(
    `/admin/attendance/overview${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getAdminFinanceEarnings(period: "last_year" | "this_year") {
  return webApiFetch<SuccessEnvelope<AdminFinanceEarningsResponse>>(
    `/admin/finance/earnings${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getAdminRecentActivity(limit: number) {
  return webApiFetch<SuccessEnvelope<AdminActivityResponse>>(
    `/admin/activity${buildSearch({ limit })}`
  ).then((response) => response.data)
}

export function getDashboardNotices(sort: "popular" | "latest" | "oldest", limit: number) {
  const order = sort === "oldest" ? "asc" : "desc"
  const resolvedSort = sort === "popular" ? "popular" : "publishDate"

  return webApiFetch<SuccessEnvelope<NoticesResponse>>(
    `/notices${buildSearch({ limit, order, sort: resolvedSort })}`
  ).then((response) => response.data)
}

export function getDashboardEvents(dateFrom: string, dateTo: string, limit: number) {
  return webApiFetch<SuccessEnvelope<EventsResponse>>(
    `/events${buildSearch({ dateFrom, dateTo, limit, sort: "startDate" })}`
  ).then((response) => response.data)
}
