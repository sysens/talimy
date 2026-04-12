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

export function buildDueDate(month: string, day: number): string {
  return `${month}-${String(day).padStart(2, "0")}`
}

export function compareMonthValues(left: string, right: string): number {
  if (left === right) {
    return 0
  }

  return left < right ? -1 : 1
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

export function clampCurrency(value: number, min: number, max: number): number {
  return roundCurrency(Math.min(Math.max(value, min), max))
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
