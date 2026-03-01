"use client"

import * as React from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, MiniChart } from "@talimy/ui"
import { Area, AreaChart, XAxis } from "recharts"

type FeesPeriod = "first6Months" | "second6Months"

const FIRST_SIX_MONTHS = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const SECOND_SIX_MONTHS = [
  { month: "January", desktop: 164 },
  { month: "February", desktop: 284 },
  { month: "March", desktop: 221 },
  { month: "April", desktop: 118 },
  { month: "May", desktop: 245 },
  { month: "June", desktop: 268 },
]

const chartConfig = {
  desktop: {
    color: "var(--talimy-color-navy)",
    label: "Fees Collected",
  },
} as const

function FeesDot(props: { cx?: number; cy?: number; payload?: { month?: string } }) {
  if (props.payload?.month?.startsWith("edge-")) return null
  if (typeof props.cx !== "number" || typeof props.cy !== "number") return null

  return (
    <g>
      <circle cx={props.cx} cy={props.cy} fill="white" r={6} />
      <circle cx={props.cx} cy={props.cy} fill="var(--talimy-color-navy)" r={3.5} />
    </g>
  )
}

export function FeesCollectionTrendChartShowcase433() {
  const [period, setPeriod] = React.useState<FeesPeriod>("first6Months")
  const data = period === "first6Months" ? FIRST_SIX_MONTHS : SECOND_SIX_MONTHS
  const chartData = [
    { desktop: data[0]?.desktop ?? 0, month: "edge-start", position: 0 },
    ...data.map((item, index) => ({ ...item, position: index + 0.5 })),
    { desktop: data[data.length - 1]?.desktop ?? 0, month: "edge-end", position: data.length },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/finance</h3>

      <div className="max-w-sm">
        <MiniChart
          bottomLabels={{
            distribution: "evenly",
            values: data.map((item) => item.month.slice(0, 3)),
          }}
          chartClassName="min-h-[188px]"
          filter={{
            ariaLabel: "Fees trend period",
            onValueChange: (value) => setPeriod(value as FeesPeriod),
            options: [
              { label: "First 6 Months", value: "first6Months" },
              { label: "Second 6 Months", value: "second6Months" },
            ],
            value: period,
          }}
          title="Fees Collection Trend"
          yScale={{
            values: ["$100K", "$75K", "$50K", "$25K", "$0K"],
          }}
        >
          <div className="relative h-[184px] w-full">
            <div className="pointer-events-none absolute inset-0 grid grid-rows-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`row-${index}`} className="flex items-center">
                  <div
                    className="h-px w-full"
                    style={{ backgroundColor: "color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)" }}
                  />
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 grid grid-cols-6">
              {data.map((item) => (
                <div key={item.month} className="flex justify-center">
                  <div
                    className="h-full w-px"
                    style={{ backgroundColor: "color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)" }}
                  />
                </div>
              ))}
            </div>

            <ChartContainer className="relative z-10 h-[184px] w-full" config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="position" domain={[0, data.length]} hide type="number" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <defs>
                  <linearGradient id="fees-area-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--talimy-color-pink)" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="var(--talimy-color-pink)" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <Area
                  activeDot={(props) => {
                    const { key, ...dotProps } = props
                    return <FeesDot key={String(key ?? "active-dot")} {...dotProps} />
                  }}
                  dataKey="desktop"
                  dot={(props) => {
                    const { key, ...dotProps } = props
                    return <FeesDot key={String(key ?? `dot-${dotProps.payload?.month ?? "unknown"}`)} {...dotProps} />
                  }}
                  fill="url(#fees-area-fill)"
                  fillOpacity={0.45}
                  isAnimationActive
                  stroke="var(--talimy-color-navy)"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </MiniChart>
      </div>
    </div>
  )
}
