"use client"

import { StudentAttendanceChart } from "@/components/shared/charts/student-attendance-chart"

export function AttendanceOverviewChartShowcase433() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-xl">
        <StudentAttendanceChart />
      </div>
    </div>
  )
}
