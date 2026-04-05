"use client"

import * as React from "react"

import { MetricProgressCard } from "@/components/shared/performance/metric-progress-card"
import type { MetricProgressCardItem } from "@/components/shared/performance/metric-progress-card.types"

type PerformancePeriod = "lastMonth" | "lastQuarter"

const LAST_MONTH_ITEMS: readonly MetricProgressCardItem[] = [
  {
    helperText: "Excellent",
    id: "grading-timeliness",
    label: "Grading Timeliness",
    maxValue: 100,
    targetLabel: "90%",
    targetValue: 90,
    valueLabel: "95%",
    valueValue: 95,
  },
  {
    helperText: "Good",
    id: "student-average-grade",
    label: "Student Avg. Grade",
    maxValue: 100,
    targetLabel: "90",
    targetValue: 90,
    valueLabel: "85",
    valueValue: 85,
  },
  {
    helperText: "Needs Improvement",
    id: "student-attendance",
    label: "Student Attendance",
    maxValue: 100,
    targetLabel: "90%",
    targetValue: 90,
    valueLabel: "76%",
    valueValue: 76,
  },
  {
    helperText: "Below Standard",
    id: "parent-feedback",
    label: "Parent Feedback",
    maxValue: 100,
    targetLabel: "85%",
    targetValue: 85,
    valueLabel: "65%",
    valueValue: 65,
  },
]

const LAST_QUARTER_ITEMS: readonly MetricProgressCardItem[] = [
  {
    helperText: "Excellent",
    id: "grading-timeliness",
    label: "Grading Timeliness",
    maxValue: 100,
    targetLabel: "90%",
    targetValue: 90,
    valueLabel: "93%",
    valueValue: 93,
  },
  {
    helperText: "Good",
    id: "student-average-grade",
    label: "Student Avg. Grade",
    maxValue: 100,
    targetLabel: "90",
    targetValue: 90,
    valueLabel: "84",
    valueValue: 84,
  },
  {
    helperText: "Good",
    id: "student-attendance",
    label: "Student Attendance",
    maxValue: 100,
    targetLabel: "88%",
    targetValue: 88,
    valueLabel: "82%",
    valueValue: 82,
  },
  {
    helperText: "Good",
    id: "parent-feedback",
    label: "Parent Feedback",
    maxValue: 100,
    targetLabel: "85%",
    targetValue: 85,
    valueLabel: "79%",
    valueValue: 79,
  },
]

export function MetricProgressCardShowcase() {
  const [period, setPeriod] = React.useState<PerformancePeriod>("lastMonth")

  const items = period === "lastMonth" ? LAST_MONTH_ITEMS : LAST_QUARTER_ITEMS

  return (
    <div className="w-72">
      <MetricProgressCard
        className="w-72"
        filter={{
          ariaLabel: "Performance period",
          onValueChange: (value) => setPeriod(value as PerformancePeriod),
          options: [
            { label: "Last Month", value: "lastMonth" },
            { label: "Last Quarter", value: "lastQuarter" },
          ],
          value: period,
        }}
        items={items}
        title="Performance"
      />
    </div>
  )
}
