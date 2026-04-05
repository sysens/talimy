"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { getTeacherDetailPerformance } from "@/components/teachers/detail/teacher-detail-api"
import { mapPerformanceRecordToCardItems } from "@/components/teachers/detail/teacher-detail.mappers"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"
import { MetricProgressCard } from "@/components/shared/performance/metric-progress-card"

type PerformancePeriod = "lastMonth" | "lastQuarter"

type TeacherDetailPerformanceSectionProps = {
  teacherId: string
}

export function TeacherDetailPerformanceSection({
  teacherId,
}: TeacherDetailPerformanceSectionProps) {
  const [period, setPeriod] = React.useState<PerformancePeriod>("lastMonth")
  const t = useTranslations("adminTeachers.detail.performance")

  const performanceQuery = useQuery({
    queryFn: () => getTeacherDetailPerformance(teacherId, period),
    queryKey: teacherDetailQueryKeys.performance(teacherId, period),
    staleTime: 60_000,
  })

  if (performanceQuery.isLoading) {
    return <Skeleton className="h-[200px] w-72 rounded-[28px]" />
  }

  if (performanceQuery.isError || !performanceQuery.data) {
    return null
  }

  return (
    <MetricProgressCard
      className="w-72"
      filter={{
        ariaLabel: t("filterAriaLabel"),
        onValueChange: (value) => setPeriod(value as PerformancePeriod),
        options: [
          { label: t("periodOptions.lastMonth"), value: "lastMonth" },
          { label: t("periodOptions.lastQuarter"), value: "lastQuarter" },
        ],
        value: period,
      }}
      items={mapPerformanceRecordToCardItems(performanceQuery.data)}
      title={t("title")}
    />
  )
}
