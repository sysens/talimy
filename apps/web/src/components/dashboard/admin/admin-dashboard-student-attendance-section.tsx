"use client"

import { Skeleton } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"

import { getAdminAttendanceOverview } from "@/components/dashboard/admin/dashboard-api"
import { mapAttendanceChartPoints } from "@/components/dashboard/admin/dashboard-api.mappers"
import type { DashboardStudentAttendancePeriod } from "@/components/dashboard/admin/dashboard.types"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import {
  StudentAttendanceChart,
  type AttendancePoint,
} from "@/components/shared/charts/student-attendance-chart"
import type { AppLocale } from "@/config/site"
import { useDashboardStore } from "@/stores/dashboard-store"

export function AdminDashboardStudentAttendanceSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard.studentAttendance")
  const period = useDashboardStore((state) => state.activePeriodFilters.studentAttendance)
  const setPeriodFilter = useDashboardStore((state) => state.setPeriodFilter)

  const chartProps = useMemo(
    () => ({
      filterAriaLabel: t("filterAriaLabel"),
      filterOptions: [
        { label: t("periods.weekly"), value: "weekly" },
        { label: t("periods.monthly"), value: "monthly" },
      ] as const,
      title: t("title"),
    }),
    [locale, t]
  )

  const attendanceQuery = useQuery({
    queryKey: adminDashboardQueryKeys.studentAttendance(locale, period),
    queryFn: async () => {
      const [weekly, monthly] = await Promise.all([
        getAdminAttendanceOverview("weekly"),
        getAdminAttendanceOverview("monthly"),
      ])

      return {
        ...chartProps,
        dataByPeriod: {
          weekly: mapAttendanceChartPoints(locale, weekly) as AttendancePoint[],
          monthly: mapAttendanceChartPoints(locale, monthly) as AttendancePoint[],
        } satisfies Record<DashboardStudentAttendancePeriod, AttendancePoint[]>,
      }
    },
    refetchInterval: 60_000,
  })

  if (attendanceQuery.isLoading || !attendanceQuery.data) {
    return <Skeleton className="h-[300px] rounded-[28px]" />
  }

  return (
    <StudentAttendanceChart
      dataByPeriod={attendanceQuery.data.dataByPeriod}
      filterAriaLabel={attendanceQuery.data.filterAriaLabel}
      filterOptions={attendanceQuery.data.filterOptions}
      onPeriodChange={(value) => setPeriodFilter("studentAttendance", value)}
      period={period}
      title={attendanceQuery.data.title}
    />
  )
}
