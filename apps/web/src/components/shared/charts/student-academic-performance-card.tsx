"use client"

import * as React from "react"
import { ChartBarDefault, MiniChart } from "@talimy/ui"

export type StudentAcademicPerformanceCardPeriod = "last6Months" | "thisSemester"

export type StudentAcademicPerformanceCardPoint = {
  label: string
  value: number
}

type StudentAcademicPerformanceCardProps = {
  averageScoreMax: number
  averageScoreValue: number
  className?: string
  filterOptions?: ReadonlyArray<{
    label: string
    value: StudentAcademicPerformanceCardPeriod
  }>
  note: string
  period: StudentAcademicPerformanceCardPeriod
  points: readonly StudentAcademicPerformanceCardPoint[]
  title: string
  onPeriodChange?: (value: StudentAcademicPerformanceCardPeriod) => void
}

function formatAverageScoreValue(value: number, maxValue: number) {
  return (
    <>
      {value.toFixed(1)}
      <tspan className="fill-muted-foreground text-base font-medium">/{maxValue.toFixed(1)}</tspan>
    </>
  )
}

export function StudentAcademicPerformanceCard({
  averageScoreMax,
  averageScoreValue,
  className,
  filterOptions,
  note,
  onPeriodChange,
  period,
  points,
  title,
}: StudentAcademicPerformanceCardProps) {
  function handlePeriodChange(value: string) {
    if (value === "last6Months" || value === "thisSemester") {
      onPeriodChange?.(value)
    }
  }

  return (
    <div className={className}>
      <MiniChart
        contentClassName="space-y-5"
        filter={{
          ariaLabel: "Academic performance period filter",
          onValueChange: handlePeriodChange,
          options: [
            ...(filterOptions ?? [
              { label: "Last 6 Months", value: "last6Months" },
              { label: "This Semester", value: "thisSemester" },
            ]),
          ],
          value: period,
        }}
        title={title}
      >
        <ChartBarDefault
          chartType="bar"
          data={[...points]}
          dualConfig={{
            note,
            radialCenterLabel: "Average Score",
            radialCenterValue: formatAverageScoreValue(averageScoreValue, averageScoreMax),
            radialProps: {
              chartClassName: "h-[90px]!",
              containerClassName: "h-[90px] max-w-[220px]",
              cy: "82%",
              guideRadius: 58,
              innerRadius: 50,
              outerRadius: 78,
            },
            radialSegments: [
              {
                color: "var(--talimy-color-navy)",
                key: "core",
                label: "Average Score",
                value: Math.max(0, Math.min(100, (averageScoreValue / averageScoreMax) * 100)),
              },
              {
                color: "var(--talimy-color-pink)",
                key: "bonus",
                label: "Remaining",
                value: Math.max(
                  0,
                  100 - Math.max(0, Math.min(100, (averageScoreValue / averageScoreMax) * 100))
                ),
              },
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
  )
}
