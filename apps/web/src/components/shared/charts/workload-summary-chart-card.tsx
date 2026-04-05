"use client"

import type {
  ChartFilterSelectProps,
  MiniChartLegendItem,
  StackedExpandedAreaPoint,
  StackedExpandedAreaSeries,
} from "@talimy/ui"
import { ChartAreaStackedExpand, MiniChart } from "@talimy/ui"

type WorkloadSummaryChartCardProps = {
  className?: string
  data: readonly StackedExpandedAreaPoint[]
  filter: Omit<ChartFilterSelectProps, "className">
  title: string
}

const WORKLOAD_LEGEND: readonly MiniChartLegendItem[] = [
  { color: "var(--talimy-color-sky)", id: "classes", label: "Total Classes" },
  { color: "var(--talimy-color-navy)", id: "hours", label: "Teaching Hours" },
  { color: "var(--talimy-color-pink)", id: "extra", label: "Extra Duties" },
] as const

const WORKLOAD_SERIES: readonly StackedExpandedAreaSeries[] = [
  { color: "var(--talimy-color-navy)", key: "teachingHours", label: "Teaching Hours" },
  { color: "var(--talimy-color-sky)", key: "totalClasses", label: "Total Classes" },
  { color: "var(--talimy-color-pink)", key: "extraDuties", label: "Extra Duties" },
] as const

export function WorkloadSummaryChartCard({
  className,
  data,
  filter,
  title,
}: WorkloadSummaryChartCardProps) {
  return (
    <MiniChart
      bottomLabels={{
        className: "mt-[-18px]",
        values: data.map((item) => item.label),
      }}
      chartClassName="min-h-[196px]"
      className={className}
      contentClassName="space-y-3"
      filter={filter}
      legend={[...WORKLOAD_LEGEND]}
      title={title}
      yScale={{
        values: ["160 h", "120 h", "80 h", "40 h", "0 h"],
      }}
    >
      <ChartAreaStackedExpand
        className="flex h-full items-end"
        data={[...data]}
        hideXAxis
        series={[...WORKLOAD_SERIES]}
      />
    </MiniChart>
  )
}
