"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@talimy/ui"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import { cn } from "@/lib/utils"

export type RadarMetricsChartDatum = {
  label: string
  value: number
}

type RadarMetricsChartCardProps = {
  className?: string
  data: readonly RadarMetricsChartDatum[]
  metricLabel: string
  title: string
}

export function RadarMetricsChartCard({
  className,
  data,
  metricLabel,
  title,
}: RadarMetricsChartCardProps) {
  const chartConfig = {
    value: { color: "var(--talimy-color-navy)", label: metricLabel },
  } satisfies ChartConfig

  return (
    <Card
      className={cn(
        "rounded-[28px] border border-slate-100 bg-white shadow-none w-fit h-fit pb-0",
        className
      )}
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-[18px] font-semibold text-talimy-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0 w-fit h-fit">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[320px]">
          <RadarChart accessibilityLayer data={[...data]}>
            <defs>
              <linearGradient id="student-radar-fill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--talimy-color-sky)" stopOpacity={0.36} />
                <stop offset="100%" stopColor="var(--talimy-color-pink)" stopOpacity={0.16} />
              </linearGradient>
              <filter id="student-radar-glow" x="-18%" y="-18%" width="136%" height="136%">
                <feGaussianBlur result="blur" stdDeviation="4" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "#37526e", fontSize: 11, fontWeight: 500 }}
            />
            <PolarGrid stroke="#d8e3ee" strokeDasharray="3 3" />
            <PolarRadiusAxis angle={90} axisLine={false} domain={[0, 100]} tick={false} />
            <Radar
              dataKey="value"
              dot={{
                fill: "white",
                r: 4,
                stroke: "var(--talimy-color-navy)",
                strokeWidth: 2,
              }}
              fill="url(#student-radar-fill)"
              filter="url(#student-radar-glow)"
              stroke="var(--talimy-color-navy)"
              strokeWidth={2.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
