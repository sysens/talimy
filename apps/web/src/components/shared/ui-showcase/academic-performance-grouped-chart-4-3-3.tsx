"use client"

import { useTranslations } from "next-intl"

import { AcademicPerformanceChartCard } from "@/components/shared/charts/academic-performance-chart-card"
import {
  STUDENTS_ACADEMIC_DATA_BY_PERIOD,
  STUDENTS_ACADEMIC_SERIES,
} from "@/components/students/overview/students-overview.data"

export function AcademicPerformanceGroupedChartShowcase433() {
  const t = useTranslations("adminStudents.overview.academicPerformance")

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/students</h3>

      <div className="max-w-xl">
        <AcademicPerformanceChartCard
          dataByPeriod={STUDENTS_ACADEMIC_DATA_BY_PERIOD}
          filterAriaLabel={t("filterAriaLabel")}
          filterOptions={[
            { label: t("periods.lastSemester"), value: "lastSemester" },
            { label: t("periods.thisSemester"), value: "thisSemester" },
          ]}
          series={[
            { ...STUDENTS_ACADEMIC_SERIES[0], label: t("legend.grade7") },
            { ...STUDENTS_ACADEMIC_SERIES[1], label: t("legend.grade8") },
            { ...STUDENTS_ACADEMIC_SERIES[2], label: t("legend.grade9") },
          ]}
          title={t("title")}
        />
      </div>
    </div>
  )
}
