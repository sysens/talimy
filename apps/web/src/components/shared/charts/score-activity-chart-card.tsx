"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartFilterSelect,
} from "@talimy/ui"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

type ScoreActivityChartCardPoint = {
  id: string
  label: string
  value: number
}

type ScoreActivityChartCardFilterOption<TPeriod extends string> = {
  label: string
  value: TPeriod
}

type ScoreActivityChartCardProps<TPeriod extends string> = {
  className?: string
  data: readonly ScoreActivityChartCardPoint[]
  emptyLabel?: string
  filterAriaLabel: string
  filterOptions: readonly [
    ScoreActivityChartCardFilterOption<TPeriod>,
    ...ScoreActivityChartCardFilterOption<TPeriod>[],
  ]
  metricLabel: string
  onPeriodChange?: (value: TPeriod) => void
  period: TPeriod
  title: string
}

function ScoreActivityTooltip(props: ScoreActivityTooltipProps) {
  if (!props.active || !props.payload || props.payload.length === 0) {
    return null
  }

  const currentValue = props.payload[0]?.value
  const value = typeof currentValue === "number" ? currentValue : Number(currentValue ?? 0)

  return (
    <div className="rounded-[18px] border border-slate-100 bg-white px-3 py-2 text-center shadow-sm">
      <p className="text-[11px] text-slate-500">{String(props.label ?? "")}</p>
      <p className="text-[22px] leading-none font-semibold text-talimy-navy">{value}%</p>
    </div>
  )
}

export function ScoreActivityChartCard<TPeriod extends string>({
  className,
  data,
  emptyLabel = "Ma'lumot topilmadi.",
  filterAriaLabel,
  filterOptions,
  metricLabel,
  onPeriodChange,
  period,
  title,
}: ScoreActivityChartCardProps<TPeriod>) {
  const chartConfig = {
    score: {
      color: "var(--talimy-color-pink)",
      label: metricLabel,
    },
  } as const

  return (
    <Card
      className={[
        "rounded-[28px] border border-slate-100 bg-white shadow-none",
        className ?? "",
      ].join(" ")}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <CardTitle className="text-[18px] font-semibold text-talimy-navy">{title}</CardTitle>
        <ChartFilterSelect
          ariaLabel={filterAriaLabel}
          onValueChange={(value) => {
            const nextValue = filterOptions.find((item) => item.value === value)?.value
            if (nextValue) {
              onPeriodChange?.(nextValue)
            }
          }}
          options={[...filterOptions]}
          triggerClassName="h-9 min-w-[96px] rounded-[12px] bg-[#f7f7f8] px-3 text-[12px] font-medium text-slate-500"
          value={period}
        />
      </CardHeader>

      <CardContent className="p-5 py-0">
        {data.length === 0 ? (
          <div className="flex h-[150px]! items-center justify-center rounded-[22px] border border-dashed border-slate-200 text-sm text-slate-400">
            {emptyLabel}
          </div>
        ) : (
          <ChartContainer className="h-[200px] w-full" config={chartConfig}>
            <AreaChart data={data} margin={{ bottom: 6, left: -12, right: 14, top: 20 }}>
              <defs>
                <linearGradient id="student-score-activity-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--talimy-color-pink)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--talimy-color-pink)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#edf1f5" strokeDasharray="2 2" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "#98a4b3", fontSize: 12 }}
                tickLine={false}
                tickMargin={12}
              />
              <YAxis
                axisLine={false}
                domain={[0, 100]}
                tick={{ fill: "#98a4b3", fontSize: 12 }}
                tickCount={5}
                tickFormatter={(value) => `${value}`}
                tickLine={false}
                width={32}
              />
              <Area
                activeDot={{
                  fill: "white",
                  r: 7,
                  stroke: "var(--talimy-color-pink)",
                  strokeWidth: 3,
                }}
                dataKey="value"
                dot={{
                  fill: "var(--talimy-color-pink)",
                  r: 0,
                  stroke: "var(--talimy-color-pink)",
                }}
                fill="url(#student-score-activity-fill)"
                fillOpacity={1}
                stroke="var(--talimy-color-pink)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                type="monotone"
              />
              <Tooltip
                content={<ScoreActivityTooltip />}
                cursor={{ stroke: "#f9d3ff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
type ScoreActivityTooltipPayload = {
  value?: number | string
}

type ScoreActivityTooltipProps = {
  active?: boolean
  label?: number | string
  payload?: readonly ScoreActivityTooltipPayload[]
}
