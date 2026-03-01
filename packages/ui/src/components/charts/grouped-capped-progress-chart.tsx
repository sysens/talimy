"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "../../lib/utils"
import type { ChartFilterSelectProps } from "../chart-filter-select"
import { ChartFilterSelect } from "../chart-filter-select"
import { Card } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"

export type GroupedCappedProgressChartDatum = Record<string, number | string | null | undefined>

export type GroupedCappedProgressChartSeries = {
  accentColor: string
  color: string
  key: string
  label: string
}

export type GroupedCappedProgressChartProps<
  TData extends GroupedCappedProgressChartDatum = GroupedCappedProgressChartDatum,
> = {
  barCategoryGap?: number | string
  barGap?: number | string
  capHeight?: number
  chartHeight?: number
  className?: string
  data: TData[]
  filter?: Omit<ChartFilterSelectProps, "className">
  maxValue: number
  series: GroupedCappedProgressChartSeries[]
  title: React.ReactNode
  valueFormatter?: (value: number, key: string) => string
  xKey: keyof TData & string
}

export function GroupedCappedProgressChart<
  TData extends GroupedCappedProgressChartDatum = GroupedCappedProgressChartDatum,
>({
  barCategoryGap = "34%",
  barGap = 0,
  capHeight = 3,
  chartHeight = 210,
  className,
  data,
  filter,
  maxValue,
  series,
  title,
  valueFormatter = (value) => `${value.toFixed(0)}%`,
  xKey,
}: GroupedCappedProgressChartProps<TData>) {
  const chartConfig = React.useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        series.flatMap((entry) => [
          [
            entry.key,
            {
              color: entry.color,
              label: entry.label,
            },
          ],
          [
            `${entry.key}Cap`,
            {
              color: entry.accentColor,
              label: `${entry.label} accent`,
            },
          ],
        ])
      ) as ChartConfig,
    [series]
  )

  const chartData = data

  type CapBarShapeProps = {
    fill?: string
    height?: number
    width?: number
    x?: number
    y?: number
  }

  function CapBarShape({
    fill,
    height = 0,
    width = 0,
    x = 0,
    y = 0,
    accentColor,
  }: CapBarShapeProps & { accentColor: string }) {
    if (height <= 0 || width <= 0) {
      return <g />
    }

    const effectiveCapHeight = Math.max(Math.min(capHeight, height), 2)
    const gapHeight = 3
    const bodyHeight = Math.max(height - effectiveCapHeight - gapHeight, 0)
    const bodyY = y + effectiveCapHeight + gapHeight

    return (
      <g>
        {bodyHeight > 0 ? (
          <rect fill={fill} height={bodyHeight} rx={0} ry={0} width={width} x={x} y={bodyY} />
        ) : null}
        <rect fill={accentColor} height={effectiveCapHeight} rx={0} ry={0} width={width} x={x} y={y} />
      </g>
    )
  }

  return (
    <Card className={cn("w-full rounded-[24px] border-0 bg-card p-0 shadow-none", className)}>
      <div className="space-y-4 p-4 sm:p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <h3 className="text-[15px] leading-none font-semibold tracking-tight text-[var(--talimy-color-navy)] dark:text-sky-200">
              {title}
            </h3>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              {series.map((entry) => (
                <div key={entry.key} className="flex items-center gap-2">
                  <span className="size-2 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>

          {filter ? (
            <ChartFilterSelect
              {...filter}
              className="shrink-0"
              triggerClassName="h-11 min-w-[150px] rounded-xl px-3 text-sm font-semibold"
            />
          ) : null}
        </header>

        <ChartContainer className="w-full !aspect-auto" config={chartConfig} style={{ height: chartHeight }}>
          <BarChart
            barCategoryGap={barCategoryGap}
            barGap={barGap}
            data={chartData}
            margin={{ bottom: 6, left: 0, right: 8, top: 8 }}
          >
            <CartesianGrid
              stroke="color-mix(in srgb, var(--talimy-color-gray) 16%, white 84%)"
              vertical={false}
            />
            <YAxis axisLine={false} domain={[0, maxValue]} hide tickLine={false} />
            <XAxis
              axisLine={false}
              dataKey={xKey}
              tick={{ fill: "var(--talimy-color-gray)", fontSize: 12 }}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="min-w-28 rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs shadow-md"
                  formatter={(value, name, _item, _index, payload) => {
                    const key = String(name)
                    const label = chartConfig[key]?.label ?? key
                    const entry = Array.isArray(payload)
                      ? (payload.find((item) => String(item.name) === key)?.payload as
                          | Record<string, number | string>
                          | undefined)
                      : undefined
                    const numericValue = Number(entry?.[key] ?? value)

                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold text-[var(--talimy-color-navy)] dark:text-sky-200">
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
                barSize={18}
                dataKey={entry.key}
                fill={entry.color}
                minPointSize={4}
                shape={(props: unknown) => (
                  <CapBarShape {...(props as CapBarShapeProps)} accentColor={entry.accentColor} />
                )}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
