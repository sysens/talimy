"use client"

import * as React from "react"
import { ChartBarDefault, MiniChart } from "@talimy/ui"

type Period = "last6Months" | "thisSemester"

const LAST_SIX_MONTHS_DATA = [
  { label: "Jan", value: 90 },
  { label: "Feb", value: 88 },
  { label: "Mar", value: 85 },
  { label: "Apr", value: 92 },
  { label: "May", value: 95 },
  { label: "Jun", value: 96 },
]

const THIS_SEMESTER_DATA = [
  { label: "Jul", value: 87 },
  { label: "Aug", value: 89 },
  { label: "Sep", value: 91 },
  { label: "Oct", value: 93 },
  { label: "Nov", value: 94 },
  { label: "Dec", value: 95 },
]

export function StudentAcademicPerformanceChartShowcase433() {
  const [period, setPeriod] = React.useState<Period>("last6Months")

  const data = period === "last6Months" ? LAST_SIX_MONTHS_DATA : THIS_SEMESTER_DATA

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/student/profile</h3>

      <div className="max-w-4xl">
        <MiniChart
          bottomLabels={{
            className: "px-1",
            values: data.map((item) => item.label),
          }}
          contentClassName="space-y-5"
          filter={{
            ariaLabel: "Academic performance period filter",
            onValueChange: (value) => setPeriod(value as Period),
            options: [
              { label: "Last 6 Months", value: "last6Months" },
              { label: "This Semester", value: "thisSemester" },
            ],
            value: period,
          }}
          title="Academic Performance"
        >
          <ChartBarDefault
            chartType="bar"
            data={data}
            dualConfig={{
              note: "Isabella shows consistent excellence in her studies and leadership in group projects. Keep aiming high!",
              radialCenterLabel: "Average Score",
              radialCenterValue: (
                <>
                  3.9<tspan className="fill-muted-foreground text-base font-medium">/4.0</tspan>
                </>
              ),
              radialSegments: [
                { color: "var(--talimy-color-navy)", key: "core", label: "Core Score", value: 90 },
                { color: "var(--talimy-color-pink)", key: "bonus", label: "Bonus Score", value: 4 },
              ],
            }}
            hideFooter
            hideHeader
            insideLabelFormatter={(value) => value.toString()}
            valueDomain={[0, 100]}
            variant="dual"
          />
        </MiniChart>
      </div>
    </div>
  )
}
