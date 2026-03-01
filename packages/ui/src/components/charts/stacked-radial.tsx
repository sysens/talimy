"use client"

import * as React from "react"
import { Customized, Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

export type StackedRadialChartSegment = {
  color: string
  key: string
  label: string
  value: number
}

export type ChartRadialStackedProps = {
  centerLabel?: React.ReactNode
  centerValue: React.ReactNode
  className?: string
  description?: React.ReactNode
  endAngle?: number
  hideHeader?: boolean
  innerRadius?: number
  outerRadius?: number
  segments: StackedRadialChartSegment[]
  title?: React.ReactNode
}

export const stackedRadialDescription = "A radial chart with stacked sections"

type SemiGuideProps = {
  cx?: number
  cy?: number
}

function SemiGuideArc({ cx = 0, cy = 0 }: SemiGuideProps) {
  const radius = 78
  const startX = cx - radius
  const endX = cx + radius

  return (
    <path
      d={`M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`}
      fill="none"
      stroke="color-mix(in srgb, var(--talimy-color-gray) 28%, white 72%)"
      strokeDasharray="5 6"
      strokeLinecap="round"
      strokeWidth="2"
    />
  )
}

export function ChartRadialStacked({
  centerLabel = "Average Score",
  centerValue,
  className,
  description: chartDescription,
  endAngle = 180,
  hideHeader = false,
  innerRadius = 72,
  outerRadius = 116,
  segments,
  title,
}: ChartRadialStackedProps) {
  const chartConfig = React.useMemo(
    () =>
      Object.fromEntries(
        segments.map((segment) => [
          segment.key,
          {
            color: segment.color,
            label: segment.label,
          },
        ])
      ) satisfies ChartConfig,
    [segments]
  )

  const chartData = React.useMemo(
    () => [
      Object.fromEntries(
        segments.map((segment) => [segment.key, segment.value])
      ) as Record<string, number>,
    ],
    [segments]
  )

  return (
    <Card className={cn("rounded-3xl border-0 bg-transparent p-0 shadow-none", className)}>
      {!hideHeader ? (
        <CardHeader className="items-center pb-0">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {chartDescription ? <CardDescription>{chartDescription}</CardDescription> : null}
        </CardHeader>
      ) : null}

      <CardContent className="flex items-center justify-center p-0">
        <ChartContainer config={chartConfig} className=" h-[100px] w-full max-w-[280px]">
          <RadialBarChart className="h-[180px]!" data={chartData} endAngle={endAngle} innerRadius={innerRadius} outerRadius={outerRadius}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Customized 
              component={(props: unknown) => {
                const viewBox = props as { cx?: number; cy?: number }
                return <SemiGuideArc cx={viewBox.cx} cy={viewBox.cy} />
              }}
            />
            <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null
                  }

                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 6}
                        className="fill-[var(--talimy-color-navy)] text-[24px] font-bold dark:fill-sky-200"
                      >
                        {centerValue}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 18}
                        className="fill-muted-foreground text-[11px]"
                      >
                        {centerLabel}
                      </tspan>
                    </text>
                  )
                }}
              />
            </PolarRadiusAxis>

            {segments.map((segment) => (
              <RadialBar
                key={segment.key}
                className="stroke-transparent stroke-2"
                cornerRadius={10}
                dataKey={segment.key}
                fill={`var(--color-${segment.key})`}
                stackId="stack"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
