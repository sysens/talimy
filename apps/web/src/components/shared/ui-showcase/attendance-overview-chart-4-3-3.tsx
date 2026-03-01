"use client"

import * as React from "react"
import { ChartBarDefault, MiniChart } from "@talimy/ui"

const WEEKLY_ATTENDANCE_DATA = [
  {
    absentBreakdown: [
      { label: "A1 Group", value: 8 },
      { label: "A2 Group", value: 11 },
      { label: "A3 Group", value: 12 },
      { label: "A4 Group", value: 10 },
      { label: "A5 Group", value: 8 },
      { label: "A6 Group", value: 11 },
      { label: "A7 Group", value: 13 },
      { label: "A8 Group", value: 9 },
      { label: "A9 Group", value: 10 },
      { label: "A10 Group", value: 9 },
     ],
    label: "Mon",
    value: 1144,
  },
  {
    absentBreakdown: [
      { label: "A1 Group", value: 16 },
      { label: "A2 Group", value: 21 },
      { label: "A3 Group", value: 18 },
      { label: "A4 Group", value: 20 },
      { label: "A5 Group", value: 17 },
      { label: "A6 Group", value: 22 },
      { label: "A7 Group", value: 30 },
      { label: "A8 Group", value: 19 },
      { label: "A9 Group", value: 21 },
      { label: "A10 Group", value: 18 },
     ],
    label: "Tue",
    value: 1043,
  },
  {
    absentBreakdown: [
      { label: "A1 Group", value: 23 },
      { label: "A2 Group", value: 31 },
      { label: "A3 Group", value: 28 },
      { label: "A4 Group", value: 34 },
      { label: "A5 Group", value: 21 },
      { label: "A6 Group", value: 29 },
      { label: "A7 Group", value: 37 },
      { label: "A8 Group", value: 33 },
      { label: "A9 Group", value: 34 },
      { label: "A10 Group", value: 42 },
     ],
    label: "Wed",
    value: 933,
  },
  {
    absentBreakdown: [
      { label: "A1 Group", value: 14 },
      { label: "A2 Group", value: 15 },
      { label: "A3 Group", value: 13 },
      { label: "A4 Group", value: 12 },
      { label: "A5 Group", value: 11 },
      { label: "A6 Group", value: 16 },
      { label: "A7 Group", value: 14 },
      { label: "A8 Group", value: 17 },
      { label: "A9 Group", value: 13 },
      { label: "A10 Group", value: 21 },
     ],
    label: "Thu",
    value: 1089,
  },
  {
    absentBreakdown: [
      { label: "A1 Group", value: 10 },
      { label: "A2 Group", value: 14 },
      { label: "A3 Group", value: 12 },
      { label: "A4 Group", value: 11 },
      { label: "A5 Group", value: 9 },
      { label: "A6 Group", value: 12 },
      { label: "A7 Group", value: 16 },
      { label: "A8 Group", value: 11 },
      { label: "A9 Group", value: 13 },
      { label: "A10 Group", value: 12 },
     ],
    label: "Fri",
    value: 1089,
  },
  {
    absentBreakdown: [
      { label: "A1 Group", value: 18 },
      { label: "A2 Group", value: 19 },
      { label: "A3 Group", value: 22 },
      { label: "A4 Group", value: 17 },
      { label: "A5 Group", value: 16 },
      { label: "A6 Group", value: 21 },
      { label: "A7 Group", value: 24 },
      { label: "A8 Group", value: 18 },
      { label: "A9 Group", value: 20 },
      { label: "A10 Group", value: 24 },
     ],
    label: "Sat",
    value: 1026,
  },
]

const MONTHLY_ATTENDANCE_DATA = [
  {
    absentBreakdown: [
      { label: "Grade 7", value: 44 },
      { label: "Grade 8", value: 52 },
      { label: "Grade 9", value: 67 },
     ],
    label: "Yan",
    value: 1082,
  },
  {
    absentBreakdown: [
      { label: "Grade 7", value: 35 },
      { label: "Grade 8", value: 41 },
      { label: "Grade 9", value: 45 },
     ],
    label: "Fev",
    value: 1124,
  },
  {
    absentBreakdown: [
      { label: "Grade 7", value: 12 },
      { label: "Grade 8", value: 20 },
      { label: "Grade 9", value: 24 },
     ],
    label: "Mart",
    value: 1189,
  },
  {
    absentBreakdown: [
      { label: "Grade 7", value: 41 },
      { label: "Grade 8", value: 46 },
      { label: "Grade 9", value: 50 },
     ],
    label: "APR",
    value: 1108,
  },
  {
    absentBreakdown: [
      { label: "Grade 7", value: 39 },
      { label: "Grade 8", value: 45 },
      { label: "Grade 9", value: 53 },
     ],
    label: "MAY",
    value: 1108,
  },
  {
    absentBreakdown: [
      { label: "Grade 7", value: 37 },
      { label: "Grade 8", value: 44 },
      { label: "Grade 9", value: 56 },
     ],
    label: "IYN",
    value: 1108,
  },
]

export function AttendanceOverviewChartShowcase433() {
  const [period, setPeriod] = React.useState<"weekly" | "monthly">("weekly")

  const data = period === "weekly" ? WEEKLY_ATTENDANCE_DATA : MONTHLY_ATTENDANCE_DATA

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-xl">
        <MiniChart
          bottomLabels={{
            className: "px-2",
            values: data.map((item) => item.label),
          }}
          chartClassName="min-h-[210px]"
          filter={{
            ariaLabel: "Attendance period filter",
            onValueChange: (value) => setPeriod(value as "weekly" | "monthly"),
            options: [
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
            value: period,
          }}
          subtitle={
            period === "weekly"
              ? "This week · Mon-Sat present students"
              : "This month · weekly present students"
          }
          topLabels={{
            className: "px-2",
            values: data.map((item) => item.value.toLocaleString()),
          }}
          title="Student Attendance"
        >
          <ChartBarDefault className="h-[180px]" data={data} hideFooter hideHeader hideXAxis />
        </MiniChart>
      </div>
    </div>
  )
}
