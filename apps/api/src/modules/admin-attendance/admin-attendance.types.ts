import type {
  AdminAttendanceGridQueryInput,
  AdminAttendanceSummaryQueryInput,
  AdminAttendanceTrendQueryInput,
} from "@talimy/shared"

export type AdminAttendanceSummaryCardKey = "staff" | "students" | "teachers"

export type AdminAttendanceSummaryCardView = {
  absentCount: number
  absentShare: number
  key: AdminAttendanceSummaryCardKey
  lateCount: number
  lateShare: number
  onTimeCount: number
  onTimeShare: number
  totalChangePercentage: number
  totalPopulation: number
  totalPresent: number
}

export type AdminAttendanceSummaryView = {
  cards: readonly AdminAttendanceSummaryCardView[]
  date: AdminAttendanceSummaryQueryInput["date"]
}

export type AdminAttendanceTrendPointView = {
  monthLabel: string
  monthNumber: number
  staff: number
  students: number
  teachers: number
}

export type AdminAttendanceTrendView = {
  period: AdminAttendanceTrendQueryInput["period"]
  points: readonly AdminAttendanceTrendPointView[]
}

export type AdminAttendanceOptionView = {
  id: string
  label: string
}

export type AdminAttendanceMonthOptionView = {
  label: string
  value: string
}

export type AdminAttendanceOptionsView = {
  classes: readonly AdminAttendanceOptionView[]
  departments: readonly AdminAttendanceOptionView[]
  months: readonly AdminAttendanceMonthOptionView[]
}

export type AdminAttendanceGridCellView = {
  columnId: string
  editable: boolean
  note?: string
  status: "absent" | "holiday" | "late" | "on_time" | "weekend"
}

export type AdminAttendanceGridRowView = {
  cells: readonly AdminAttendanceGridCellView[]
  id: string
  profile: {
    avatarFallback: string
    avatarSrc: string | null
    idLabel: string
    name: string
  }
}

export type AdminAttendanceGridColumnView = {
  date: string
  dateLabel: string
  id: string
  weekdayLabel: string
}

export type AdminAttendanceGridView = {
  classId: string | null
  columns: readonly AdminAttendanceGridColumnView[]
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  month: string
  rows: readonly AdminAttendanceGridRowView[]
  type: AdminAttendanceGridQueryInput["type"]
}
