"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import type { Margin } from "recharts/types/util/types"

import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

export type MultipleBarChartDataPoint = Record<string, number | string | null | undefined>

export type MultipleBarChartSeries = {
  barSize?: number
  color: string
  key: string
  label: string
  maxBarSize?: number
  radius?: number | [number, number, number, number]
}

export type MultipleBarChartProps<TData extends MultipleBarChartDataPoint = MultipleBarChartDataPoint> = {
  barCategoryGap?: number | string
  barGap?: number | string
  chartClassName?: string
  className?: string
  data: TData[]
  description?: React.ReactNode
  footerNote?: React.ReactNode
  footerTrend?: React.ReactNode
  hideFooter?: boolean
  hideHeader?: boolean
  hideTooltipLabel?: boolean
  margin?: Margin
  series: MultipleBarChartSeries[]
  title?: React.ReactNode
  tooltipClassName?: string
  valueFormatter?: (value: number, seriesKey: string) => string
  xAxisTickFormatter?: (value: string) => string
  xAxisPadding?: { left?: number; right?: number }
  xKey: keyof TData & string
}

export function MultipleBarChart<TData extends MultipleBarChartDataPoint = MultipleBarChartDataPoint>({
  barCategoryGap = "12%",
  barGap = 3,
  chartClassName,
  className,
  data,
  description,
  footerNote,
  footerTrend,
  hideFooter = false,
  hideHeader = false,
  hideTooltipLabel = false,
  margin,
  series,
  title,
  tooltipClassName,
  valueFormatter,
  xAxisTickFormatter,
  xAxisPadding,
  xKey,
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
          <span className="text-foreground font-medium tabular-nums">{formattedValue}</span>
        </div>
      )
    }
  }, [chartConfig, valueFormatter])

  return (
    <Card className={cn("h-full rounded-3xl border-0 bg-transparent p-0 shadow-none", className)}>
      {!hideHeader ? (
        <CardHeader className="px-0 pb-3">
          {title ? (
            <CardTitle className="text-base leading-none font-semibold tracking-tight text-[var(--talimy-color-navy)] dark:text-sky-200">
              {title}
            </CardTitle>
          ) : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}

      <CardContent className="p-0">
        <ChartContainer className={cn("h-56 w-full !aspect-auto", chartClassName)} config={chartConfig}>
          <BarChart accessibilityLayer barCategoryGap={barCategoryGap} barGap={barGap} data={data} margin={margin}>
            <CartesianGrid strokeDasharray="0" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey={xKey}
              padding={xAxisPadding}
              tickFormatter={xAxisTickFormatter}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className={cn(
                    "min-w-28 rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs shadow-md",
                    tooltipClassName
                  )}
                  formatter={tooltipFormatter}
                  hideLabel={hideTooltipLabel}
                  indicator="dashed"
                />
              }
            />
            {series.map((entry) => (
              <Bar
                barSize={entry.barSize}
                key={entry.key}
                dataKey={entry.key}
                fill={`var(--color-${entry.key})`}
                maxBarSize={entry.maxBarSize ?? 22}
                radius={entry.radius ?? 4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>

      {!hideFooter ? (
        <CardFooter className="flex-col items-start gap-2 px-0 pt-3 text-sm">
          {footerTrend ? (
            <div className="flex items-center gap-2 leading-none font-medium">
              {footerTrend} <TrendingUp className="h-4 w-4" />
            </div>
          ) : null}
          {footerNote ? <div className="text-muted-foreground leading-none">{footerNote}</div> : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}

export const ChartBarMultiple = MultipleBarChart
