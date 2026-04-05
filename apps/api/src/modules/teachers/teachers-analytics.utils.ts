import type { TeacherDepartmentKey, TeacherWorkloadItemView } from "./teachers-analytics.types"

const WORKWEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const

export function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10)
}

export function resolveWorkweek(referenceDate: Date): readonly Date[] {
  const start = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
      0,
      0,
      0,
      0
    )
  )
  const daysFromMonday = start.getUTCDay() === 0 ? 6 : start.getUTCDay() - 1
  start.setUTCDate(start.getUTCDate() - daysFromMonday)

  return WORKWEEK_LABELS.map((_, index) => {
    const day = new Date(start)
    day.setUTCDate(start.getUTCDate() + index)
    return day
  })
}

export function resolveRollingMonthStarts(referenceDate: Date, count: number): readonly Date[] {
  return Array.from({ length: count }, (_, index) => {
    const monthStart = new Date(
      Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth() - (count - 1 - index),
        1,
        0,
        0,
        0,
        0
      )
    )
    return monthStart
  })
}

export function resolveDepartmentKey(specialization: string | null): TeacherDepartmentKey {
  switch (specialization) {
    case "Science":
      return "science"
    case "Mathematics":
      return "mathematics"
    case "Language":
      return "language"
    case "Social":
      return "social"
    case "Arts":
      return "arts"
    case "Physical Education":
      return "physicalEducation"
    default:
      return "other"
  }
}

export function resolveDepartmentLabel(key: TeacherDepartmentKey): string {
  switch (key) {
    case "science":
      return "Science"
    case "mathematics":
      return "Mathematics"
    case "language":
      return "Language"
    case "social":
      return "Social"
    case "arts":
      return "Arts"
    case "physicalEducation":
      return "Physical Education"
    default:
      return "Other"
  }
}

export function resolveExtraDutyHours(
  totalClasses: number,
  employmentType: "full_time" | "part_time" | "substitute",
  period: "weekly" | "monthly"
): number {
  const weeklyBase =
    employmentType === "full_time"
      ? Math.max(3, Math.round(totalClasses * 0.35))
      : employmentType === "part_time"
        ? Math.max(2, Math.round(totalClasses * 0.28))
        : Math.max(1, Math.round(totalClasses * 0.22))

  return period === "monthly" ? weeklyBase * 4 : weeklyBase
}

export function scaleWorkloadItem(
  item: Omit<TeacherWorkloadItemView, "extraDuties"> & {
    employmentType: "full_time" | "part_time" | "substitute"
  },
  period: "weekly" | "monthly"
): TeacherWorkloadItemView {
  const multiplier = period === "monthly" ? 4 : 1
  const totalClasses = item.totalClasses * multiplier
  const teachingHours = item.teachingHours * multiplier

  return {
    extraDuties: resolveExtraDutyHours(totalClasses, item.employmentType, period),
    label: item.label,
    teacherId: item.teacherId,
    teachingHours,
    totalClasses,
  }
}
