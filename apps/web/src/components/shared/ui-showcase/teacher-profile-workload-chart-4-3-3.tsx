"use client"

import * as React from "react"
import {
  ChartAreaStackedExpand,
  MiniChart,
  type MiniChartLegendItem,
  type StackedExpandedAreaPoint,
  type StackedExpandedAreaSeries,
} from "@talimy/ui"

type Period = "last8Months" | "thisSemester"

const WORKLOAD_LEGEND: MiniChartLegendItem[] = [
  { color: "var(--talimy-color-sky)", id: "classes", label: "Total Classes" },
  { color: "var(--talimy-color-navy)", id: "hours", label: "Teaching Hours" },
  { color: "var(--talimy-color-pink)", id: "extra", label: "Extra Duties" },
]

const WORKLOAD_SERIES: StackedExpandedAreaSeries[] = [
  { color: "var(--talimy-color-navy)", key: "teachingHours", label: "Teaching Hours" },
  { color: "var(--talimy-color-sky)", key: "totalClasses", label: "Total Classes" },
  { color: "var(--talimy-color-pink)", key: "extraDuties", label: "Extra Duties" },
]

const LAST_EIGHT_MONTHS: StackedExpandedAreaPoint[] = [
  { label: "Jul", extraDuties: 32, teachingHours: 104, totalClasses: 122 },
  { label: "Aug", extraDuties: 36, teachingHours: 96, totalClasses: 136 },
  { label: "Sep", extraDuties: 24, teachingHours: 98, totalClasses: 118 },
  { label: "Oct", extraDuties: 32, teachingHours: 134, totalClasses: 149 },
  { label: "Nov", extraDuties: 18, teachingHours: 110, totalClasses: 109 },
  { label: "Dec", extraDuties: 28, teachingHours: 104, totalClasses: 123 },
  { label: "Jan", extraDuties: 42, teachingHours: 128, totalClasses: 134 },
  { label: "Feb", extraDuties: 38, teachingHours: 96, totalClasses: 142 },
]

const THIS_SEMESTER: StackedExpandedAreaPoint[] = [
  { label: "Sep", extraDuties: 26, teachingHours: 102, totalClasses: 118 },
  { label: "Oct", extraDuties: 32, teachingHours: 134, totalClasses: 149 },
  { label: "Nov", extraDuties: 24, teachingHours: 116, totalClasses: 128 },
  { label: "Dec", extraDuties: 22, teachingHours: 108, totalClasses: 121 },
  { label: "Jan", extraDuties: 37, teachingHours: 126, totalClasses: 138 },
  { label: "Feb", extraDuties: 34, teachingHours: 118, totalClasses: 132 },
  { label: "Mar", extraDuties: 36, teachingHours: 122, totalClasses: 140 },
  { label: "Apr", extraDuties: 31, teachingHours: 120, totalClasses: 136 },
]

export function TeacherProfileWorkloadChartShowcase433() {
  const [period, setPeriod] = React.useState<Period>("last8Months")
  const data = period === "last8Months" ? LAST_EIGHT_MONTHS : THIS_SEMESTER

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/teachers/[id]</h3>

      <div className="max-w-3xl">
        <MiniChart
          bottomLabels={{
            className: "mt-[-18px]",
            values: data.map((item) => item.label),
          }}
          chartClassName="min-h-[196px]"
          filter={{
            ariaLabel: "Teacher workload period filter",
            onValueChange: (value) => setPeriod(value as Period),
            options: [
              { label: "Last 8 months", value: "last8Months" },
              { label: "This Semester", value: "thisSemester" },
            ],
            value: period,
          }}
          contentClassName="space-y-3"
          legend={WORKLOAD_LEGEND}
          title="Workload Summary"
          yScale={{
            values: ["160 h", "120 h", "80 h", "40 h", "0 h"],
          }}
        >
          <ChartAreaStackedExpand
            className="flex h-full items-end"
            data={data}
            hideXAxis
            series={WORKLOAD_SERIES}
          />
        </MiniChart>
      </div>
    </div>
  )
}
