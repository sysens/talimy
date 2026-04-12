import type {
  FinanceFeeCategory,
  FinanceFeeStatus,
  FinanceFeesTrendMonths,
} from "@/components/finance/admin/finance-fees-api.types"

export function formatUsdCurrency(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, {
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value)
}

export function formatFinanceMonthLabel(
  locale: string,
  month: string,
  format: "long" | "short"
): string {
  const date = new Date(`${month}-01T00:00:00.000Z`)

  return new Intl.DateTimeFormat(locale, {
    month: format,
    timeZone: "UTC",
    year: format === "long" ? "numeric" : undefined,
  }).format(date)
}

export function formatFinanceDate(locale: string, date: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`))
}

export function formatCompactUsdCurrency(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, {
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
    minimumFractionDigits: 0,
    notation: value >= 1000 ? "compact" : "standard",
    style: "currency",
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getFinanceTrendMonthsValue(period: FinanceFeesTrendMonths): number {
  return period === "last6Months" ? 6 : 8
}

export function getCurrentFinanceMonthValue(): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function buildFinanceMonthOptions(
  locale: string,
  currentMonthLabel: string,
  totalMonths = 6
): readonly { label: string; value: string }[] {
  const currentMonth = getCurrentFinanceMonthValue()

  return Array.from({ length: totalMonths }, (_, index) => {
    const date = new Date(`${currentMonth}-01T00:00:00.000Z`)
    date.setUTCMonth(date.getUTCMonth() - index)

    const value = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`

    return {
      label: index === 0 ? currentMonthLabel : formatFinanceMonthLabel(locale, value, "long"),
      value,
    }
  })
}

export function buildFinanceTrendYAxisValues(locale: string, maxValue: number): readonly string[] {
  const roundedMax = maxValue <= 0 ? 1000 : Math.ceil(maxValue / 25000) * 25000

  return Array.from({ length: 5 }, (_, index) => {
    const value = roundedMax - (roundedMax / 4) * index
    return formatCompactUsdCurrency(locale, value).replace(".0", "")
  })
}

export function getFinanceFeeCategoryTranslationKey(categoryId: FinanceFeeCategory): string {
  switch (categoryId) {
    case "tuition_fee":
      return "tuitionFee"
    case "books_supplies":
      return "booksSupplies"
    case "activities":
      return "activities"
    case "miscellaneous":
      return "miscellaneous"
  }
}

export function getFinanceFeeStatusTranslationKey(status: FinanceFeeStatus): string {
  switch (status) {
    case "paid":
      return "paid"
    case "pending":
      return "pending"
    case "overdue":
      return "overdue"
    case "partially_paid":
      return "partiallyPaid"
  }
}
