"use client"

import * as React from "react"
import { ChartBarDefault, MiniChart } from "@talimy/ui"

const WEEKLY_TEACHER_ATTENDANCE_DATA = [
  { label: "Mon", value: 84 },
  { label: "Tue", value: 72 },
  { label: "Wed", value: 83 },
  { label: "Thu", value: 92 },
  { label: "Fri", value: 86 },
  { label: "Sat", value: 88 },
]

const MONTHLY_TEACHER_ATTENDANCE_DATA = [
  { label: "W1", value: 76 },
  { label: "W2", value: 81 },
  { label: "W3", value: 89 },
  { label: "W4", value: 85 },
  { label: "W5", value: 86 },
  { label: "W6", value: 83 },
]

export function TeacherAttendanceChartShowcase433() {
  const [period, setPeriod] = React.useState<"weekly" | "monthly">("weekly")

  const data =
    period === "weekly" ? WEEKLY_TEACHER_ATTENDANCE_DATA : MONTHLY_TEACHER_ATTENDANCE_DATA

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/teachers</h3>

      <div className="max-w-xl">
        <MiniChart
          bottomLabels={{
            className: "px-2",
            values: data.map((item) => item.label),
          }}
          chartClassName="min-h-[210px]"
          filter={{
            ariaLabel: "Teacher attendance period filter",
            onValueChange: (value) => setPeriod(value as "weekly" | "monthly"),
            options: [
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
            value: period,
          }}
          title="Attendance Overview"
        >
          <ChartBarDefault
            chartType="line"
            className="h-[180px]"
            data={data}
            hideFooter
            hideHeader
            hideXAxis
            lineOffsetPx={15}
            valueDomain={[0, 100]}
          />
        </MiniChart>
      </div>
    </div>
  )
}
