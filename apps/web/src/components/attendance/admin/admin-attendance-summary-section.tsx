"use client"

import * as React from "react"
import { ChartFilterSelect } from "@talimy/ui"
import { useTranslations } from "next-intl"

import type { AdminAttendanceSummaryDate } from "@/components/attendance/admin/admin-attendance-api.types"
import { AdminAttendanceOverviewLineChart } from "@/components/attendance/admin/admin-attendance-overview-line-chart"
import { AdminAttendanceSummaryCards } from "@/components/attendance/admin/admin-attendance-summary-cards"

export function AdminAttendanceSummarySection() {
  const t = useTranslations("adminAttendance.summary")
  const [date, setDate] = React.useState<AdminAttendanceSummaryDate>("today")

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_350px] xl:items-start">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-talimy-navy">{t("sectionTitle")}</h2>
          <ChartFilterSelect
            ariaLabel={t("filterAriaLabel")}
            onValueChange={(value) => {
              if (value === "today") {
                setDate("today")
              }
            }}
            options={[{ label: t("dates.today"), value: "today" }]}
            triggerClassName="h-10 min-w-[92px] rounded-[16px] bg-[var(--talimy-color-sky)]/70 px-3 text-[13px] font-medium text-talimy-navy"
            value={date}
          />
        </div>

        <AdminAttendanceSummaryCards date={date} />
      </div>
      <div className="min-w-0">
        <AdminAttendanceOverviewLineChart />
      </div>
    </section>
  )
}
