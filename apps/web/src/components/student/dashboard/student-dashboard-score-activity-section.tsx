"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { getStudentDashboardScoreActivity } from "@/components/student/dashboard/student-dashboard-api"
import type { StudentDashboardScoreActivityPeriod } from "@/components/student/dashboard/student-dashboard-api.types"
import { mapStudentScoreActivityPoints } from "@/components/student/dashboard/student-dashboard.mappers"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { ScoreActivityChartCard } from "@/components/shared/charts/score-activity-chart-card"
import type { AppLocale } from "@/config/site"

export function StudentDashboardScoreActivitySection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("studentDashboard.scoreActivity")
  const [period, setPeriod] = React.useState<StudentDashboardScoreActivityPeriod>("weekly")
  const scoreActivityQuery = useQuery({
    queryFn: () => getStudentDashboardScoreActivity(period),
    queryKey: studentDashboardQueryKeys.scoreActivity(period),
    staleTime: 60_000,
  })

  if (scoreActivityQuery.isLoading) {
    return <Skeleton className="h-[360px] rounded-[28px]" />
  }

  if (!scoreActivityQuery.data) {
    return null
  }

  return (
    <ScoreActivityChartCard
      data={mapStudentScoreActivityPoints(locale, scoreActivityQuery.data)}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[{ label: t("weekly"), value: "weekly" }]}
      metricLabel={t("metricLabel")}
      onPeriodChange={setPeriod}
      period={period}
      title={t("title")}
    />
  )
}
