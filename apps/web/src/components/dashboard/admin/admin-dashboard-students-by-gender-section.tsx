"use client"

import { Skeleton } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"

import { getAdminStudentsByGender } from "@/components/dashboard/admin/dashboard-api"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import type { AppLocale } from "@/config/site"
import { useDashboardStore } from "@/stores/dashboard-store"
import { StudentsByGenderChart } from "@/components/shared/charts/students-by-gender-chart"

export function AdminDashboardStudentsByGenderSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard.studentsByGender")
  const activeGradeFilter = useDashboardStore((state) => state.activeGradeFilter)
  const setActiveGradeFilter = useDashboardStore((state) => state.setActiveGradeFilter)

  const chartProps = useMemo(
    () => ({
      boysLabel: t("labels.boys"),
      filterAriaLabel: t("filterAriaLabel"),
      filterOptions: [
        { label: t("grades.grade7"), value: "grade7" },
        { label: t("grades.grade8"), value: "grade8" },
        { label: t("grades.grade9"), value: "grade9" },
      ] as const,
      girlsLabel: t("labels.girls"),
      title: t("title"),
    }),
    [t]
  )

  const chartQuery = useQuery({
    queryKey: adminDashboardQueryKeys.studentsByGender(locale, activeGradeFilter),
    queryFn: async () => {
      const [grade7, grade8, grade9] = await Promise.all([
        getAdminStudentsByGender("7"),
        getAdminStudentsByGender("8"),
        getAdminStudentsByGender("9"),
      ])

      return {
        ...chartProps,
        dataByGrade: {
          grade7: { boys: grade7.boys, girls: grade7.girls },
          grade8: { boys: grade8.boys, girls: grade8.girls },
          grade9: { boys: grade9.boys, girls: grade9.girls },
        },
      }
    },
    refetchInterval: 60_000,
  })

  if (chartQuery.isLoading || !chartQuery.data) {
    return <Skeleton className="h-[300px] rounded-[28px]" />
  }

  return (
    <StudentsByGenderChart
      boysLabel={chartQuery.data.boysLabel}
      dataByGrade={chartQuery.data.dataByGrade}
      filterAriaLabel={chartQuery.data.filterAriaLabel}
      filterOptions={chartQuery.data.filterOptions}
      girlsLabel={chartQuery.data.girlsLabel}
      grade={activeGradeFilter}
      onGradeChange={setActiveGradeFilter}
      title={chartQuery.data.title}
    />
  )
}
