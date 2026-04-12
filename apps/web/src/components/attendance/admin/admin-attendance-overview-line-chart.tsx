"use client"

import * as React from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import type { AdminAttendanceTrendPeriod } from "@/components/attendance/admin/admin-attendance-api.types"
import { getAdminAttendanceTrends } from "@/components/attendance/admin/admin-attendance-api"
import { adminAttendanceQueryKeys } from "@/components/attendance/admin/admin-attendance-query-keys"
import { AttendanceOverviewLineChartCard } from "@/components/shared/charts/attendance-overview-line-chart-card"
import { formatMonthShort } from "@/lib/dashboard/dashboard-formatters"

export function AdminAttendanceOverviewLineChart() {
  const locale = useLocale()
  const t = useTranslations("adminAttendance.overview")
  const [period, setPeriod] = React.useState<AdminAttendanceTrendPeriod>("last_semester")
  const trendsQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getAdminAttendanceTrends(period),
    queryKey: adminAttendanceQueryKeys.trends(period),
    staleTime: 60_000,
  })

  const rows = React.useMemo(
    () =>
      (trendsQuery.data?.points ?? []).map((point) => ({
        label: formatMonthShort(locale, point.monthNumber),
        staff: point.staff,
        students: point.students,
        teachers: point.teachers,
      })),
    [locale, trendsQuery.data?.points]
  )

  if (trendsQuery.isLoading && !trendsQuery.data) {
    return <Skeleton className="h-[338px] rounded-[28px]" />
  }

  return (
    <AttendanceOverviewLineChartCard
      data={rows.length > 0 ? rows : [{ label: "—", staff: 0, students: 0, teachers: 0 }]}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[
        { label: t("periods.lastSemester"), value: "last_semester" },
        { label: t("periods.thisSemester"), value: "this_semester" },
      ]}
      legend={{
        staff: t("legend.staff"),
        students: t("legend.students"),
        teachers: t("legend.teachers"),
      }}
      onPeriodChange={setPeriod}
      period={period}
      title={t("title")}
    />
  )
}
