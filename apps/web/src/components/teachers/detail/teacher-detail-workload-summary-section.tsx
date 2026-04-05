"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Skeleton } from "@talimy/ui"

import { WorkloadSummaryChartCard } from "@/components/shared/charts/workload-summary-chart-card"
import { getTeacherDetailWorkload } from "@/components/teachers/detail/teacher-detail-api"
import { mapWorkloadRecordsToChartPoints } from "@/components/teachers/detail/teacher-detail.mappers"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"

type WorkloadPeriod = "last8Months" | "thisSemester"

type TeacherDetailWorkloadSummarySectionProps = {
  teacherId: string
}

export function TeacherDetailWorkloadSummarySection({
  teacherId,
}: TeacherDetailWorkloadSummarySectionProps) {
  const [period, setPeriod] = React.useState<WorkloadPeriod>("last8Months")
  const locale = useLocale()
  const t = useTranslations("adminTeachers.detail.workload")
  const workloadQuery = useQuery({
    queryFn: () => getTeacherDetailWorkload(teacherId, period),
    queryKey: teacherDetailQueryKeys.workload(teacherId, period),
    staleTime: 60_000,
  })

  if (workloadQuery.isLoading) {
    return <Skeleton className="h-[318px] w-full rounded-[28px]" />
  }

  if (workloadQuery.isError || !workloadQuery.data) {
    return null
  }

  return (
    <WorkloadSummaryChartCard
      data={mapWorkloadRecordsToChartPoints(locale, workloadQuery.data)}
      filter={{
        ariaLabel: t("filterAriaLabel"),
        onValueChange: (value) => setPeriod(value as WorkloadPeriod),
        options: [
          { label: t("periodOptions.last8Months"), value: "last8Months" },
          { label: t("periodOptions.thisSemester"), value: "thisSemester" },
        ],
        value: period,
      }}
      title={t("title")}
    />
  )
}
