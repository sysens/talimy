"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { getStudentDashboardGradesBySubject } from "@/components/student/dashboard/student-dashboard-api"
import { mapStudentSubjectRadarData } from "@/components/student/dashboard/student-dashboard.mappers"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { RadarMetricsChartCard } from "@/components/shared/charts/radar-metrics-chart-card"

export function StudentDashboardGradeRadarSection() {
  const t = useTranslations("studentDashboard.subjects")
  const gradesQuery = useQuery({
    queryFn: () => getStudentDashboardGradesBySubject(),
    queryKey: studentDashboardQueryKeys.gradesBySubject(),
    staleTime: 60_000,
  })

  if (gradesQuery.isLoading) {
    return <Skeleton className="h-[360px] rounded-[28px]" />
  }

  if (!gradesQuery.data) {
    return null
  }

  return (
    <RadarMetricsChartCard
      data={mapStudentSubjectRadarData(gradesQuery.data)}
      metricLabel={t("metricLabel")}
      title={t("title")}
    />
  )
}
