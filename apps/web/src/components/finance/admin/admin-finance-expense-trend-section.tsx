"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { getFinanceExpensesTrend } from "@/components/finance/admin/finance-expenses-api"
import { formatUsdCurrency } from "@/components/finance/admin/finance-expenses-formatters"
import { financeExpensesQueryKeys } from "@/components/finance/admin/finance-expenses-query-keys"
import {
  ExpenseTrendChartCard,
  type ExpenseTrendChartPoint,
} from "@/components/shared/finance/expense-trend-chart-card"
import { formatMonthShort } from "@/lib/dashboard/dashboard-formatters"

export function AdminFinanceExpenseTrendSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinanceExpenses.trend")
  const trendQuery = useQuery({
    queryFn: () => getFinanceExpensesTrend(8),
    queryKey: financeExpensesQueryKeys.trend(8),
    staleTime: 60_000,
  })

  const chartData = React.useMemo<readonly ExpenseTrendChartPoint[]>(() => {
    if (!trendQuery.data) {
      return []
    }

    return trendQuery.data.points.map((point, index, array) => {
      const [yearText, monthText] = point.month.split("-")
      const monthNumber = Number(monthText)
      const year = Number(yearText)
      const label = new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(new Date(Date.UTC(year, monthNumber - 1, 1)))

      return {
        isCurrent: index === array.length - 1,
        label,
        shortLabel: formatMonthShort(locale, monthNumber),
        value: point.amount,
      }
    })
  }, [locale, trendQuery.data])

  if (trendQuery.isLoading && !trendQuery.data) {
    return (
      <Card className="rounded-[28px] border border-slate-100 bg-white py-0 shadow-none">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-40 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-2xl" />
          </div>
          <Skeleton className="h-[210px] rounded-[22px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <ExpenseTrendChartCard
      className="h-full"
      dataByPeriod={{ last8Months: chartData }}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[{ label: t("periods.last8Months"), value: "last8Months" }]}
      title={t("title")}
      valueFormatter={(value) => formatUsdCurrency(locale, value)}
      yScaleValues={["$100K", "$75K", "$50K", "$25K", "$0K"]}
    />
  )
}
