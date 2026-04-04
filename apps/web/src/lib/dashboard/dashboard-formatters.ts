import { type AppLocale, isSupportedLocale } from "@/config/site"

const SHORT_MONTH_LABELS: Record<AppLocale, readonly string[]> = {
  ar: ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  tr: ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"],
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
}

function getShortMonthLabel(locale: AppLocale, monthNumber: number): string {
  return (
    SHORT_MONTH_LABELS[locale][monthNumber - 1] ?? SHORT_MONTH_LABELS.uz[monthNumber - 1] ?? "Jan"
  )
}

export function formatMonthShort(locale: string, monthNumber: number): string {
  const normalizedMonthNumber = Math.min(Math.max(monthNumber, 1), 12)

  if (isSupportedLocale(locale)) {
    return getShortMonthLabel(locale, normalizedMonthNumber)
  }

  const normalizedLocale = locale.split("-")[0]?.toLowerCase()
  if (normalizedLocale && isSupportedLocale(normalizedLocale)) {
    return getShortMonthLabel(normalizedLocale, normalizedMonthNumber)
  }

  return new Intl.DateTimeFormat(locale, { month: "short" })
    .format(new Date(2035, normalizedMonthNumber - 1, 1))
    .replace(".", "")
}

export function formatMonthDay(locale: string, value: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(new Date(value))
}

export function formatMonthDayYear(locale: string, value: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export function formatDateTime(locale: string, value: string): string {
  const date = new Date(value)
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
  const timeLabel = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

  return `${dateLabel} - ${timeLabel}`
}

export function formatCalendarMonth(locale: string, monthNumber: number, year: number): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1))
}

export function buildWeekdayLabels(locale: string): readonly string[] {
  const baseDate = new Date(Date.UTC(2035, 2, 4))

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate)
    date.setUTCDate(baseDate.getUTCDate() + index)

    return new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(date)
  })
}
