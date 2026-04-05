"use client"

import * as React from "react"
import { Customized, Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"

export type StackedRadialChartSegment = {
  color: string
  key: string
  label: string
  value: number
}

export type ChartRadialStackedProps = {
  centerLabelClassName?: string
  centerLabel?: React.ReactNode
  centerValueClassName?: string
  centerValue: React.ReactNode
  className?: string
  containerClassName?: string
  cx?: number | string
  cy?: number | string
  description?: React.ReactNode
  endAngle?: number
  guideRadius?: number
  chartClassName?: string
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
  radius: number
}

function SemiGuideArc({ cx = 0, cy = 0, radius }: SemiGuideProps) {
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
  centerLabelClassName,
  centerLabel = "Average Score",
  centerValueClassName,
  centerValue,
  className,
  containerClassName,
  cx = "50%",
  cy = "50%",
  description: chartDescription,
  endAngle = 180,
  guideRadius,
  chartClassName,
  hideHeader = false,
  innerRadius = 72,
  outerRadius = 116,
  segments,
  title,
}: ChartRadialStackedProps) {
  const resolvedGuideRadius =
    guideRadius ?? Math.max(Math.round((innerRadius + outerRadius) / 2) - 12, 0)
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
      Object.fromEntries(segments.map((segment) => [segment.key, segment.value])) as Record<
        string,
        number
      >,
    ],
    [segments]
  )

  return (
    <Card
      className={cn(
        "rounded-3xl border-0 bg-transparent p-0 shadow-none flex flex-col items-center justify-center",
        className
      )}
    >
      {!hideHeader ? (
        <CardHeader className="items-center pb-0">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {chartDescription ? <CardDescription>{chartDescription}</CardDescription> : null}
        </CardHeader>
      ) : null}

      <CardContent className="flex items-center justify-center p-0">
        <ChartContainer
          config={chartConfig}
          className={cn("h-[100px] w-full max-w-[280px]", containerClassName)}
        >
          <RadialBarChart
            className={cn("h-[180px]!", chartClassName)}
            cx={cx}
            cy={cy}
            data={chartData}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null
                  }

                  const numCx = Number(viewBox.cx) || 0
                  const numCy = Number(viewBox.cy) || 0

                  return (
                    <g>
                      <SemiGuideArc cx={numCx} cy={numCy} radius={resolvedGuideRadius} />
                      <text x={numCx} y={numCy} textAnchor="middle">
                        <tspan
                          x={numCx}
                          y={numCy - 6}
                          className={cn(
                            "fill-[var(--talimy-color-navy)] text-[24px] font-bold dark:fill-sky-200",
                            centerValueClassName
                          )}
                        >
                          {centerValue}
                        </tspan>
                        <tspan
                          x={numCx}
                          y={numCy + 18}
                          className={cn("fill-muted-foreground text-[11px]", centerLabelClassName)}
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    </g>
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
