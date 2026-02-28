"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "../../lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

export type MultipleBarChartDataPoint = Record<string, number | string | null | undefined>

export type MultipleBarChartSeries = {
  key: string
  label: string
  color: string
  radius?: number | [number, number, number, number]
  maxBarSize?: number
}

export type MultipleBarChartProps<TData extends MultipleBarChartDataPoint = MultipleBarChartDataPoint> = {
  data: TData[]
  xKey: keyof TData & string
  series: MultipleBarChartSeries[]
  className?: string
  chartClassName?: string
  xAxisTickFormatter?: (value: string) => string
  yAxisTickFormatter?: (value: number) => string
  yDomain?: [number | "auto" | "dataMin", number | "auto" | "dataMax"]
  yTicks?: number[]
  yAxisWidth?: number
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  gridStrokeDasharray?: string
  barCategoryGap?: number | string
  barGap?: number | string
  tooltipIndicator?: "line" | "dot" | "dashed"
  valueFormatter?: (value: number, seriesKey: string) => string
}

export function MultipleBarChart<TData extends MultipleBarChartDataPoint = MultipleBarChartDataPoint>({
  barCategoryGap = 24,
  barGap = 8,
  chartClassName,
  className,
  data,
  gridStrokeDasharray = "4 4",
  series,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  tooltipIndicator = "dashed",
  valueFormatter,
  xAxisTickFormatter,
  xKey,
  yAxisTickFormatter,
  yAxisWidth = 36,
  yDomain = [0, "auto"],
  yTicks,
}: MultipleBarChartProps<TData>) {
  const chartConfig = React.useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        series.map((entry) => [
          entry.key,
          {
            color: entry.color,
            label: entry.label,
          },
        ])
      ) as ChartConfig,
    [series]
  )

  const tooltipFormatter = React.useMemo<React.ComponentProps<typeof ChartTooltipContent>["formatter"]>(() => {
    if (!valueFormatter) {
      return undefined
    }

    return (value, name) => {
      const key = String(name)
      const label = chartConfig[key]?.label ?? key
      const numericValue = Array.isArray(value) ? Number(value[0]) : Number(value)
      const formattedValue = Number.isFinite(numericValue) ? valueFormatter(numericValue, key) : String(value)

      return (
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-foreground font-medium tabular-nums">
            {formattedValue}
          </span>
        </div>
      )
    }
  }, [chartConfig, valueFormatter])

  return (
    <div className={cn("h-full w-full", className)}>
      <ChartContainer className={cn("h-full w-full !aspect-auto", chartClassName)} config={chartConfig}>
        <BarChart accessibilityLayer barCategoryGap={barCategoryGap} barGap={barGap} data={data}>
          {showGrid ? <CartesianGrid strokeDasharray={gridStrokeDasharray} vertical={false} /> : null}
          {showXAxis ? (
            <XAxis
              axisLine={false}
              dataKey={xKey}
              tickFormatter={xAxisTickFormatter}
              tickLine={false}
              tickMargin={8}
            />
          ) : null}
          {showYAxis ? (
            <YAxis
              axisLine={false}
              domain={yDomain}
              tickFormatter={yAxisTickFormatter}
              tickLine={false}
              tickMargin={8}
              ticks={yTicks}
              width={yAxisWidth}
            />
          ) : null}
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={tooltipFormatter} indicator={tooltipIndicator} />}
          />
          {series.map((entry) => (
            <Bar
              key={entry.key}
              dataKey={entry.key}
              fill={`var(--color-${entry.key})`}
              maxBarSize={entry.maxBarSize ?? 22}
              radius={entry.radius ?? [4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
