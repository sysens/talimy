"use client"

import * as React from "react"

import { ReUI } from "@talimy/ui"

import type { DashboardGradeFilter } from "@/components/dashboard/admin/dashboard.types"

type StudentsByGenderChartProps = {
  boysLabel?: string
  className?: string
  dataByGrade?: Record<DashboardGradeFilter, { boys: number; girls: number }>
  filterAriaLabel?: string
  filterOptions?: ReadonlyArray<{ label: string; value: DashboardGradeFilter }>
  girlsLabel?: string
  grade?: DashboardGradeFilter
  onGradeChange?: (value: DashboardGradeFilter) => void
  title?: string
}

const DEFAULT_FILTER_OPTIONS: ReadonlyArray<{ label: string; value: DashboardGradeFilter }> = [
  { label: "Grade 7", value: "grade7" },
  { label: "Grade 8", value: "grade8" },
  { label: "Grade 9", value: "grade9" },
]

const DEFAULT_DATA_BY_GRADE: Record<DashboardGradeFilter, { boys: number; girls: number }> = {
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
}

function isDashboardGradeFilter(value: string): value is DashboardGradeFilter {
  return value === "grade7" || value === "grade8" || value === "grade9"
}

export function StudentsByGenderChart({
  boysLabel = "Boys",
  className,
  dataByGrade = DEFAULT_DATA_BY_GRADE,
  filterAriaLabel = "Student gender grade filter",
  filterOptions = DEFAULT_FILTER_OPTIONS,
  girlsLabel = "Girls",
  grade,
  onGradeChange,
  title = "Students by Gender",
}: StudentsByGenderChartProps) {
  const [internalGrade, setInternalGrade] = React.useState<DashboardGradeFilter>("grade9")
  const activeGrade = grade ?? internalGrade
  const resolvedGrade = activeGrade in dataByGrade ? activeGrade : "grade9"
  const data = dataByGrade[resolvedGrade] ?? DEFAULT_DATA_BY_GRADE.grade9

  return (
    <ReUI.CircularDistributionChart
      className={className ?? "h-full min-h-[300px]"}
      contentClassName="space-y-4 p-5"
      filterAriaLabel={filterAriaLabel}
      filterOptions={[...filterOptions]}
      filterTriggerClassName="h-10 min-w-24 rounded-2xl px-3 text-sm font-semibold"
      filterValue={resolvedGrade}
      legendClassName="gap-3"
      onFilterChange={(value) => {
        if (!isDashboardGradeFilter(value)) {
          return
        }

        if (onGradeChange) {
          onGradeChange(value)
          return
        }

        setInternalGrade(value)
      }}
      segments={[
        {
          color: "var(--talimy-color-navy)",
          key: "boys",
          label: boysLabel,
          startAngle: 125,
          trackColor: "color-mix(in oklab, var(--talimy-color-sky) 20%, white 80%)",
          value: data.boys,
        },
        {
          color: "var(--talimy-color-pink)",
          key: "girls",
          label: girlsLabel,
          startAngle: 325,
          trackColor: "color-mix(in oklab, var(--talimy-color-pink) 14%, white 86%)",
          value: data.girls,
        },
      ]}
      title={title}
      titleClassName="max-w-[8rem] text-[1rem] leading-[1.02] font-semibold md:text-[1rem]"
      totalLabel={(total) => total.toLocaleString()}
      totalLabelClassName="text-[1.75rem]"
    />
  )
}
