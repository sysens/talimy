"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { getStudentDashboardPerformanceSummary } from "@/components/student/dashboard/student-dashboard-api"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { PerformanceGaugeCard } from "@/components/shared/charts/performance-gauge-card"

export function StudentDashboardPerformanceGaugeSection() {
  const t = useTranslations("studentDashboard.performance")
  const performanceQuery = useQuery({
    queryFn: () => getStudentDashboardPerformanceSummary(),
    queryKey: studentDashboardQueryKeys.performanceSummary(),
    staleTime: 60_000,
  })

  if (performanceQuery.isLoading) {
    return <Skeleton className="h-[280px] rounded-[28px]" />
  }

  if (!performanceQuery.data) {
    return null
  }

  return (
    <PerformanceGaugeCard
      centerLabel={t("centerLabel")}
      maxValue={performanceQuery.data.averageGpaMax}
      remainingLabel={t("remainingLabel")}
      rangeLabel={t("rangeLabel")}
      title={t("title")}
      value={performanceQuery.data.averageGpaValue}
    />
  )
}
