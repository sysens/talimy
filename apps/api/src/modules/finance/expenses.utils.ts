export function buildMonthValue(date: Date): string {
  return date.toISOString().slice(0, 7)
}

export function normalizeMonthValue(month?: string): string {
  return typeof month === "string" && month.length === 7 ? month : buildMonthValue(new Date())
}

export function buildMonthStart(month: string): string {
  return `${month}-01`
}

export function buildMonthEndExclusive(month: string): string {
  const [yearText, monthText] = month.split("-")
  const year = Number(yearText)
  const monthIndex = Number(monthText) - 1
  const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1))
  return nextMonth.toISOString().slice(0, 10)
}

export function buildRecentMonthSeries(count: number): readonly string[] {
  const today = new Date()
  const months: string[] = []

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - offset, 1))
    months.push(current.toISOString().slice(0, 7))
  }

  return months
}

export function parseMoney(value: string | null | undefined): number {
  if (typeof value !== "string" || value.length === 0) {
    return 0
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

export function buildWeekRange(
  referenceDate: Date,
  week: "current" | "previous"
): {
  endExclusive: string
  start: string
} {
  const date = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    )
  )
  const day = date.getUTCDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const start = new Date(date)
  start.setUTCDate(date.getUTCDate() + mondayOffset + (week === "previous" ? -7 : 0))

  const endExclusive = new Date(start)
  endExclusive.setUTCDate(start.getUTCDate() + 7)

  return {
    endExclusive: endExclusive.toISOString().slice(0, 10),
    start: start.toISOString().slice(0, 10),
  }
}

export function resolveExpenseCode(sequence: number): string {
  return `EX-${String(sequence).padStart(4, "0")}`
}
