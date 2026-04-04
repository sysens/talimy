"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartFilterSelect,
  MultipleBarChart,
  Skeleton,
  type MultipleBarChartSeries,
} from "@talimy/ui"

import { getAdminStudentsPerformance } from "@/components/dashboard/admin/dashboard-api"
import { mapStudentPerformanceRows } from "@/components/dashboard/admin/dashboard-api.mappers"
import type { DashboardStudentPerformancePeriod } from "@/components/dashboard/admin/dashboard.types"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import type { AppLocale } from "@/config/site"
import { useDashboardStore } from "@/stores/dashboard-store"

type StudentPerformanceRow = {
  grade7: number
  grade8: number
  grade9: number
  month: string
}

type StudentPerformanceLegendItem = {
  color: string
  id: string
  label: string
}

const STUDENT_PERFORMANCE_Y_SCALE = ["100%", "75%", "50%", "25%", "0%"] as const

export function AdminDashboardStudentPerformanceSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard.studentPerformance")
  const period = useDashboardStore((state) => state.activePeriodFilters.studentPerformance)
  const setPeriodFilter = useDashboardStore((state) => state.setPeriodFilter)

  const studentPerformanceQuery = useQuery({
    queryKey: adminDashboardQueryKeys.studentPerformance(locale, period),
    queryFn: async () => {
      const series: MultipleBarChartSeries[] = [
        { barSize: 16, color: "var(--talimy-color-sky)", key: "grade7", label: t("legend.grade7") },
        {
          barSize: 16,
          color: "var(--talimy-color-pink)",
          key: "grade8",
          label: t("legend.grade8"),
        },
        {
          barSize: 16,
          color: "var(--talimy-color-navy)",
          key: "grade9",
          label: t("legend.grade9"),
        },
      ]
      const legend: StudentPerformanceLegendItem[] = series.map((item) => ({
        color: item.color,
        id: item.key,
        label: item.label,
      }))
      const source = await getAdminStudentsPerformance(
        period === "lastSemester" ? "last_semester" : "this_semester"
      )

      return {
        filterAriaLabel: t("filterAriaLabel"),
        filterOptions: [
          { label: t("periods.lastSemester"), value: "lastSemester" },
          { label: t("periods.thisSemester"), value: "thisSemester" },
        ] as const,
        legend,
        rows: mapStudentPerformanceRows(locale, source) as StudentPerformanceRow[],
        series,
        title: t("title"),
      }
    },
    refetchInterval: 60_000,
  })

  if (studentPerformanceQuery.isLoading || !studentPerformanceQuery.data) {
    return <Skeleton className="h-[320px] rounded-[32px]" />
  }

  const data = studentPerformanceQuery.data

  return (
    <Card className="rounded-[32px] border-0 bg-card shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pb-3">
        <div className="space-y-3">
          <CardTitle className="text-base font-semibold text-talimy-color-navy dark:text-sky-200">
            {data.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            {data.legend.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ChartFilterSelect
          ariaLabel={data.filterAriaLabel}
          onValueChange={(value) => {
            if (value === "lastSemester" || value === "thisSemester") {
              setPeriodFilter("studentPerformance", value)
            }
          }}
          options={[...data.filterOptions]}
          value={period}
        />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
          <div className="flex h-40 flex-col justify-between text-[11px] font-medium text-muted-foreground">
            {STUDENT_PERFORMANCE_Y_SCALE.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>

          <MultipleBarChart
            barCategoryGap={0}
            barGap={0}
            className="h-fit min-w-0"
            data={data.rows}
            hideFooter
            hideHeader
            hideTooltipLabel
            margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
            series={data.series}
            tooltipClassName="text-sm [&_.text-muted-foreground]:font-medium [&_.text-foreground]:text-sm [&_.text-foreground]:font-semibold"
            valueFormatter={(value) => `${value.toFixed(1)}%`}
            xAxisPadding={{ left: 0, right: 0 }}
            xKey="month"
          />
        </div>
      </CardContent>
    </Card>
  )
}
