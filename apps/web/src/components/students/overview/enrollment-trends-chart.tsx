"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { AreaTrendChartCard } from "@/components/shared/charts/area-trend-chart-card"
import { getStudentsEnrollmentTrends } from "@/components/students/overview/students-overview-api"
import { studentsOverviewQueryKeys } from "@/components/students/overview/students-overview-query-keys"

export function EnrollmentTrendsChart() {
  const t = useTranslations("adminStudents.overview.enrollmentTrends")
  const years = 5
  const trendsQuery = useQuery({
    queryFn: () => getStudentsEnrollmentTrends(years),
    queryKey: studentsOverviewQueryKeys.enrollmentTrends(years),
    staleTime: 60_000,
  })
  const points = trendsQuery.data?.points ?? [{ label: "—", shortLabel: "—", value: 0 }]

  return (
    <AreaTrendChartCard
      dataByPeriod={{ lastFiveYears: points }}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[{ label: t("periods.lastFiveYears"), value: "lastFiveYears" }]}
      title={t("title")}
      yScaleValues={["16K", "12K", "8K", "4K", "0"]}
    />
  )
}
