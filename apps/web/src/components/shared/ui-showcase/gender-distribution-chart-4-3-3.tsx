"use client"

import * as React from "react"
import { ReUI } from "@talimy/ui"

const FILTER_OPTIONS = [
  { label: "Grade 7", value: "grade7" },
  { label: "Grade 8", value: "grade8" },
  { label: "Grade 9", value: "grade9" },
] as const

const DATA_BY_GRADE = {
  grade7: {
    boys: 528,
    girls: 612,
  },
  grade8: {
    boys: 541,
    girls: 648,
  },
  grade9: {
    boys: 560,
    girls: 685,
  },
} as const

export function GenderDistributionChartShowcase433() {
  const [grade, setGrade] = React.useState<(typeof FILTER_OPTIONS)[number]["value"]>("grade9")

  const data = DATA_BY_GRADE[grade]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-sm">
        <ReUI.CircularDistributionChart
          className="min-h-[340px]"
          filterAriaLabel="Student gender grade filter"
          filterOptions={[...FILTER_OPTIONS]}
          filterValue={grade}
          onFilterChange={(value) => setGrade(value as keyof typeof DATA_BY_GRADE)}
          segments={[
            {
              color: "var(--talimy-color-navy)",
              key: "boys",
              label: "Boys",
              startAngle: 125,
              trackColor: "color-mix(in oklab, var(--talimy-color-sky) 20%, white 80%)",
              value: data.boys,
            },
            {
              color: "var(--talimy-color-pink)",
              key: "girls",
              label: "Girls",
              startAngle: 325,
              trackColor: "color-mix(in oklab, var(--talimy-color-pink) 14%, white 86%)",
              value: data.girls,
            },
          ]}
          totalLabel={(total) => total.toLocaleString()}
          title="Students by Gender"
        />
      </div>
    </div>
  )
}
