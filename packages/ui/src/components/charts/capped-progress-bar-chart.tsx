"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "../../lib/utils"
import type { ChartFilterSelectProps } from "../chart-filter-select"
import { ChartFilterSelect } from "../chart-filter-select"
import { Card } from "../ui/card"
import { ChartContainer, type ChartConfig } from "../ui/chart"

export type CappedProgressBarChartDatum = {
  accent?: number
  label: string
  value: number
}

export type CappedProgressBarChartProps = {
  className?: string
  data: CappedProgressBarChartDatum[]
  filter?: Omit<ChartFilterSelectProps, "className">
  maxValue: number
  subtitle?: React.ReactNode
  title: React.ReactNode
  valueFormatter?: (value: number) => string
}

const CHART_CONFIG = {
  accent: {
    color: "var(--talimy-color-navy)",
    label: "Accent",
  },
  value: {
    color: "var(--talimy-color-pink)",
    label: "Attendance",
  },
} satisfies ChartConfig

export function CappedProgressBarChart({
  className,
  data,
  filter,
  maxValue,
  subtitle,
  title,
  valueFormatter = (value) => value.toLocaleString(),
}: CappedProgressBarChartProps) {
  const chartData = React.useMemo(
    () =>
      data.map((item) => ({
        accent: item.accent ?? Math.min(item.value * 0.03, 22),
        label: item.label,
        remainder: Math.max(maxValue - item.value, 0),
        value: item.value,
      })),
    [data, maxValue]
  )

  return (
    <Card className={cn("w-full rounded-[26px] border-0 bg-card p-0 shadow-none", className)}>
      <div className="space-y-4 p-4 sm:p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-[15px] leading-none font-semibold tracking-tight text-talimy-navy dark:text-sky-200">
              {title}
            </h3>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>

          {filter ? (
            <ChartFilterSelect
              {...filter}
              className="shrink-0"
              triggerClassName="h-11 min-w-[126px] rounded-xl px-3 text-sm font-semibold"
            />
          ) : null}
        </header>

        <div className="rounded-[18px] bg-card px-1 pb-1 pt-1">
          <ChartContainer className="h-[235px] w-full !aspect-auto" config={CHART_CONFIG}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ bottom: 18, left: -20, right: 8, top: 18 }}>
                <defs>
                  <linearGradient id="talimy-capped-progress-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="color-mix(in srgb, var(--talimy-color-pink) 58%, white 42%)"
                    />
                    <stop
                      offset="100%"
                      stopColor="color-mix(in srgb, var(--talimy-color-pink) 12%, white 88%)"
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="color-mix(in srgb, var(--talimy-color-gray) 14%, white 86%)"
                  vertical={false}
                />
                <YAxis axisLine={false} domain={[0, maxValue]} hide tickLine={false} />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  tick={{ fill: "var(--talimy-color-gray)", fontSize: 12 }}
                  tickLine={false}
                  tickMargin={14}
                />

                <Bar
                  background={{
                    fill: "color-mix(in srgb, var(--talimy-color-pink) 18%, white 82%)",
                    radius: 10,
                  }}
                  barSize={56}
                  dataKey="value"
                  fill="url(#talimy-capped-progress-fill)"
                  radius={[10, 10, 0, 0]}
                  stackId="attendance"
                >
                  <LabelList
                    content={(props) => {
                      const {
                        index = 0,
                        value,
                        x = 0,
                        width = 0,
                        y = 0,
                      } = props as {
                        index?: number
                        value?: number
                        width?: number
                        x?: number
                        y?: number
                      }
                      const datum = chartData[index]
                      const numericValue = typeof value === "number" ? value : (datum?.value ?? 0)

                      return (
                        <text
                          fill="var(--talimy-color-navy)"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                          x={x + width / 2}
                          y={y - 8}
                        >
                          {valueFormatter(numericValue)}
                        </text>
                      )
                    }}
                  />
                </Bar>
                <Bar
                  barSize={56}
                  dataKey="accent"
                  fill="var(--talimy-color-navy)"
                  radius={[0, 0, 0, 0]}
                  stackId="attendance"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </Card>
  )
}
