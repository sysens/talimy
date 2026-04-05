"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { ChartBarDefault, MiniChart, Skeleton } from "@talimy/ui"

import { getTeacherAttendanceOverview } from "@/components/teachers/overview/teacher-overview-api"
import type { TeacherOverviewAttendancePeriod } from "@/components/teachers/overview/teacher-overview-api.types"
import { teacherOverviewQueryKeys } from "@/components/teachers/overview/teacher-overview-query-keys"

export function AttendanceOverviewChart() {
  const locale = useLocale()
  const t = useTranslations("adminTeachers.overview.attendance")
  const [period, setPeriod] = React.useState<TeacherOverviewAttendancePeriod>("weekly")

  const attendanceQuery = useQuery({
    queryKey: teacherOverviewQueryKeys.attendance(locale, period),
    queryFn: () => getTeacherAttendanceOverview(period),
    staleTime: 60_000,
  })

  if (attendanceQuery.isLoading) {
    return <Skeleton className="h-[280px] rounded-[28px]" />
  }

  const points = (attendanceQuery.data?.points ?? []).map((point) => ({
    label: resolveDayLabel(t, point.label),
    value: point.value,
  }))

  return (
    <MiniChart
      bottomLabels={{ values: points.map((point) => point.label) }}
      chartClassName="min-h-[198px]"
      className="h-full"
      filter={{
        ariaLabel: t("filterAriaLabel"),
        onValueChange: (value) => setPeriod(value as TeacherOverviewAttendancePeriod),
        options: [
          { label: t("periods.weekly"), value: "weekly" },
          { label: t("periods.monthly"), value: "monthly" },
        ],
        value: period,
      }}
      title={t("title")}
    >
      <ChartBarDefault
        chartType="line"
        className="h-[172px]"
        data={points}
        hideFooter
        hideHeader
        hideXAxis
        lineOffsetPx={14}
        valueDomain={[0, 100]}
      />
    </MiniChart>
  )
}

function resolveDayLabel(
  t: ReturnType<typeof useTranslations<"adminTeachers.overview.attendance">>,
  label: string
): string {
  switch (label) {
    case "Mon":
      return t("days.mon")
    case "Tue":
      return t("days.tue")
    case "Wed":
      return t("days.wed")
    case "Thu":
      return t("days.thu")
    case "Fri":
      return t("days.fri")
    default:
      return label
  }
}
