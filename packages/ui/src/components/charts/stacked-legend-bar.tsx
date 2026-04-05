"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

export type StackedLegendBarSeries = {
  color: string
  key: string
  label: string
}

export type StackedLegendBarPoint = Record<string, number | string> & {
  label: string
}

export type ChartBarStackedProps = {
  className?: string
  data: StackedLegendBarPoint[]
  description?: React.ReactNode
  hideHeader?: boolean
  maxValue?: number
  series: StackedLegendBarSeries[]
  title?: React.ReactNode
}

export const stackedLegendBarDescription = "A stacked bar chart with a legend"

export function ChartBarStacked({
  className,
  data,
  description,
  hideHeader = false,
  maxValue = 40,
  series,
  title,
}: ChartBarStackedProps) {
  const chartConfig = React.useMemo(
    () =>
      Object.fromEntries(
        series.map((item) => [
          item.key,
          {
            color: item.color,
            label: item.label,
          },
        ])
      ) satisfies ChartConfig,
    [series]
  )

  return (
    <Card className={cn("rounded-3xl border-0 bg-transparent p-0 shadow-none", className)}>
      {!hideHeader ? (
        <CardHeader className="p-0 pb-4">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}

      <CardContent className="p-0">
        <ChartContainer className="h-[236px] w-full !aspect-auto" config={chartConfig}>
          <BarChart
            accessibilityLayer
            barCategoryGap="16%"
            data={data}
            margin={{ bottom: 20, left: 0, right: 0, top: 0 }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              axisLine={false}
              domain={[0, maxValue]}
              tick={{ fontSize: 11 }}
              tickCount={5}
              tickFormatter={(value) => `${value} h`}
              tickLine={false}
              width={28}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              height={52}
              interval={0}
              tick={(props: unknown) => {
                const {
                  payload,
                  x = 0,
                  y = 0,
                } = props as {
                  payload?: { value?: string }
                  x?: number
                  y?: number
                }
                const lines = (payload?.value ?? "").split("\n")

                return (
                  <text
                    dominantBaseline="hanging"
                    fill="var(--talimy-color-gray)"
                    fontSize="11"
                    textAnchor="middle"
                    x={x}
                    y={y + 8}
                  >
                    {lines.map((line, index) => (
                      <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : 13}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                )
              }}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
            <ChartLegend content={<ChartLegendContent />} height={28} />
            {series.map((item, index) => (
              <Bar
                key={item.key}
                className="stroke-[rgba(255,255,255,0.9)] dark:stroke-[rgba(15,23,42,0.75)]"
                dataKey={item.key}
                fill={`var(--color-${item.key})`}
                radius={
                  index === series.length - 1
                    ? [6, 6, 6, 6]
                    : index === 0
                      ? [6, 6, 6, 6]
                      : [6, 6, 6, 6]
                }
                stackId="workload"
                strokeWidth={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
