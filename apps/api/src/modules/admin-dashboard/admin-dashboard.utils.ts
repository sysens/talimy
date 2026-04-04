import type {
  AdminAttendanceOverviewPoint,
  AdminFinanceEarningsPoint,
  AdminStudentsPerformancePoint,
} from "./admin-dashboard.types"

type SemesterWindow = {
  endDate: Date
  monthNumbers: readonly number[]
  startDate: Date
}

type YearWindow = {
  endDate: Date
  monthNumbers: readonly number[]
  startDate: Date
  year: number
}

const FIRST_HALF_MONTHS = [1, 2, 3, 4, 5, 6] as const
const SECOND_HALF_MONTHS = [7, 8, 9, 10, 11, 12] as const
const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export function resolveSemesterWindow(
  period: "last_semester" | "this_semester",
  referenceDate: Date
): SemesterWindow {
  const referenceMonth = referenceDate.getUTCMonth() + 1
  const referenceYear = referenceDate.getUTCFullYear()

  if (period === "this_semester") {
    if (referenceMonth <= 6) {
      return buildDateWindow(referenceYear, FIRST_HALF_MONTHS)
    }

    return buildDateWindow(referenceYear, SECOND_HALF_MONTHS)
  }

  if (referenceMonth <= 6) {
    return buildDateWindow(referenceYear - 1, SECOND_HALF_MONTHS)
  }

  return buildDateWindow(referenceYear, FIRST_HALF_MONTHS)
}

export function resolveYearWindow(
  period: "last_year" | "this_year",
  referenceDate: Date
): YearWindow {
  const year =
    period === "this_year" ? referenceDate.getUTCFullYear() : referenceDate.getUTCFullYear() - 1
  const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
  const endDate = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0))

  return {
    endDate,
    monthNumbers: ALL_MONTHS,
    startDate,
    year,
  }
}

export function resolveRollingMonthWindow(referenceDate: Date): YearWindow {
  const startDate = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() - 5, 1, 0, 0, 0, 0)
  )
  const endDate = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1, 1, 0, 0, 0, 0)
  )
  const monthNumbers: number[] = []

  for (let index = 0; index < 6; index += 1) {
    const pointDate = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + index, 1, 0, 0, 0, 0)
    )
    monthNumbers.push(pointDate.getUTCMonth() + 1)
  }

  return {
    endDate,
    monthNumbers,
    startDate,
    year: referenceDate.getUTCFullYear(),
  }
}

export function resolveCurrentWeekWindow(referenceDate: Date): {
  days: readonly Date[]
  endDate: Date
  startDate: Date
} {
  const startDate = new Date(
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
  const dayOfWeek = startDate.getUTCDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  startDate.setUTCDate(startDate.getUTCDate() - daysFromMonday)

  const days = Array.from({ length: 6 }, (_, index) => {
    const nextDay = new Date(startDate)
    nextDay.setUTCDate(startDate.getUTCDate() + index)
    return nextDay
  })

  const endDate = new Date(days[5] ?? startDate)
  endDate.setUTCDate(endDate.getUTCDate() + 1)

  return { days, endDate, startDate }
}

export function fillStudentPerformancePoints(
  monthNumbers: readonly number[],
  valuesByMonth: ReadonlyMap<number, Partial<Record<"grade7" | "grade8" | "grade9", number>>>
): readonly AdminStudentsPerformancePoint[] {
  return monthNumbers.map((monthNumber) => {
    const row = valuesByMonth.get(monthNumber)

    return {
      grade7: row?.grade7 ?? 0,
      grade8: row?.grade8 ?? 0,
      grade9: row?.grade9 ?? 0,
      monthNumber,
    }
  })
}

export function fillMonthValuePoints(
  monthNumbers: readonly number[],
  valuesByMonth: ReadonlyMap<number, { earnings: number; expenses: number }>
): readonly AdminFinanceEarningsPoint[] {
  return monthNumbers.map((monthNumber) => ({
    earnings: valuesByMonth.get(monthNumber)?.earnings ?? 0,
    expenses: valuesByMonth.get(monthNumber)?.expenses ?? 0,
    monthNumber,
  }))
}

export function fillAttendancePoints(
  points: ReadonlyArray<{ date: string; label: string; value: number }>
): readonly AdminAttendanceOverviewPoint[] {
  return points.map((point) => ({
    date: point.date,
    label: point.label,
    value: point.value,
  }))
}

function buildDateWindow(year: number, monthNumbers: readonly number[]): SemesterWindow {
  const firstMonth = monthNumbers[0] ?? 1
  const lastMonth = monthNumbers[monthNumbers.length - 1] ?? 12
  const startDate = new Date(Date.UTC(year, firstMonth - 1, 1, 0, 0, 0, 0))
  const endDate = new Date(Date.UTC(year, lastMonth, 1, 0, 0, 0, 0))

  return {
    endDate,
    monthNumbers,
    startDate,
  }
}
