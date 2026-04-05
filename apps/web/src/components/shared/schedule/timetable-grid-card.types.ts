export type TimetableDayKey = "friday" | "monday" | "thursday" | "tuesday" | "wednesday"

export type TimetableTone = "navy" | "pink" | "sky"

export type TimetableFilterOption = {
  label: string
  value: string
}

export type TimetableDay = {
  key: TimetableDayKey
  label: string
}

export type TimetableGridEntry = {
  day: TimetableDayKey
  endTime: string
  id: string
  startTime: string
  title: string
  tone?: TimetableTone
}
