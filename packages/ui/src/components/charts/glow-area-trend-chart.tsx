"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Customized, XAxis, YAxis } from "recharts"

import { cn } from "../../lib/utils"
import { Card } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"

export type GlowAreaTrendChartDatum = Record<string, number | string | null | undefined>

export type GlowAreaTrendChartProps<
  TData extends GlowAreaTrendChartDatum = GlowAreaTrendChartDatum,
> = {
  areaKey: keyof TData & string
  areaLabel: string
  className?: string
  data: TData[]
  fillColor?: string
  hideHeader?: boolean
  hideXAxis?: boolean
  hideYAxis?: boolean
  lineColor?: string
  title?: React.ReactNode
  valueFormatter?: (value: number) => string
  xKey: keyof TData & string
  yDomain?: [number, number]
  yTicks?: number[]
  yTickFormatter?: (value: number) => string
}

type AxisTick = {
  coordinate?: number
}

type CustomizedAxisProps = {
  data?: Array<Record<string, number | string | null | undefined>>
  formattedGraphicalItems?: Array<{
    props?: {
      points?: Array<{
        x?: number
        y?: number
      }>
    }
  }>
  offset?: {
    height?: number
    left?: number
    width?: number
    top?: number
  }
  xAxisMap?: Record<string, { ticks?: AxisTick[] }>
}

function getEvenlyDistributedPositions({
  data,
  offset,
  xAxisMap,
}: Pick<CustomizedAxisProps, "data" | "offset" | "xAxisMap">) {
  const axis = xAxisMap ? Object.values(xAxisMap)[0] : undefined
  const ticks = axis?.ticks ?? []
  const dataCount = data?.length ?? 0
  const left = offset?.left ?? 0
  const width = offset?.width ?? 0

  if (ticks.length > 0) {
    const tickPositions = ticks.flatMap((tick) =>
      typeof tick.coordinate === "number" ? [tick.coordinate] : []
    )
    if (tickPositions.length > 0) {
      return tickPositions
    }
  }

  if (dataCount > 0 && width > 0) {
    return Array.from(
      { length: dataCount },
      (_, index) => left + (width / dataCount) * (index + 0.5)
    )
  }

  return []
}

function VerticalMonthGuides({ data, offset, xAxisMap }: CustomizedAxisProps) {
  const top = offset?.top ?? 0
  const height = offset?.height ?? 0
  const positions = getEvenlyDistributedPositions({ data, offset, xAxisMap })

  if (!positions.length || height <= 0) {
    return null
  }

  return (
    <g>
      {positions.map((position, index) => {
        return (
          <line
            key={`month-guide-${index}`}
            stroke="color-mix(in srgb, var(--talimy-color-gray) 16%, white 84%)"
            strokeWidth={1}
            x1={position}
            x2={position}
            y1={top}
            y2={top + height}
          />
        )
      })}
    </g>
  )
}

function AreaAlignedDots({
  data,
  formattedGraphicalItems,
  lineColor = "var(--talimy-color-navy)",
  offset,
  xAxisMap,
}: CustomizedAxisProps & { lineColor?: string }) {
  const points = formattedGraphicalItems?.[0]?.props?.points ?? []
  const positions = getEvenlyDistributedPositions({ data, offset, xAxisMap })

  if (!positions.length || !points.length) {
    return null
  }

  return (
    <g>
      {positions.map((position, index) => {
        const point = points[index]

        if (typeof point?.y !== "number") {
          return null
        }

        return (
          <g key={`aligned-dot-${index}`}>
            <circle cx={position} cy={point.y} fill="white" r={6} />
            <circle
              cx={position}
              cy={point.y}
              fill="color-mix(in srgb, var(--talimy-color-gray) 78%, white 22%)"
              r={5}
            />
            <circle cx={position} cy={point.y} fill={lineColor} r={2.5} />
          </g>
        )
      })}
    </g>
  )
}

export function GlowAreaTrendChart<
  TData extends GlowAreaTrendChartDatum = GlowAreaTrendChartDatum,
>({
  areaKey,
  areaLabel,
  className,
  data,
  fillColor = "var(--talimy-color-pink)",
  hideHeader = false,
  hideXAxis = false,
  hideYAxis = false,
  lineColor = "var(--talimy-color-navy)",
  title,
  valueFormatter = (value) => value.toLocaleString(),
  xKey,
  yDomain = [0, 100000],
  yTicks = [0, 25000, 50000, 75000, 100000],
  yTickFormatter = (value) => `$${Math.round(value / 1000)}K`,
}: GlowAreaTrendChartProps<TData>) {
  const chartId = React.useId().replace(/:/g, "")
  const gradientId = `glow-area-fill-${chartId}`
  const dotGlowId = `glow-area-dot-${chartId}`
  const lineGlowId = `glow-area-line-${chartId}`

  const chartConfig = React.useMemo<ChartConfig>(
    () => ({
      [areaKey]: {
        color: lineColor,
        label: areaLabel,
      },
    }),
    [areaKey, areaLabel, lineColor]
  )

  return (
    <Card
      className={cn("w-full rounded-none border border-red-500 bg-card p-0 shadow-none", className)}
    >
      <div className={cn("space-y-4", hideHeader ? "p-0" : "p-4 sm:p-5")}>
        {!hideHeader ? (
          <header className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] leading-none font-semibold tracking-tight text-talimy-navy dark:text-sky-200">
              {title}
            </h3>
          </header>
        ) : null}

        <ChartContainer className="h-[232px] w-full !aspect-auto" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.6} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
              <filter id={dotGlowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id={lineGlowId} x="-10%" y="-20%" width="120%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <CartesianGrid
              stroke="color-mix(in srgb, var(--talimy-color-gray) 16%, white 84%)"
              vertical={false}
            />
            <YAxis
              axisLine={false}
              domain={yDomain}
              hide={hideYAxis}
              tick={{ fill: "var(--talimy-color-gray)", fontSize: 11 }}
              tickFormatter={yTickFormatter}
              tickLine={false}
              tickMargin={8}
              ticks={yTicks}
              width={hideYAxis ? 0 : 42}
            />
            <XAxis
              axisLine={false}
              dataKey={xKey}
              hide={hideXAxis}
              padding={{ left: 0, right: 0 }}
              tick={{ fill: "var(--talimy-color-gray)", fontSize: 11 }}
              tickLine={false}
              tickMargin={8}
            />
            <Customized component={VerticalMonthGuides} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="min-w-36 gap-2.5 rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs shadow-md"
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-xs"
                          style={{ backgroundColor: lineColor }}
                        />
                        <span className="text-muted-foreground">
                          {chartConfig[String(name)]?.label ?? String(name)}
                        </span>
                      </div>
                      <span className="text-foreground font-semibold tabular-nums">
                        {valueFormatter(Number(value))}
                      </span>
                    </div>
                  )}
                  hideLabel
                  indicator="dot"
                />
              }
            />
            <Area
              activeDot={false}
              dataKey={areaKey}
              dot={false}
              fill={`url(#${gradientId})`}
              filter={`url(#${lineGlowId})`}
              stroke={lineColor}
              strokeWidth={2}
              type="natural"
            />
            <Customized
              component={(props: unknown) => (
                <AreaAlignedDots {...(props as CustomizedAxisProps)} lineColor={lineColor} />
              )}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
