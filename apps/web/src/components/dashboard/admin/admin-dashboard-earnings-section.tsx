"use client"

import type { MiniChartLegendItem } from "@talimy/ui"
import { Skeleton } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"

import { getAdminFinanceEarnings } from "@/components/dashboard/admin/dashboard-api"
import { mapEarningsRows } from "@/components/dashboard/admin/dashboard-api.mappers"
import type { DashboardEarningsPeriod } from "@/components/dashboard/admin/dashboard.types"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import {
  EarningsExpensesMiniChart,
  type EarningsExpensesRow,
} from "@/components/shared/charts/earnings-expenses-mini-chart"
import type { AppLocale } from "@/config/site"
import { useDashboardStore } from "@/stores/dashboard-store"

function createLegend(
  t: ReturnType<typeof useTranslations<"adminDashboard.earnings">>
): MiniChartLegendItem[] {
  return [
    {
      color: "var(--talimy-color-navy)",
      id: "earnings",
      label: t("legend.earnings"),
      marker: "line",
    },
    {
      color: "var(--talimy-color-pink)",
      id: "expenses",
      label: t("legend.expenses"),
      marker: "line",
    },
  ]
}

export function AdminDashboardEarningsSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard.earnings")
  const period = useDashboardStore((state) => state.activePeriodFilters.earnings)
  const setPeriodFilter = useDashboardStore((state) => state.setPeriodFilter)

  const chartProps = useMemo(
    () => ({
      filterAriaLabel: t("filterAriaLabel"),
      filterOptions: [
        { label: t("periods.lastYear"), value: "lastYear" },
        { label: t("periods.thisYear"), value: "thisYear" },
      ] as const,
      legend: createLegend(t),
      title: t("title"),
    }),
    [locale, t]
  )

  const earningsQuery = useQuery({
    queryKey: adminDashboardQueryKeys.earnings(locale, period),
    queryFn: async () => {
      const [lastYear, thisYear] = await Promise.all([
        getAdminFinanceEarnings("last_year"),
        getAdminFinanceEarnings("this_year"),
      ])

      return {
        ...chartProps,
        dataByPeriod: {
          lastYear: mapEarningsRows(locale, lastYear) as EarningsExpensesRow[],
          thisYear: mapEarningsRows(locale, thisYear) as EarningsExpensesRow[],
        } satisfies Record<DashboardEarningsPeriod, EarningsExpensesRow[]>,
      }
    },
    refetchInterval: 60_000,
  })

  if (earningsQuery.isLoading || !earningsQuery.data) {
    return <Skeleton className="h-[304px] rounded-[32px]" />
  }

  return (
    <EarningsExpensesMiniChart
      className="h-full min-h-[304px]"
      dataByPeriod={earningsQuery.data.dataByPeriod}
      filterAriaLabel={earningsQuery.data.filterAriaLabel}
      filterOptions={earningsQuery.data.filterOptions}
      legend={earningsQuery.data.legend}
      onPeriodChange={(value) => setPeriodFilter("earnings", value)}
      period={period}
      title={earningsQuery.data.title}
    />
  )
}
