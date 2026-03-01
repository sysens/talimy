"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, CartesianGrid, ComposedChart, Line, Rectangle, XAxis, YAxis } from "recharts"

import { cn } from "../../lib/utils"
import { ChartRadialStacked, type StackedRadialChartSegment } from "./stacked-radial"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

export type BarChartPoint = {
  absentBreakdown?: Array<{
    label: string
    value: number
  }>
  label: string
  trendValue?: number
  value: number
}

export type BarChartDefaultProps = {
  chartType?: "bar" | "line"
  className?: string
  data?: BarChartPoint[]
  description?: React.ReactNode
  dualConfig?: {
    note?: React.ReactNode
    radialCenterLabel?: React.ReactNode
    radialCenterValue: React.ReactNode
    radialSegments: StackedRadialChartSegment[]
  }
  footerNote?: React.ReactNode
  footerTrend?: React.ReactNode
  hideFooter?: boolean
  hideHeader?: boolean
  hideXAxis?: boolean
  insideLabelFormatter?: (value: number, point: BarChartPoint, index: number) => React.ReactNode
  lineOffsetPx?: number
  totalStudents?: number
  title?: React.ReactNode
  valueDomain?: [number, number]
  variant?: "default" | "dual"
}

export const description = "A bar chart"

const DEFAULT_DATA: BarChartPoint[] = [
  { label: "Dush", value: 1144 },
  { label: "Sesh", value: 1043 },
  { label: "Pay", value: 933 },
  { label: "Juma", value: 1089 },
  { label: "Shan", value: 1089 },
  { label: "Yak", value: 1026 },
]

type AnimatedBarShapeProps = {
  fill?: string
  height?: number
  index?: number
  radius?: number | [number, number, number, number]
  width?: number
  x?: number
  y?: number
}

type ActiveLineDotProps = {
  cx?: number
  cy?: number
  payload?: {
    present?: number
  }
}

type InternalChartDataPoint = {
  absentBreakdown: NonNullable<BarChartPoint["absentBreakdown"]>
  label: string
  point: BarChartPoint
  present: number
  trend: number
}

function AnimatedBarShape({
  fill,
  height = 0,
  radius = 8,
  width = 0,
  x = 0,
  y = 0,
}: AnimatedBarShapeProps) {
  return (
    <Rectangle
      fill={fill}
      height={height}
      radius={radius}
      style={{
        transition:
          "fill 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      width={width}
      x={x}
      y={y}
    />
  )
}

function getBarFill(chartType: "bar" | "line", hoveredIndex: number | null, index?: number) {
  if (chartType === "line") {
    if (hoveredIndex === null) {
      return "var(--talimy-color-pink)"
    }

    return hoveredIndex === index
      ? "var(--talimy-color-pink)"
      : "color-mix(in srgb, var(--talimy-color-pink) 52%, white 48%)"
  }

  return hoveredIndex === index ? "var(--talimy-color-navy)" : "var(--talimy-color-pink)"
}

function ActiveLineDot({ cx = 0, cy = 0, payload }: ActiveLineDotProps) {
  const value = payload?.present

  if (value === undefined) {
    return <text />
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        fill="var(--talimy-color-navy)"
        r={5}
        stroke="var(--talimy-color-pink)"
        strokeWidth={2}
      />
      <rect
        fill="var(--talimy-color-navy)"
        height={23}
        rx={6}
        ry={6}
        width={27}
        x={cx - 13.5}
        y={cy - 33}
      />
      <text
        dominantBaseline="middle"
        fill="white"
        fontSize="10"
        fontWeight="700"
        textAnchor="middle"
        x={cx}
        y={cy - 20}
      >
        {value}
      </text>
    </g>
  )
}

function createChartConfig() {
  return {
    present: {
      color: "var(--talimy-color-pink)",
      label: "Present Students",
    },
    trend: {
      color: "var(--talimy-color-navy)",
      label: "Attendance Trend",
    },
  } satisfies ChartConfig
}

type ChartBarBodyProps = {
  chartData: InternalChartDataPoint[]
  chartType: "bar" | "line"
  hideXAxis: boolean
  hoveredIndex: number | null
  insideLabelFormatter?: (value: number, point: BarChartPoint, index: number) => React.ReactNode
  onMouseLeave: () => void
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>
  totalStudents: number
  valueDomain: [number, number]
}

function ChartBarBody({
  chartData,
  chartType,
  hideXAxis,
  hoveredIndex,
  insideLabelFormatter,
  onMouseLeave,
  setHoveredIndex,
  totalStudents,
  valueDomain,
}: ChartBarBodyProps) {
  return (
    <ChartContainer className="h-[180px] w-full !aspect-auto" config={createChartConfig()}>
      <ComposedChart
        accessibilityLayer
        data={chartData}
        margin={{ bottom: 0, left: 0, right: 0, top: chartType === "line" ? 18 : 0 }}
        onMouseLeave={onMouseLeave}
      >
        <CartesianGrid vertical={false} />
        <YAxis domain={valueDomain} hide yAxisId="bars" />
        {!hideXAxis ? (
          <XAxis
            axisLine={false}
            dataKey="label"
            tickFormatter={(value) => value.slice(0, 3)}
            tickLine={false}
            tickMargin={10}
          />
        ) : null}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, _name, _item, _index, payload) => {
                const payloadData = payload as unknown as BarChartPoint & {
                  absentBreakdown?: NonNullable<BarChartPoint["absentBreakdown"]>
                }
                const breakdown = Array.isArray(payloadData.absentBreakdown)
                  ? payloadData.absentBreakdown
                  : []

                if (breakdown.length > 0) {
                  return (
                    <div className="grid min-w-36 gap-2">
                      {breakdown.map((group: { label: string; value: number }) => (
                        <div key={group.label} className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">{group.label}</span>
                          <span className="text-foreground font-mono font-medium tabular-nums">
                            {group.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }

                return (
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="text-muted-foreground">Absent Students</span>
                    <span className="text-foreground font-mono font-medium tabular-nums">
                      {Math.max(totalStudents - Number(value), 0).toLocaleString()}
                    </span>
                  </div>
                )
              }}
              hideIndicator
              hideLabel
            />
          }
        />
        <Bar
          background={
            chartType === "bar"
              ? {
                  fill: "color-mix(in srgb, var(--talimy-color-gray) 14%, white 86%)",
                  radius: 8,
                }
              : undefined
          }
          cursor="pointer"
          dataKey="present"
          fill="var(--color-present)"
          label={
            insideLabelFormatter
              ? (props: unknown) => {
                  const { index = 0, value = 0, width = 0, x = 0, y = 0 } = props as {
                    index?: number
                    value?: number
                    width?: number
                    x?: number
                    y?: number
                  }
                  const point = chartData[index]?.point
                  if (!point) {
                    return <text />
                  }
                  return (
                    <text
                      dominantBaseline="hanging"
                      fill={
                        hoveredIndex === index
                          ? "var(--talimy-color-sky)"
                          : "var(--talimy-color-navy)"
                      }
                      fontSize="14"
                      fontWeight="600"
                      textAnchor="middle"
                      x={x + width / 2}
                      y={y + 10}
                    >
                      {insideLabelFormatter(Number(value), point, index)}
                    </text>
                  )
                }
              : undefined
          }
          onMouseMove={(_, index) => setHoveredIndex(index)}
          radius={8}
          yAxisId="bars"
          shape={(props: unknown) => {
            const shapeProps = props as AnimatedBarShapeProps

            return (
              <AnimatedBarShape
                {...shapeProps}
                fill={getBarFill(chartType, hoveredIndex, shapeProps.index)}
              />
            )
          }}
        />
        {chartType === "line" ? (
          <Line
            activeDot={(props: unknown) => <ActiveLineDot {...(props as ActiveLineDotProps)} />}
            dataKey="trend"
            dot={{
              fill: "var(--talimy-color-navy)",
              r: 4,
              stroke: "var(--talimy-color-navy)",
              strokeWidth: 0,
            }}
            isAnimationActive
            stroke="var(--talimy-color-navy)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            type="monotone"
            yAxisId="bars"
          />
        ) : null}
      </ComposedChart>
    </ChartContainer>
  )
}

export function ChartBarDefault({
  chartType = "bar",
  className,
  data = DEFAULT_DATA,
  description: chartDescription = "This week · Mon-Sat present students",
  dualConfig,
  footerNote = "Showing present student count for the current week",
  footerTrend = "Thursday remained the strongest attendance day",
  hideFooter = false,
  hideHeader = false,
  hideXAxis = false,
  insideLabelFormatter,
  lineOffsetPx = 5,
  totalStudents = 1245,
  title = "Student Attendance",
  valueDomain = [0, 1300],
  variant = "default",
}: BarChartDefaultProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const offsetValue =
    chartType === "line"
      ? ((valueDomain[1] - valueDomain[0]) / 180) * lineOffsetPx
      : 0

  const chartData = data.map((item) => ({
    absentBreakdown: item.absentBreakdown ?? [],
    label: item.label,
    point: item,
    present: item.value,
    trend: (item.trendValue ?? item.value) + offsetValue,
  }))

  return (
    <Card className={cn("rounded-3xl border-0 bg-transparent p-0 shadow-none ring-0", className)}>
      {!hideHeader ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{chartDescription}</CardDescription>
        </CardHeader>
      ) : null}

      <CardContent className="p-0">
        {variant === "dual" && dualConfig ? (
          <div className="grid gap-4  lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
            <div className="order-1 space-y-3">
              <ChartRadialStacked
                centerLabel={dualConfig.radialCenterLabel}
                centerValue={dualConfig.radialCenterValue}
                hideHeader
                segments={dualConfig.radialSegments}
              />
              {dualConfig.note ? (
                <div className="rounded-2xl bg-[color-mix(in_srgb,var(--talimy-color-gray)_10%,white_90%)] p-2 text-sm leading-6 text-muted-foreground">
                  {dualConfig.note}
                </div>
              ) : null}
            </div>

            <div className="order-2">
              <ChartBarBody
                chartData={chartData}
                chartType={chartType}
                hideXAxis={hideXAxis}
                hoveredIndex={hoveredIndex}
                insideLabelFormatter={insideLabelFormatter}
                onMouseLeave={() => setHoveredIndex(null)}
                setHoveredIndex={setHoveredIndex}
                totalStudents={totalStudents}
                valueDomain={valueDomain}
              />
            </div>
          </div>
        ) : (
          <ChartBarBody
            chartData={chartData}
            chartType={chartType}
            hideXAxis={hideXAxis}
            hoveredIndex={hoveredIndex}
            insideLabelFormatter={insideLabelFormatter}
            onMouseLeave={() => setHoveredIndex(null)}
            setHoveredIndex={setHoveredIndex}
            totalStudents={totalStudents}
            valueDomain={valueDomain}
          />
        )}
      </CardContent>

      {!hideFooter ? (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {footerTrend} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">{footerNote}</div>
        </CardFooter>
      ) : null}
    </Card>
  )
}
