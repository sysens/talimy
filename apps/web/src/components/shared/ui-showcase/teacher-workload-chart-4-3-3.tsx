"use client"

import * as React from "react"
import { ChartBarStacked, ChartFilterSelect } from "@talimy/ui"

const WORKLOAD_SERIES = [
  { color: "var(--talimy-color-pink)", key: "classes", label: "Total Classes" },
  { color: "var(--talimy-color-sky)", key: "hours", label: "Teaching Hours" },
  { color: "var(--talimy-color-navy)", key: "extra", label: "Extra Duties" },
] as const

const SCIENCE_WEEKLY = [
  { classes: 18, extra: 7, hours: 11, label: "Rayan\nYasmine" },
  { classes: 19, extra: 6, hours: 10, label: "Aliyah\nSummer" },
  { classes: 17, extra: 7, hours: 12, label: "Kelsy\nTrisha" },
  { classes: 18, extra: 5, hours: 11, label: "Zackary\nSmith" },
  { classes: 22, extra: 4, hours: 11, label: "Javier\nQuintero" },
  { classes: 23, extra: 4, hours: 9, label: "Giana\nGomez" },
  { classes: 20, extra: 7, hours: 8, label: "Miley\nAddams" },
  { classes: 24, extra: 4, hours: 10, label: "Kaily\nJaydon" },
]

const SCIENCE_MONTHLY = [
  { classes: 20, extra: 8, hours: 11, label: "Rayan\nYasmine" },
  { classes: 21, extra: 7, hours: 10, label: "Aliyah\nSummer" },
  { classes: 18, extra: 8, hours: 12, label: "Kelsy\nTrisha" },
  { classes: 20, extra: 6, hours: 11, label: "Zackary\nSmith" },
  { classes: 24, extra: 5, hours: 11, label: "Javier\nQuintero" },
  { classes: 23, extra: 5, hours: 10, label: "Giana\nGomez" },
  { classes: 21, extra: 8, hours: 9, label: "Miley\nAddams" },
  { classes: 25, extra: 5, hours: 11, label: "Kaily\nJaydon" },
]

const MATH_WEEKLY = [
  { classes: 16, extra: 6, hours: 12, label: "Rayan\nYasmine" },
  { classes: 17, extra: 5, hours: 10, label: "Aliyah\nSummer" },
  { classes: 18, extra: 6, hours: 10, label: "Kelsy\nTrisha" },
  { classes: 19, extra: 4, hours: 9, label: "Zackary\nSmith" },
  { classes: 21, extra: 3, hours: 10, label: "Javier\nQuintero" },
  { classes: 22, extra: 4, hours: 8, label: "Giana\nGomez" },
  { classes: 18, extra: 6, hours: 8, label: "Miley\nAddams" },
  { classes: 23, extra: 4, hours: 9, label: "Kaily\nJaydon" },
]

const MATH_MONTHLY = [
  { classes: 18, extra: 7, hours: 12, label: "Rayan\nYasmine" },
  { classes: 19, extra: 6, hours: 10, label: "Aliyah\nSummer" },
  { classes: 20, extra: 7, hours: 10, label: "Kelsy\nTrisha" },
  { classes: 21, extra: 5, hours: 9, label: "Zackary\nSmith" },
  { classes: 22, extra: 4, hours: 11, label: "Javier\nQuintero" },
  { classes: 24, extra: 5, hours: 8, label: "Giana\nGomez" },
  { classes: 20, extra: 7, hours: 8, label: "Miley\nAddams" },
  { classes: 25, extra: 5, hours: 9, label: "Kaily\nJaydon" },
]

export function TeacherWorkloadChartShowcase433() {
  const [department, setDepartment] = React.useState<"science" | "math">("science")
  const [period, setPeriod] = React.useState<"weekly" | "monthly">("weekly")

  const data =
    department === "science"
      ? period === "weekly"
        ? SCIENCE_WEEKLY
        : SCIENCE_MONTHLY
      : period === "weekly"
        ? MATH_WEEKLY
        : MATH_MONTHLY

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/teachers</h3>

      <div className="max-w-3xl rounded-3xl bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h4 className="text-base font-semibold text-[var(--talimy-color-navy)]">
            Workload Distribution
          </h4>

          <div className="flex flex-wrap gap-2">
            <ChartFilterSelect
              ariaLabel="Teacher department filter"
              onValueChange={(value) => setDepartment(value as "science" | "math")}
              options={[
                { label: "Science", value: "science" },
                { label: "Math", value: "math" },
              ]}
              value={department}
            />
            <ChartFilterSelect
              ariaLabel="Teacher workload period filter"
              onValueChange={(value) => setPeriod(value as "weekly" | "monthly")}
              options={[
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
              ]}
              value={period}
            />
          </div>
        </div>

        <div className="mt-4">
          <ChartBarStacked data={data} hideHeader maxValue={40} series={[...WORKLOAD_SERIES]} />
        </div>
      </div>
    </div>
  )
}
