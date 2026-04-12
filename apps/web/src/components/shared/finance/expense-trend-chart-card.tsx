"use client"

import * as React from "react"
import { ChartContainer, MiniChart } from "@talimy/ui"
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts"

export type ExpenseTrendChartPoint = {
  isCurrent?: boolean
  label: string
  shortLabel: string
  value: number
}

export type ExpenseTrendChartOption<TPeriod extends string> = {
  label: string
  value: TPeriod
}

type ExpenseTrendChartCardProps<TPeriod extends string> = {
  className?: string
  dataByPeriod: Record<TPeriod, readonly ExpenseTrendChartPoint[]>
  filterAriaLabel: string
  filterOptions: readonly [ExpenseTrendChartOption<TPeriod>, ...ExpenseTrendChartOption<TPeriod>[]]
  onPeriodChange?: (value: TPeriod) => void
  period?: TPeriod
  title: string
  valueFormatter?: (value: number) => string
  yScaleValues: readonly string[]
}

type ExpenseTrendChartDatum = {
  fill: string
  label: string
  shortLabel: string
  value: number
}

const CHART_CONFIG = {
  value: {
    color: "var(--talimy-color-pink)",
    label: "Expense",
  },
} as const

function isExpenseTrendPeriod<TPeriod extends string>(
  value: string,
  options: readonly ExpenseTrendChartOption<TPeriod>[]
): value is TPeriod {
  return options.some((option) => option.value === value)
}

export function ExpenseTrendChartCard<TPeriod extends string>({
  className,
  dataByPeriod,
  filterAriaLabel,
  filterOptions,
  onPeriodChange,
  period,
  title,
  valueFormatter = (value) => value.toLocaleString(),
  yScaleValues,
}: ExpenseTrendChartCardProps<TPeriod>) {
  const defaultPeriod = filterOptions[0].value
  const [internalPeriod, setInternalPeriod] = React.useState<TPeriod>(defaultPeriod)
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null)
  const activePeriod = period ?? internalPeriod
  const activeData = dataByPeriod[activePeriod] ?? dataByPeriod[defaultPeriod]

  const chartData = React.useMemo<readonly ExpenseTrendChartDatum[]>(
    () =>
      activeData.map((item, index) => ({
        fill:
          (item.isCurrent ?? index === activeData.length - 1)
            ? "var(--talimy-color-navy)"
            : "var(--talimy-color-pink)",
        label: item.label,
        shortLabel: item.shortLabel,
        value: item.value,
      })),
    [activeData]
  )

  const hoveredPoint = React.useMemo(
    () => chartData.find((item) => item.label === hoveredLabel) ?? null,
    [chartData, hoveredLabel]
  )
  const chartMaxValue = React.useMemo(
    () => Math.max(...chartData.map((item) => item.value), 1),
    [chartData]
  )
  const hoveredPointIndex = hoveredPoint
    ? chartData.findIndex((item) => item.label === hoveredPoint.label)
    : -1
  const hoveredPointTop =
    hoveredPoint === null ? null : 16 + ((chartMaxValue - hoveredPoint.value) / chartMaxValue) * 126
  const hoveredPointLeft =
    hoveredPointIndex < 0 ? null : `${((hoveredPointIndex + 0.5) / chartData.length) * 100}%`

  return (
    <MiniChart
      bottomLabels={{
        distribution: "evenly",
        values: chartData.map((item) => item.shortLabel),
      }}
      chartClassName="min-h-[130px] pl-11"
      className={className}
      contentClassName="space-y-4 p-5"
      filter={{
        ariaLabel: filterAriaLabel,
        onValueChange: (value) => {
          if (!isExpenseTrendPeriod(value, filterOptions)) {
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
      filterTriggerClassName="h-10 min-w-[124px] rounded-[16px] bg-[var(--talimy-color-sky)]/70 px-3 text-[13px] font-medium text-talimy-navy"
      title={title}
      yScale={{ values: [...yScaleValues] }}
    >
      <div className="relative h-[130px] w-full">
        <div className="pointer-events-none absolute inset-0 grid grid-rows-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="flex items-center" key={`expense-trend-row-${index}`}>
              <div
                className="h-px w-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)",
                }}
              />
            </div>
          ))}
        </div>

        <ChartContainer className="relative z-10 h-[130px] w-full" config={CHART_CONFIG}>
          <BarChart data={[...chartData]} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <CartesianGrid stroke="transparent" vertical={false} />
            <XAxis dataKey="label" hide />
            <Bar dataKey="value" fill="var(--talimy-color-pink)" radius={[12, 12, 0, 0]}>
              {chartData.map((item) => (
                <Cell key={`expense-trend-bar-${item.label}`} fill={item.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {hoveredPoint !== null && hoveredPointLeft !== null && hoveredPointTop !== null ? (
          <div
            className="pointer-events-none absolute z-30 min-w-[108px] -translate-x-1/2 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-left shadow-sm"
            style={{
              left: hoveredPointLeft,
              top: `${hoveredPointTop - 54}px`,
            }}
          >
            <div className="text-[11px] text-slate-500">{hoveredPoint.label}</div>
            <div className="text-[13px] font-semibold text-talimy-navy">
              {valueFormatter(hoveredPoint.value)}
            </div>
          </div>
        ) : null}

        <div
          className="absolute inset-0 z-20 grid"
          style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}
        >
          {chartData.map((item) => (
            <button
              aria-label={`${item.label} ${valueFormatter(item.value)}`}
              className="h-full w-full appearance-none border-0 bg-transparent p-0 outline-none"
              key={`expense-trend-zone-${item.label}`}
              onBlur={() => setHoveredLabel(null)}
              onFocus={() => setHoveredLabel(item.label)}
              onMouseEnter={() => setHoveredLabel(item.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              type="button"
            />
          ))}
        </div>
      </div>
    </MiniChart>
  )
}
