import type {
  AdminAttendanceEntityType,
  AdminAttendanceSummaryDate,
  AdminAttendanceTrendPeriod,
} from "@/components/attendance/admin/admin-attendance-api.types"

type AdminAttendanceGridKeyParams = {
  classId?: string
  department?: string
  limit: number
  month: string
  page: number
  type: AdminAttendanceEntityType
}

export const adminAttendanceQueryKeys = {
  grid: (params: AdminAttendanceGridKeyParams) => ["admin-attendance", "grid", params] as const,
  options: () => ["admin-attendance", "options"] as const,
  summary: (date: AdminAttendanceSummaryDate) => ["admin-attendance", "summary", date] as const,
  trends: (period: AdminAttendanceTrendPeriod) => ["admin-attendance", "trends", period] as const,
}
