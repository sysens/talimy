"use client"

import * as React from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { AcademicPerformanceChartCard } from "@/components/shared/charts/academic-performance-chart-card"
import { getStudentsAcademicPerformance } from "@/components/students/overview/students-overview-api"
import { studentsOverviewQueryKeys } from "@/components/students/overview/students-overview-query-keys"
import { formatMonthShort } from "@/lib/dashboard/dashboard-formatters"
import { STUDENTS_ACADEMIC_SERIES } from "@/components/students/overview/students-overview.data"

export function AcademicPerformanceChart() {
  const locale = useLocale()
  const t = useTranslations("adminStudents.overview.academicPerformance")
  const [period, setPeriod] = React.useState<"last_semester" | "this_semester">("last_semester")
  const performanceQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getStudentsAcademicPerformance(period),
    queryKey: studentsOverviewQueryKeys.academicPerformance(period),
    staleTime: 60_000,
  })
  const rows = React.useMemo(
    () =>
      (performanceQuery.data?.points ?? []).map((point) => ({
        grade7: point.grade7,
        grade8: point.grade8,
        grade9: point.grade9,
        month: formatMonthShort(locale, point.monthNumber),
      })),
    [locale, performanceQuery.data?.points]
  )
  const activeRows = rows.length > 0 ? rows : [{ grade7: 0, grade8: 0, grade9: 0, month: "—" }]
  const dataByPeriod = {
    last_semester:
      period === "last_semester" ? activeRows : [{ grade7: 0, grade8: 0, grade9: 0, month: "—" }],
    this_semester:
      period === "this_semester" ? activeRows : [{ grade7: 0, grade8: 0, grade9: 0, month: "—" }],
  } as const

  return (
    <AcademicPerformanceChartCard
      dataByPeriod={dataByPeriod}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[
        { label: t("periods.lastSemester"), value: "last_semester" },
        { label: t("periods.thisSemester"), value: "this_semester" },
      ]}
      onPeriodChange={setPeriod}
      period={period}
      series={[
        { ...STUDENTS_ACADEMIC_SERIES[0], label: t("legend.grade7") },
        { ...STUDENTS_ACADEMIC_SERIES[1], label: t("legend.grade8") },
        { ...STUDENTS_ACADEMIC_SERIES[2], label: t("legend.grade9") },
      ]}
      title={t("title")}
    />
  )
}
