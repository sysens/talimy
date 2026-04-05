import type {
  TimetableFilterOption,
  TimetableGridEntry,
} from "@/components/shared/schedule/timetable-grid-card.types"

export const DEFAULT_TIMETABLE_PERIOD_OPTIONS: readonly TimetableFilterOption[] = [
  { label: "Weekly", value: "weekly" },
] as const

export const DEFAULT_TIMETABLE_ENTRIES: readonly TimetableGridEntry[] = [
  {
    day: "monday",
    endTime: "10:00",
    id: "schedule-1",
    startTime: "09:00",
    title: "8C",
    tone: "sky",
  },
  {
    day: "monday",
    endTime: "15:00",
    id: "schedule-2",
    startTime: "13:00",
    title: "9A",
    tone: "navy",
  },
  {
    day: "tuesday",
    endTime: "11:00",
    id: "schedule-3",
    startTime: "09:30",
    title: "8C",
    tone: "sky",
  },
  {
    day: "wednesday",
    endTime: "10:00",
    id: "schedule-4",
    startTime: "08:00",
    title: "9A",
    tone: "navy",
  },
  {
    day: "wednesday",
    endTime: "12:00",
    id: "schedule-5",
    startTime: "10:00",
    title: "8C",
    tone: "sky",
  },
  {
    day: "thursday",
    endTime: "11:00",
    id: "schedule-6",
    startTime: "09:00",
    title: "9B",
    tone: "pink",
  },
  {
    day: "thursday",
    endTime: "15:00",
    id: "schedule-7",
    startTime: "13:00",
    title: "8C",
    tone: "sky",
  },
  {
    day: "friday",
    endTime: "10:00",
    id: "schedule-8",
    startTime: "08:00",
    title: "8C",
    tone: "sky",
  },
  {
    day: "friday",
    endTime: "15:00",
    id: "schedule-9",
    startTime: "13:00",
    title: "9B",
    tone: "pink",
  },
] as const
