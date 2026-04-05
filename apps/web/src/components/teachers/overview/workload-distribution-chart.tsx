"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { ChartBarStacked, ChartFilterSelect, Skeleton } from "@talimy/ui"

import { getTeacherWorkload } from "@/components/teachers/overview/teacher-overview-api"
import type {
  TeacherOverviewDepartmentKey,
  TeacherOverviewWorkloadPeriod,
} from "@/components/teachers/overview/teacher-overview-api.types"
import { teacherOverviewQueryKeys } from "@/components/teachers/overview/teacher-overview-query-keys"

const WORKLOAD_SERIES = [
  { color: "var(--talimy-color-pink)", key: "totalClasses", labelKey: "totalClasses" },
  { color: "var(--talimy-color-sky)", key: "teachingHours", labelKey: "teachingHours" },
  { color: "var(--talimy-color-navy)", key: "extraDuties", labelKey: "extraDuties" },
] as const

export function WorkloadDistributionChart() {
  const locale = useLocale()
  const t = useTranslations("adminTeachers.overview.workload")
  const [period, setPeriod] = React.useState<TeacherOverviewWorkloadPeriod>("weekly")
  const [subjectId, setSubjectId] = React.useState("")

  const workloadQuery = useQuery({
    queryKey: teacherOverviewQueryKeys.workload(locale, period, subjectId || "default"),
    queryFn: () => getTeacherWorkload(period, subjectId || undefined),
    staleTime: 60_000,
  })

  React.useEffect(() => {
    if (subjectId.length === 0 && workloadQuery.data) {
      const preferredSubjectId =
        workloadQuery.data.subjectOptions.find((option) => option.key === "science")?.id ??
        workloadQuery.data.subjectId

      if (preferredSubjectId.length > 0) {
        setSubjectId(preferredSubjectId)
      }
    }
  }, [subjectId, workloadQuery.data])

  if (workloadQuery.isLoading) {
    return <Skeleton className="h-[280px] rounded-[28px]" />
  }

  const subjectOptions = workloadQuery.data?.subjectOptions ?? []
  const activeSubjectId =
    subjectId.length > 0
      ? subjectId
      : (workloadQuery.data?.subjectOptions.find((option) => option.key === "science")?.id ??
        workloadQuery.data?.subjectId ??
        "")
  const chartData = (workloadQuery.data?.items ?? []).map((item) => ({
    extraDuties: item.extraDuties,
    label: item.label,
    teachingHours: item.teachingHours,
    totalClasses: item.totalClasses,
  }))

  return (
    <div className="rounded-3xl bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-talimy-navy dark:text-sky-200">{t("title")}</h3>

        <div className="flex flex-wrap gap-2">
          <ChartFilterSelect
            ariaLabel={t("subjectFilterAriaLabel")}
            onValueChange={setSubjectId}
            options={subjectOptions.map((option) => ({
              label: t(`departments.${option.key}` as never),
              value: option.id,
            }))}
            value={activeSubjectId}
          />
          <ChartFilterSelect
            ariaLabel={t("periodFilterAriaLabel")}
            onValueChange={(value) => setPeriod(value as TeacherOverviewWorkloadPeriod)}
            options={[
              { label: t("periods.weekly"), value: "weekly" },
              { label: t("periods.monthly"), value: "monthly" },
            ]}
            value={period}
          />
        </div>
      </div>

      <div className="mt-4">
        <ChartBarStacked
          data={chartData}
          hideHeader
          maxValue={40}
          series={WORKLOAD_SERIES.map((series) => ({
            color: series.color,
            key: series.key,
            label: t(`legend.${series.labelKey}` as never),
          }))}
        />
      </div>
    </div>
  )
}
