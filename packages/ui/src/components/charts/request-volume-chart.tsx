"use client"

import type { CSSProperties, ReactNode } from "react"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"

export type RequestVolumePoint = {
  api: number
  month: string
  webhook: number
}

export type RequestVolumeChartProps = {
  apiLabel?: string
  className?: string
  data: RequestVolumePoint[]
  description?: ReactNode
  title: ReactNode
  webhookLabel?: string
}

function CrosshatchPattern({ config }: { config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, value]) => value.color)

  return (
    <>
      {entries.map(([key, value]) => (
        <pattern
          key={key}
          id={`request-volume-crosshatch-${key}`}
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0,8 L8,0" opacity="0.4" stroke={value.color} strokeWidth="0.8" />
          <path d="M0,0 L8,8" opacity="0.2" stroke={value.color} strokeWidth="0.8" />
        </pattern>
      ))}
    </>
  )
}

export function RequestVolumeChart({
  apiLabel = "API Calls",
  className,
  data,
  description = "API and webhook traffic over 12 months",
  title,
  webhookLabel = "Webhooks",
}: RequestVolumeChartProps) {
  const chartConfig = {
    api: { color: "var(--talimy-color-navy)", label: apiLabel },
    webhook: { color: "var(--talimy-color-pink)", label: webhookLabel },
  } satisfies ChartConfig

  return (
    <Card className={cn("rounded-[28px] border-0 bg-card shadow-none", className)}>
      <CardHeader className="space-y-2 px-6 pt-6 pb-0">
        <CardTitle className="text-[2rem] leading-none font-semibold tracking-tight text-[var(--talimy-color-navy)] dark:text-sky-200">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="px-4 pt-4 pb-5 sm:px-6">
        <ChartContainer className="h-[260px] w-full sm:h-[280px]" config={chartConfig}>
          <AreaChart accessibilityLayer data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value: string) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-40 gap-2.5"
                  indicator="dot"
                  labelFormatter={(value) => (
                    <div className="border-border/50 mb-0.5 border-b pb-2">
                      <span className="text-xs font-medium">{value} 2024</span>
                    </div>
                  )}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-xs bg-(--color-bg)"
                          style={{ "--color-bg": `var(--color-${String(name)})` } as CSSProperties}
                        />
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]?.label || String(name)}
                        </span>
                      </div>
                      <span className="text-foreground font-semibold tabular-nums">
                        {Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <defs>
              <CrosshatchPattern config={chartConfig} />
            </defs>
            <Area
              dataKey="webhook"
              fill="url(#request-volume-crosshatch-webhook)"
              fillOpacity={0.5}
              stackId="a"
              stroke="var(--color-webhook)"
              strokeWidth={1}
              type="natural"
            />
            <Area
              dataKey="api"
              fill="url(#request-volume-crosshatch-api)"
              fillOpacity={0.5}
              stackId="a"
              stroke="var(--color-api)"
              strokeWidth={1}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
