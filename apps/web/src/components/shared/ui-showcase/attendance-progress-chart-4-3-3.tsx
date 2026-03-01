"use client"

import * as React from "react"
import { CappedProgressBarChart } from "@talimy/ui"

type AttendancePeriod = "thisWeek" | "thisMonth"

const THIS_WEEK_DATA = [
  { label: "Mon", value: 1180 },
  { label: "Tue", value: 1085 },
  { label: "Wed", value: 1230 },
  { label: "Thu", value: 1102 },
  { label: "Fri", value: 1200 },
]

const THIS_MONTH_DATA = [
  { label: "W1", value: 1162 },
  { label: "W2", value: 1128 },
  { label: "W3", value: 1214 },
  { label: "W4", value: 1188 },
  { label: "W5", value: 1226 },
]

export function AttendanceProgressChartShowcase433() {
  const [period, setPeriod] = React.useState<AttendancePeriod>("thisWeek")

  const data = period === "thisWeek" ? THIS_WEEK_DATA : THIS_MONTH_DATA

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-xl">
        <CappedProgressBarChart
          data={data}
          filter={{
            ariaLabel: "Attendance overview range",
            onValueChange: (value) => setPeriod(value as AttendancePeriod),
            options: [
              { label: "This Week", value: "thisWeek" },
              { label: "This Month", value: "thisMonth" },
            ],
            value: period,
          }}
          maxValue={1300}
          title="Attendance Overview"
        />
      </div>
    </div>
  )
}
