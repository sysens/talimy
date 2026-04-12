import type {
  AttendanceRosterGridCellChange,
  AttendanceRosterGridColumn,
  AttendanceRosterGridRow,
} from "@/components/shared/attendance/attendance-roster-grid-card.types"

export type AdminAttendanceEntityType = "staff" | "students" | "teachers"
export type AdminAttendanceSummaryDate = "today"
export type AdminAttendanceTrendPeriod = "last_semester" | "this_semester"

export type AdminAttendanceSummaryResponse = {
  cards: ReadonlyArray<{
    absentCount: number
    absentShare: number
    key: AdminAttendanceEntityType
    lateCount: number
    lateShare: number
    onTimeCount: number
    onTimeShare: number
    totalChangePercentage: number
    totalPopulation: number
    totalPresent: number
  }>
  date: AdminAttendanceSummaryDate
}

export type AdminAttendanceTrendResponse = {
  period: AdminAttendanceTrendPeriod
  points: ReadonlyArray<{
    monthLabel: string
    monthNumber: number
    staff: number
    students: number
    teachers: number
  }>
}

export type AdminAttendanceOptionsResponse = {
  classes: ReadonlyArray<{
    id: string
    label: string
  }>
  departments: ReadonlyArray<{
    id: string
    label: string
  }>
  months: ReadonlyArray<{
    label: string
    value: string
  }>
}

export type AdminAttendanceGridResponse = {
  classId: string | null
  columns: ReadonlyArray<AttendanceRosterGridColumn>
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  month: string
  rows: ReadonlyArray<AttendanceRosterGridRow>
  type: AdminAttendanceEntityType
}

export type AdminAttendanceGridParams = {
  classId?: string
  department?: string
  limit: number
  month: string
  page: number
  type: AdminAttendanceEntityType
}

export type AdminAttendanceMarkPayload = {
  date: string
  type: AdminAttendanceEntityType
  records: ReadonlyArray<{
    entityId: string
    note?: string
    status: "absent" | "late" | "on_time"
  }>
}

export type AdminAttendanceCellChange = AttendanceRosterGridCellChange
