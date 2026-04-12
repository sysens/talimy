import { webApiFetch } from "@/lib/api"

import type {
  AdminAttendanceGridParams,
  AdminAttendanceGridResponse,
  AdminAttendanceMarkPayload,
  AdminAttendanceOptionsResponse,
  AdminAttendanceSummaryDate,
  AdminAttendanceSummaryResponse,
  AdminAttendanceTrendPeriod,
  AdminAttendanceTrendResponse,
} from "@/components/attendance/admin/admin-attendance-api.types"

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

export function getAdminAttendanceSummary(date: AdminAttendanceSummaryDate) {
  return webApiFetch<SuccessEnvelope<AdminAttendanceSummaryResponse>>(
    `/admin/attendance/summary${buildSearch({ date })}`
  ).then((response) => response.data)
}

export function getAdminAttendanceTrends(period: AdminAttendanceTrendPeriod) {
  return webApiFetch<SuccessEnvelope<AdminAttendanceTrendResponse>>(
    `/admin/attendance/trends${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getAdminAttendanceOptions() {
  return webApiFetch<SuccessEnvelope<AdminAttendanceOptionsResponse>>(
    "/admin/attendance/options"
  ).then((response) => response.data)
}

export function getAdminAttendanceGrid(params: AdminAttendanceGridParams) {
  return webApiFetch<SuccessEnvelope<AdminAttendanceGridResponse>>(
    `/admin/attendance/grid${buildSearch(params)}`
  ).then((response) => response.data)
}

export function markAdminAttendance(payload: AdminAttendanceMarkPayload) {
  return webApiFetch<SuccessEnvelope<{ affected: number; success: true }>>(
    "/admin/attendance/mark",
    {
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }
  ).then((response) => response.data)
}
