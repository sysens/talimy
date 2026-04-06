"use client"

import * as React from "react"
import { GroupedCappedProgressChart, type GroupedCappedProgressChartSeries } from "@talimy/ui"

export type AcademicPerformanceChartRow = {
  [key: string]: number | string
  month: string
}

export type AcademicPerformanceChartOption<TPeriod extends string> = {
  label: string
  value: TPeriod
}

type AcademicPerformanceChartCardProps<TPeriod extends string> = {
  className?: string
  dataByPeriod: Record<TPeriod, readonly AcademicPerformanceChartRow[]>
  filterAriaLabel: string
  filterOptions: readonly [
    AcademicPerformanceChartOption<TPeriod>,
    ...AcademicPerformanceChartOption<TPeriod>[],
  ]
  maxValue?: number
  onPeriodChange?: (value: TPeriod) => void
  period?: TPeriod
  series: readonly GroupedCappedProgressChartSeries[]
  title: string
  valueFormatter?: (value: number, key: string) => string
  xKey?: string
}

function isAcademicPerformancePeriod<TPeriod extends string>(
  value: string,
  options: readonly AcademicPerformanceChartOption<TPeriod>[]
): value is TPeriod {
  return options.some((option) => option.value === value)
}

export function AcademicPerformanceChartCard<TPeriod extends string>({
  className,
  dataByPeriod,
  filterAriaLabel,
  filterOptions,
  maxValue = 100,
  onPeriodChange,
  period,
  series,
  title,
  valueFormatter = (value) => `${value.toFixed(1)}%`,
  xKey = "month",
}: AcademicPerformanceChartCardProps<TPeriod>) {
  const defaultPeriod = filterOptions[0].value
  const [internalPeriod, setInternalPeriod] = React.useState<TPeriod>(defaultPeriod)
  const activePeriod = period ?? internalPeriod
  const activeRows = dataByPeriod[activePeriod] ?? dataByPeriod[defaultPeriod]

  return (
    <GroupedCappedProgressChart
      className={className}
      data={[...activeRows]}
      filter={{
        ariaLabel: filterAriaLabel,
        onValueChange: (value) => {
          if (!isAcademicPerformancePeriod(value, filterOptions)) {
            return
          }

          if (onPeriodChange) {
            onPeriodChange(value)
            return
          }

          setInternalPeriod(value)
        },
        options: [...filterOptions],
        value: activePeriod,
      }}
      maxValue={maxValue}
      series={[...series]}
      title={title}
      valueFormatter={valueFormatter}
      xKey={xKey}
    />
  )
}
