export type AttendanceRosterGridStatus = "absent" | "holiday" | "late" | "on_time" | "weekend"

export type AttendanceRosterGridEditableStatus = Extract<
  AttendanceRosterGridStatus,
  "absent" | "late" | "on_time"
>

export type AttendanceRosterGridStatusLabelMap = Record<AttendanceRosterGridStatus, string>

export type AttendanceRosterGridColumn = {
  dateLabel: string
  id: string
  weekdayLabel: string
}

export type AttendanceRosterGridCell = {
  columnId: string
  editable?: boolean
  note?: string
  status: AttendanceRosterGridStatus
}

export type AttendanceRosterGridProfile = {
  avatarFallback: string
  avatarSrc?: string | null
  idLabel: string
  name: string
}

export type AttendanceRosterGridRow = {
  cells: readonly AttendanceRosterGridCell[]
  id: string
  profile: AttendanceRosterGridProfile
}

export type AttendanceRosterGridCellChange = {
  columnId: string
  note?: string
  rowId: string
  status: AttendanceRosterGridEditableStatus
}
