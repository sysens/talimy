import type {
  TimetableDay,
  TimetableDayKey,
  TimetableGridEntry,
  TimetableTone,
} from "@/components/shared/schedule/timetable-grid-card.types"

export const TIMETABLE_DAYS: readonly TimetableDay[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
] as const

export const TIMETABLE_TONE_CLASS_NAMES: Record<TimetableTone, string> = {
  navy: "bg-talimy-navy text-white",
  pink: "bg-[var(--talimy-color-pink)] text-talimy-navy",
  sky: "bg-[var(--talimy-color-sky)] text-talimy-navy",
}

export function buildTimeLabels(startHour: number, endHour: number): string[] {
  return Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => `${String(startHour + index).padStart(2, "0")}:00`
  )
}

export function parseTimeToMinutes(value: string): number {
  const [hoursRaw, minutesRaw] = value.split(":")
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return 0
  }

  return hours * 60 + minutes
}

export function getEntryLayout(
  entry: TimetableGridEntry,
  startHour: number,
  endHour: number,
  bodyHeight: number
): { height: number; top: number } {
  const rangeStartMinutes = startHour * 60
  const rangeEndMinutes = endHour * 60
  const totalMinutes = Math.max(rangeEndMinutes - rangeStartMinutes, 1)
  const startMinutes = Math.max(parseTimeToMinutes(entry.startTime), rangeStartMinutes)
  const endMinutes = Math.min(parseTimeToMinutes(entry.endTime), rangeEndMinutes)
  const clampedDuration = Math.max(endMinutes - startMinutes, 45)
  const top = ((startMinutes - rangeStartMinutes) / totalMinutes) * bodyHeight
  const height = (clampedDuration / totalMinutes) * bodyHeight

  return {
    height,
    top,
  }
}

export function getEntriesForDay(
  entries: readonly TimetableGridEntry[],
  dayKey: TimetableDayKey
): readonly TimetableGridEntry[] {
  return entries.filter((entry) => entry.day === dayKey)
}
