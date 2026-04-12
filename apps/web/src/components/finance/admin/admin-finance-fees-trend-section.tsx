"use client"

import * as React from "react"
import { Skeleton } from "@talimy/ui"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getFinanceFeesTrend } from "@/components/finance/admin/finance-fees-api"
import {
  buildFinanceTrendYAxisValues,
  formatCompactUsdCurrency,
  formatFinanceMonthLabel,
  getFinanceTrendMonthsValue,
} from "@/components/finance/admin/finance-fees-formatters"
import { financeFeesQueryKeys } from "@/components/finance/admin/finance-fees-query-keys"
import type { FinanceFeesTrendMonths } from "@/components/finance/admin/finance-fees-api.types"
import { AreaTrendChartCard } from "@/components/shared/charts/area-trend-chart-card"

export function AdminFinanceFeesTrendSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinancePayments.trend")
  const [period, setPeriod] = React.useState<FinanceFeesTrendMonths>("last8Months")
  const months = getFinanceTrendMonthsValue(period)
  const trendQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getFinanceFeesTrend(months),
    queryKey: financeFeesQueryKeys.trend(months),
    staleTime: 60_000,
  })

  const points = React.useMemo(
    () =>
      (trendQuery.data?.points ?? []).map((point) => ({
        label: formatFinanceMonthLabel(locale, point.month, "long"),
        shortLabel: formatFinanceMonthLabel(locale, point.month, "short"),
        value: point.amount,
      })),
    [locale, trendQuery.data?.points]
  )

  if (trendQuery.isLoading && !trendQuery.data) {
    return <Skeleton className="h-[256px] rounded-[28px]" />
  }

  const dataByPeriod = {
    last6Months: period === "last6Months" ? points : [],
    last8Months: period === "last8Months" ? points : [],
  } as const

  const activePoints = points.length > 0 ? points : [{ label: "—", shortLabel: "—", value: 0 }]

  return (
    <AreaTrendChartCard
      className="h-full"
      dataByPeriod={{
        ...dataByPeriod,
        [period]: activePoints,
      }}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[
        { label: t("periods.last6Months"), value: "last6Months" },
        { label: t("periods.last8Months"), value: "last8Months" },
      ]}
      hoverContentClassName="min-w-[132px]"
      onPeriodChange={setPeriod}
      period={period}
      renderHoverContent={(point) => (
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-400">{point.label}</p>
          <p className="text-[13px] font-semibold text-talimy-navy">
            {formatCompactUsdCurrency(locale, point.value)}
          </p>
        </div>
      )}
      title={t("title")}
      valueFormatter={(value) => formatCompactUsdCurrency(locale, value).replace(".0", "")}
      yScaleValues={buildFinanceTrendYAxisValues(
        locale,
        Math.max(...activePoints.map((point) => point.value))
      )}
    />
  )
}
