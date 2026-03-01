"use client"

import { Area, AreaChart, CartesianGrid, Customized, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

export type StackedExpandedAreaPoint = {
  label: string
  [key: string]: number | string
}

export type StackedExpandedAreaSeries = {
  color: string
  key: string
  label: string
}

type ChartAreaStackedExpandProps = {
  className?: string
  data?: StackedExpandedAreaPoint[]
  hideXAxis?: boolean
  series?: StackedExpandedAreaSeries[]
}

const chartData: StackedExpandedAreaPoint[] = [
  { label: "January", extraDuties: 45, teachingHours: 80, totalClasses: 186 },
  { label: "February", extraDuties: 100, teachingHours: 200, totalClasses: 305 },
  { label: "March", extraDuties: 150, teachingHours: 120, totalClasses: 237 },
  { label: "April", extraDuties: 50, teachingHours: 190, totalClasses: 73 },
  { label: "May", extraDuties: 100, teachingHours: 130, totalClasses: 209 },
  { label: "June", extraDuties: 160, teachingHours: 140, totalClasses: 214 },
]

const defaultSeries: StackedExpandedAreaSeries[] = [
  { color: "var(--talimy-color-pink)", key: "totalClasses", label: "Total Classes" },
  { color: "var(--talimy-color-sky)", key: "teachingHours", label: "Teaching Hours" },
  { color: "var(--talimy-color-navy)", key: "extraDuties", label: "Extra Duties" },
]

type VerticalSegmentGuidesProps = {
  height?: number
  points?: Array<{ x?: number }>
}

function VerticalSegmentGuides({ height = 0, points = [] }: VerticalSegmentGuidesProps) {
  const positions = points
    .map((point) => point.x)
    .filter((value): value is number => typeof value === "number")

  if (positions.length === 0) {
    return null
  }

  const stroke = "color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)"

  return (
    <g>
      {positions.map((x) => (
        <line key={`segment-guide-${x}`} x1={x} x2={x} y1={0} y2={height} stroke={stroke} strokeWidth={1} />
      ))}
    </g>
  )
}

export function ChartAreaStackedExpand({
  className,
  data = chartData,
  hideXAxis = false,
  series = defaultSeries,
}: ChartAreaStackedExpandProps) {
  const chartConfig = Object.fromEntries(
    series.map((item) => [
      item.key,
      {
        color: item.color,
        label: item.label,
      },
    ])
  ) satisfies ChartConfig

  return (
  <div className={className ?? "flex h-full w-full max-w-xl items-end"}>
    <ChartContainer className="h-[170px] w-full !aspect-auto" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid stroke="color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)" vertical={false} />
        {!hideXAxis ? (
          <XAxis
            axisLine={false}
            dataKey="label"
            tickFormatter={value => String(value).slice(0, 3)}
            tickLine={false}
            tickMargin={8}
          />
        ) : null}
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
        {series.map((item) => (
          <Area
            key={item.key}
            dataKey={item.key}
            fill={`var(--color-${item.key})`}
            fillOpacity={1}
            stackId="a"
            stroke={`var(--color-${item.key})`}
            type="linear"
          />
        ))}
        <Customized
          component={(props: unknown) => {
            const dataProps = props as {
              formattedGraphicalItems?: Array<{
                props?: {
                  points?: Array<{ x?: number }>
                }
              }>
              height?: number
            }

            return (
              <VerticalSegmentGuides
                height={dataProps.height}
                points={dataProps.formattedGraphicalItems?.[0]?.props?.points}
              />
            )
          }}
        />
      </AreaChart>
    </ChartContainer>
  </div>
  )
}

export default ChartAreaStackedExpand
