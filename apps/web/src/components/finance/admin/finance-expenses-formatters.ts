import type {
  FinanceExpenseCategory,
  FinanceExpenseCategoryFilter,
  FinanceReimbursementStatus,
} from "@/components/finance/admin/finance-expenses-api.types"
import { formatMonthShort } from "@/lib/dashboard/dashboard-formatters"

export type FinanceExpensesPeriod = "last8Months"
export type FinanceExpensesWeekFilter = "thisWeek"

const LONG_MONTH_LABELS: Record<string, readonly string[]> = {
  uz: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],
  tr: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  ar: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
} as const

export function formatFinanceExpenseDate(locale: string, value: string): string {
  const date = new Date(value)
  const baseLocale = locale.split("-")[0]?.toLowerCase() ?? locale
  const monthLabels = LONG_MONTH_LABELS[baseLocale] ?? LONG_MONTH_LABELS["en"]
  const safeMonthLabels = monthLabels ?? LONG_MONTH_LABELS["en"] ?? []
  const monthName = safeMonthLabels[date.getUTCMonth()] ?? String(date.getUTCMonth() + 1)
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  if (baseLocale === "ar") {
    return `${day} ${monthName} ${year}`
  }
  return `${day}-${monthName.toLowerCase()}, ${year}`
}

export function formatUsdCurrency(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, {
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value)
}

export function buildFinanceExpenseMonthOptions(locale: string, thisMonthLabel: string) {
  const options: Array<{ label: string; value: string }> = []
  const now = new Date()

  for (let offset = 0; offset < 8; offset += 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))
    const monthValue = date.toISOString().slice(0, 7)
    const monthNumber = date.getUTCMonth() + 1
    const year = date.getUTCFullYear()

    options.push({
      label: offset === 0 ? thisMonthLabel : `${formatMonthShort(locale, monthNumber)} ${year}`,
      value: monthValue,
    })
  }

  return options
}

export function getCurrentFinanceExpenseMonthValue(): string {
  return new Date().toISOString().slice(0, 7)
}

export function getFinanceExpenseCategoryTranslationKey(category: FinanceExpenseCategory): string {
  return category
}

export function getFinanceExpenseFilterTranslationKey(
  category: FinanceExpenseCategoryFilter
): "all" | FinanceExpenseCategory {
  return category === "all" ? "all" : category
}

export function getFinanceReimbursementStatusTranslationKey(
  status: FinanceReimbursementStatus
): FinanceReimbursementStatus {
  return status
}
