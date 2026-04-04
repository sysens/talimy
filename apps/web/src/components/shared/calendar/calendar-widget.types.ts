export type CalendarIconKey = "announcement" | "books" | "classroom" | "meeting" | "workshop"

export type CalendarEntry = {
  colorClassName: string
  day: number
  iconKey: CalendarIconKey
  metaLabel: string
  title: string
}

export type CalendarAttendanceStatus = "late" | "onLeave" | "present"

export type CalendarAttendanceSummary = {
  colorClassName: string
  label: string
  value: number
}

export type CalendarBaseMonthData = {
  key: string
  month: string
  monthNumber: number
  selectedDay: number | null
  year: number
}

export type CalendarEventsMonthData = CalendarBaseMonthData & {
  events: Partial<Record<number, readonly CalendarEntry[]>>
  kind: "events"
}

export type CalendarAttendanceMonthData = CalendarBaseMonthData & {
  kind: "attendance"
  statuses: Partial<Record<number, CalendarAttendanceStatus>>
  summary: readonly CalendarAttendanceSummary[]
}

export type CalendarMonthData = CalendarAttendanceMonthData | CalendarEventsMonthData

export type CalendarViewVariant = CalendarMonthData["kind"]

export const CALENDAR_DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"] as const

export type CalendarDayCell = {
  day: number
  isCurrentMonth: boolean
  key: string
}

export function buildCalendarGrid(month: number, year: number): CalendarDayCell[] {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPreviousMonth = new Date(year, month - 1, 0).getDate()
  const cells: CalendarDayCell[] = []

  for (let day = firstDay; day > 0; day -= 1) {
    const previousMonthDay = daysInPreviousMonth - day + 1

    cells.push({
      day: previousMonthDay,
      isCurrentMonth: false,
      key: `prev-${previousMonthDay}`,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      isCurrentMonth: true,
      key: `current-${day}`,
    })
  }

  let nextMonthDay = 1

  while (cells.length % 7 !== 0 || cells.length < 35) {
    cells.push({
      day: nextMonthDay,
      isCurrentMonth: false,
      key: `next-${nextMonthDay}`,
    })
    nextMonthDay += 1
  }

  return cells
}
