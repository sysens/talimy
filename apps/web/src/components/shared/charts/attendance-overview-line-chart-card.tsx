"use client"

import * as React from "react"
import { ChartContainer, MiniChart, type ChartConfig } from "@talimy/ui"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

type AttendanceOverviewLineChartCardPeriodOption<TPeriod extends string> = {
  label: string
  value: TPeriod
}

type AttendanceOverviewLineChartPoint = {
  label: string
  staff: number
  students: number
  teachers: number
}

type AttendanceOverviewLineChartCardProps<TPeriod extends string> = {
  className?: string
  data: readonly AttendanceOverviewLineChartPoint[]
  filterAriaLabel: string
  filterOptions: readonly [
    AttendanceOverviewLineChartCardPeriodOption<TPeriod>,
    ...AttendanceOverviewLineChartCardPeriodOption<TPeriod>[],
  ]
  legend: {
    staff: string
    students: string
    teachers: string
  }
  onPeriodChange?: (value: TPeriod) => void
  period: TPeriod
  title: string
}

type TooltipRowProps = {
  color: string
  label: string
  value: number
}

type TooltipContentProps = {
  point: AttendanceOverviewLineChartPoint
  labels: AttendanceOverviewLineChartCardProps<string>["legend"]
}

const CHART_CONFIG = {
  staff: {
    color: "var(--talimy-color-navy)",
    label: "Staff",
  },
  students: {
    color: "var(--talimy-color-pink)",
    label: "Students",
  },
  teachers: {
    color: "var(--talimy-color-sky)",
    label: "Teachers",
  },
} satisfies ChartConfig

function TooltipRow({ color, label, value }: TooltipRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-talimy-navy">{formatPercentage(value)}</span>
    </div>
  )
}

function TooltipContent({ labels, point }: TooltipContentProps) {
  return (
    <div className="min-w-[160px] rounded-[18px] border border-slate-100 bg-white p-3 shadow-sm">
      <p className="mb-2 text-xs font-semibold text-slate-600">{point.label}</p>
      <div className="space-y-1.5">
        <TooltipRow
          color="var(--talimy-color-pink)"
          label={labels.students}
          value={point.students}
        />
        <TooltipRow
          color="var(--talimy-color-sky)"
          label={labels.teachers}
          value={point.teachers}
        />
        <TooltipRow color="var(--talimy-color-navy)" label={labels.staff} value={point.staff} />
      </div>
    </div>
  )
}

function formatPercentage(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`
}

export function AttendanceOverviewLineChartCard<TPeriod extends string>({
  className,
  data,
  filterAriaLabel,
  filterOptions,
  legend,
  onPeriodChange,
  period,
  title,
}: AttendanceOverviewLineChartCardProps<TPeriod>) {
  const chartId = React.useId().replace(/:/g, "")
  const studentsGradientId = `attendance-overview-students-${chartId}`
  const teachersGradientId = `attendance-overview-teachers-${chartId}`
  const staffGradientId = `attendance-overview-staff-${chartId}`
  const [activePointIndex, setActivePointIndex] = React.useState<number | null>(null)
  const activePoint = React.useMemo<AttendanceOverviewLineChartPoint | null>(() => {
    if (activePointIndex === null || activePointIndex < 0 || activePointIndex >= data.length) {
      return null
    }

    return data[activePointIndex] ?? null
  }, [activePointIndex, data])

  return (
    <MiniChart
      bottomLabels={{
        className: "text-[11px]",
        distribution: "grid",
        values: data.map((item) => item.label),
      }}
      chartClassName="min-h-[138px]"
      className={className}
      contentClassName="space-y-3 px-4 py-4"
      filter={{
        ariaLabel: filterAriaLabel,
        onValueChange: (value) => {
          const nextValue = filterOptions.find((option) => option.value === value)?.value
          if (nextValue) {
            onPeriodChange?.(nextValue)
          }
        },
        options: [...filterOptions],
        value: period,
      }}
      filterTriggerClassName="h-9 min-w-[136px] rounded-[16px] bg-[var(--talimy-color-sky)]/70 px-3 text-[13px] font-medium text-talimy-navy"
      legend={[
        {
          color: "var(--talimy-color-pink)",
          id: "students",
          label: legend.students,
          marker: "line",
        },
        {
          color: "var(--talimy-color-sky)",
          id: "teachers",
          label: legend.teachers,
          marker: "line",
        },
        { color: "var(--talimy-color-navy)", id: "staff", label: legend.staff, marker: "line" },
      ]}
      title={title}
      titleClassName="text-[15px]"
      yScale={{
        className: "text-[10px]",
        values: ["100%", "75%", "50%", "25%", "0%"],
      }}
    >
      <div className="relative">
        {activePoint !== null ? (
          <div
            className="pointer-events-none absolute top-2 z-30 -translate-x-1/2"
            style={{
              left: `${((activePointIndex ?? 0) + 0.5) * (100 / Math.max(data.length, 1))}%`,
            }}
          >
            <TooltipContent labels={legend} point={activePoint} />
          </div>
        ) : null}

        <ChartContainer className="h-[138px] w-full" config={CHART_CONFIG}>
          <AreaChart data={data} margin={{ bottom: 0, left: 2, right: 4, top: 6 }}>
            <defs>
              <linearGradient id={studentsGradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--talimy-color-pink)" stopOpacity={0.22} />
                <stop offset="95%" stopColor="var(--talimy-color-pink)" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id={teachersGradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--talimy-color-sky)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--talimy-color-sky)" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id={staffGradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--talimy-color-navy)" stopOpacity={0.16} />
                <stop offset="95%" stopColor="var(--talimy-color-navy)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="color-mix(in srgb, var(--talimy-color-gray) 16%, white 84%)"
              vertical={false}
            />
            <YAxis domain={[0, 100]} hide />
            <XAxis dataKey="label" hide />
            <Area
              activeDot={{
                fill: "var(--talimy-color-pink)",
                r: 4.5,
                stroke: "white",
                strokeWidth: 2,
              }}
              dataKey="students"
              dot={{ fill: "var(--talimy-color-pink)", r: 3, stroke: "white", strokeWidth: 1.5 }}
              fill={`url(#${studentsGradientId})`}
              fillOpacity={1}
              stroke="var(--talimy-color-pink)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.25}
              type="monotone"
            />
            <Area
              activeDot={{
                fill: "var(--talimy-color-sky)",
                r: 4.5,
                stroke: "white",
                strokeWidth: 2,
              }}
              dataKey="teachers"
              dot={{ fill: "var(--talimy-color-sky)", r: 3, stroke: "white", strokeWidth: 1.5 }}
              fill={`url(#${teachersGradientId})`}
              fillOpacity={1}
              stroke="var(--talimy-color-sky)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.25}
              type="monotone"
            />
            <Area
              activeDot={{
                fill: "var(--talimy-color-navy)",
                r: 4.5,
                stroke: "white",
                strokeWidth: 2,
              }}
              dataKey="staff"
              dot={{ fill: "var(--talimy-color-navy)", r: 3, stroke: "white", strokeWidth: 1.5 }}
              fill={`url(#${staffGradientId})`}
              fillOpacity={1}
              stroke="var(--talimy-color-navy)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.25}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>

        <div
          className="absolute inset-0 z-20 grid"
          style={{ gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))` }}
        >
          {data.map((point, index) => (
            <button
              aria-label={`${point.label} attendance details`}
              className="h-full w-full appearance-none border-0 bg-transparent p-0"
              key={`attendance-overview-hover-${point.label}`}
              onBlur={() => setActivePointIndex(null)}
              onFocus={() => setActivePointIndex(index)}
              onMouseEnter={() => setActivePointIndex(index)}
              onMouseLeave={() => setActivePointIndex(null)}
              type="button"
            />
          ))}
        </div>
      </div>
    </MiniChart>
  )
}
