"use client"

import * as React from "react"
import { ChartContainer, MiniChart } from "@talimy/ui"
import { Area, AreaChart, XAxis } from "recharts"
import type { ActiveDotProps, DotItemDotProps } from "recharts"

export type AreaTrendChartPoint = {
  annotation?: string
  label: string
  shortLabel: string
  value: number
}

export type AreaTrendChartOption<TPeriod extends string> = {
  label: string
  value: TPeriod
}

type AreaTrendChartCardProps<TPeriod extends string> = {
  className?: string
  dataByPeriod: Record<TPeriod, readonly AreaTrendChartPoint[]>
  fillColor?: string
  filterAriaLabel: string
  filterOptions: readonly [AreaTrendChartOption<TPeriod>, ...AreaTrendChartOption<TPeriod>[]]
  lineColor?: string
  onPeriodChange?: (value: TPeriod) => void
  period?: TPeriod
  title: string
  valueFormatter?: (value: number) => string
  yScaleValues: readonly string[]
}

type AreaTrendDotProps = {
  cx?: number
  cy?: number
  lineColor: string
  payload?: {
    annotation?: string
    label?: string
  }
}

type AreaTrendChartDatum = {
  annotation?: string
  label: string
  position: number
  value: number
}

const CHART_CONFIG = {
  value: {
    color: "var(--talimy-color-navy)",
    label: "Trend",
  },
} as const

function isAreaTrendPeriod<TPeriod extends string>(
  value: string,
  options: readonly AreaTrendChartOption<TPeriod>[]
): value is TPeriod {
  return options.some((option) => option.value === value)
}

function AreaTrendDot({ cx, cy, lineColor, payload }: AreaTrendDotProps) {
  if (payload?.label?.startsWith("edge-")) {
    return null
  }

  if (typeof cx !== "number" || typeof cy !== "number") {
    return null
  }

  return (
    <g>
      <circle cx={cx} cy={cy} fill="white" r={6} />
      <circle
        cx={cx}
        cy={cy}
        fill="color-mix(in srgb, var(--talimy-color-gray) 78%, white 22%)"
        r={5}
      />
      <circle cx={cx} cy={cy} fill={lineColor} r={2.5} />
    </g>
  )
}

function mapTrendPayload(payload: DotItemDotProps["payload"] | ActiveDotProps["payload"]) {
  if (typeof payload?.label !== "string") {
    return undefined
  }

  return {
    annotation: typeof payload.annotation === "string" ? payload.annotation : undefined,
    label: payload.label,
  }
}

export function AreaTrendChartCard<TPeriod extends string>({
  className,
  dataByPeriod,
  fillColor = "var(--talimy-color-pink)",
  filterAriaLabel,
  filterOptions,
  lineColor = "var(--talimy-color-navy)",
  onPeriodChange,
  period,
  title,
  valueFormatter = (value) => value.toLocaleString(),
  yScaleValues,
}: AreaTrendChartCardProps<TPeriod>) {
  const chartId = React.useId().replace(/:/g, "")
  const gradientId = `area-trend-fill-${chartId}`
  const defaultPeriod = filterOptions[0].value
  const [internalPeriod, setInternalPeriod] = React.useState<TPeriod>(defaultPeriod)
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null)
  const activePeriod = period ?? internalPeriod
  const activeData = dataByPeriod[activePeriod] ?? dataByPeriod[defaultPeriod]

  const chartData = React.useMemo<AreaTrendChartDatum[]>(
    () => [
      {
        label: "edge-start",
        position: 0,
        value: activeData[0]?.value ?? 0,
      },
      ...activeData.map((item, index) => ({
        annotation: item.annotation,
        label: item.label,
        position: index + 0.5,
        value: item.value,
      })),
      {
        label: "edge-end",
        position: activeData.length,
        value: activeData[activeData.length - 1]?.value ?? 0,
      },
    ],
    [activeData]
  )

  const hoveredPointIndex = React.useMemo(
    () => activeData.findIndex((item) => item.label === hoveredLabel),
    [activeData, hoveredLabel]
  )
  const hoveredPoint = hoveredPointIndex >= 0 ? (activeData[hoveredPointIndex] ?? null) : null
  const chartMaxValue = React.useMemo(
    () => Math.max(...activeData.map((item) => item.value)),
    [activeData]
  )
  const chartMinValue = React.useMemo(
    () => Math.min(...activeData.map((item) => item.value)),
    [activeData]
  )
  const chartValueRange = Math.max(chartMaxValue - chartMinValue, 1)
  const hoveredPointTop =
    hoveredPoint === null
      ? null
      : 18 + ((chartMaxValue - hoveredPoint.value) / chartValueRange) * 112
  const hoveredPointLeft =
    hoveredPointIndex < 0 ? null : `${((hoveredPointIndex + 0.5) / activeData.length) * 100}%`

  return (
    <MiniChart
      bottomLabels={{
        distribution: "evenly",
        values: activeData.map((item) => item.shortLabel),
      }}
      chartClassName="min-h-[188px]"
      className={className}
      filter={{
        ariaLabel: filterAriaLabel,
        onValueChange: (value) => {
          if (!isAreaTrendPeriod(value, filterOptions)) {
            return
          }

          if (onPeriodChange) {
            onPeriodChange(value)
            return
          }

          setInternalPeriod(value)
        },
        options: [...filterOptions],
        value: activePeriod,
      }}
      title={title}
      yScale={{
        values: [...yScaleValues],
      }}
    >
      <div className="relative h-[184px] w-full">
        <div className="pointer-events-none absolute inset-0 grid grid-rows-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`row-${index}`} className="flex items-center">
              <div
                className="h-px w-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)",
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${activeData.length}, minmax(0, 1fr))` }}
        >
          {activeData.map((item) => (
            <div key={item.label} className="flex justify-center">
              <div
                className="h-full w-px"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--talimy-color-gray) 18%, white 82%)",
                }}
              />
            </div>
          ))}
        </div>

        <ChartContainer className="relative z-10 h-[184px] w-full" config={CHART_CONFIG}>
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
            <XAxis dataKey="position" domain={[0, activeData.length]} hide type="number" />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.7} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <Area
              activeDot={(props: ActiveDotProps) => (
                <AreaTrendDot
                  cx={props.cx}
                  cy={props.cy}
                  lineColor={lineColor}
                  payload={mapTrendPayload(props.payload)}
                />
              )}
              dataKey="value"
              dot={(props: DotItemDotProps) => (
                <AreaTrendDot
                  cx={props.cx}
                  cy={props.cy}
                  lineColor={lineColor}
                  payload={mapTrendPayload(props.payload)}
                />
              )}
              fill={`url(#${gradientId})`}
              fillOpacity={0.45}
              isAnimationActive
              stroke={lineColor}
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
        {hoveredPoint !== null && hoveredPointLeft !== null && hoveredPointTop !== null ? (
          <div
            className="pointer-events-none absolute z-30 -translate-x-1/2 text-[11px] font-semibold text-talimy-navy"
            style={{
              left: hoveredPointLeft,
              top: `${hoveredPointTop - 18}px`,
            }}
          >
            {valueFormatter(hoveredPoint.value)}
          </div>
        ) : null}
        <div
          className="absolute inset-0 z-20 grid"
          style={{ gridTemplateColumns: `repeat(${activeData.length}, minmax(0, 1fr))` }}
        >
          {activeData.map((item) => (
            <button
              aria-label={`${item.label} ${valueFormatter(item.value)}`}
              className="h-full w-full appearance-none border-0 bg-transparent p-0 outline-none"
              key={`hover-zone-${item.label}`}
              onBlur={() => setHoveredLabel(null)}
              onFocus={() => setHoveredLabel(item.label)}
              onMouseEnter={() => setHoveredLabel(item.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              type="button"
            />
          ))}
        </div>
      </div>
    </MiniChart>
  )
}
