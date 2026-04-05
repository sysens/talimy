"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { cn } from "../../lib/utils"
import type { ChartFilterSelectProps } from "../chart-filter-select"
import { ChartFilterSelect } from "../chart-filter-select"
import { Card } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"

export type CompactGroupedBarChartDatum = Record<string, number | string | null | undefined>

export type CompactGroupedBarChartSeries = {
  color: string
  key: string
  label: string
}

export type CompactGroupedBarChartProps<
  TData extends CompactGroupedBarChartDatum = CompactGroupedBarChartDatum,
> = {
  barCategoryGap?: number | string
  barGap?: number | string
  chartHeight?: number
  className?: string
  data: TData[]
  filter?: Omit<ChartFilterSelectProps, "className">
  filterClassName?: string
  frameClassName?: string
  series: CompactGroupedBarChartSeries[]
  tickValues?: number[]
  title: React.ReactNode
  titleClassName?: string
  valueFormatter?: (value: number, key: string) => string
  xKey: keyof TData & string
  yDomain?: [number, number]
}

export function CompactGroupedBarChart<
  TData extends CompactGroupedBarChartDatum = CompactGroupedBarChartDatum,
>({
  barCategoryGap = "36%",
  barGap = 3,
  chartHeight = 122,
  className,
  data,
  filter,
  filterClassName,
  frameClassName,
  series,
  tickValues = [0, 25, 50, 75, 100],
  title,
  titleClassName,
  valueFormatter = (value) => `${value.toFixed(0)}%`,
  xKey,
  yDomain = [0, 100],
}: CompactGroupedBarChartProps<TData>) {
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

  return (
    <Card className={cn("w-full rounded-[24px] border-0 bg-card p-0 shadow-none", className)}>
      <div className="space-y-3 p-3">
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h3
              className={cn(
                "text-[13px] leading-none font-semibold tracking-tight text-talimy-navy dark:text-sky-200",
                titleClassName
              )}
            >
              {title}
            </h3>

            <div className="flex flex-wrap items-center gap-2.5 text-[9px] text-muted-foreground">
              {series.map((entry) => (
                <div key={entry.key} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>

          {filter ? (
            <ChartFilterSelect {...filter} className={cn("shrink-0", filterClassName)} />
          ) : null}
        </header>

        <div
          className={cn(
            "rounded-[18px] border border-border/70 bg-card/70 px-2 pb-1.5 pt-2",
            frameClassName
          )}
        >
          <ChartContainer
            className="w-full !aspect-auto"
            config={chartConfig}
            style={{ height: chartHeight }}
          >
            <ResponsiveContainer>
              <BarChart
                barCategoryGap={barCategoryGap}
                barGap={barGap}
                data={data}
                margin={{ bottom: 0, left: -20, right: 2, top: 2 }}
              >
                <CartesianGrid
                  stroke="color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)"
                  vertical={false}
                />
                <YAxis
                  axisLine={false}
                  domain={yDomain}
                  tick={{ fill: "var(--talimy-color-gray)", fontSize: 9 }}
                  tickFormatter={(value: number) => `${value}%`}
                  tickLine={false}
                  tickMargin={4}
                  ticks={tickValues}
                  width={24}
                />
                <XAxis
                  axisLine={false}
                  dataKey={xKey}
                  tick={{ fill: "var(--talimy-color-gray)", fontSize: 9 }}
                  tickLine={false}
                  tickMargin={6}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="min-w-28 rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs shadow-md"
                      formatter={(value, name) => {
                        const key = String(name)
                        const label = chartConfig[key]?.label ?? key
                        const numericValue = Array.isArray(value) ? Number(value[0]) : Number(value)

                        return (
                          <div className="flex w-full items-center justify-between gap-3">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-semibold text-talimy-navy dark:text-sky-200">
                              {valueFormatter(numericValue, key)}
                            </span>
                          </div>
                        )
                      }}
                      indicator="dashed"
                    />
                  }
                />
                {series.map((entry) => (
                  <Bar
                    key={entry.key}
                    barSize={7}
                    dataKey={entry.key}
                    fill={`var(--color-${entry.key})`}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </Card>
  )
}
