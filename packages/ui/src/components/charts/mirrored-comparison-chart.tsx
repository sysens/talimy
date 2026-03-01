"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type MirroredComparisonChartDatum = Record<string, number | string>

export type MirroredComparisonChartProps<TData extends MirroredComparisonChartDatum = MirroredComparisonChartDatum> = {
  className?: string
  data: TData[]
  formatMonthLabel?: (label: string, index: number) => string
  formatTooltipLabel?: (label: string, index: number) => string
  formatValue?: (value: number, key: string) => string
  height?: number
  labelKey: keyof TData & string
  maxValue?: number
  negativeColor?: string
  negativeKey: keyof TData & string
  negativeLabel: React.ReactNode
  positiveColor?: string
  positiveKey: keyof TData & string
  positiveLabel: React.ReactNode
}

const DEFAULT_HEIGHT = 320
const DEFAULT_WIDTH = 720

export function MirroredComparisonChart<TData extends MirroredComparisonChartDatum = MirroredComparisonChartDatum>({
  className,
  data,
  formatMonthLabel,
  formatTooltipLabel = (label) => `${label} 2034`,
  formatValue = (value) => `$${value.toLocaleString()}`,
  height = DEFAULT_HEIGHT,
  labelKey,
  maxValue,
  negativeColor = "var(--talimy-color-pink)",
  negativeKey,
  negativeLabel,
  positiveColor = "var(--talimy-color-navy)",
  positiveKey,
  positiveLabel,
}: MirroredComparisonChartProps<TData>) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [displayIndex, setDisplayIndex] = React.useState<number | null>(null)
  const [tooltipVisible, setTooltipVisible] = React.useState(false)

  React.useEffect(() => {
    if (hoveredIndex === null) {
      setTooltipVisible(false)
      const timeout = window.setTimeout(() => setDisplayIndex(null), 160)
      return () => window.clearTimeout(timeout)
    }

    setDisplayIndex(hoveredIndex)
    const timeout = window.setTimeout(() => setTooltipVisible(true), 24)
    return () => window.clearTimeout(timeout)
  }, [hoveredIndex])

  const computedMaxValue = React.useMemo(() => {
    const seriesMax = data.reduce((max, item) => {
      const positiveValue = Number(item[positiveKey] ?? 0)
      const negativeValue = Number(item[negativeKey] ?? 0)
      return Math.max(max, positiveValue, negativeValue)
    }, 0)

    return maxValue ?? Math.max(Math.ceil(seriesMax / 1000) * 1000, 1000)
  }, [data, maxValue, negativeKey, positiveKey])

  const chartWidth = DEFAULT_WIDTH
  const xOffset = 24
  const innerWidth = chartWidth - xOffset
  const chartHeight = height
  const centerY = chartHeight / 2
  const slotWidth = innerWidth / data.length

  const scaleY = React.useCallback(
    (value: number) => (value / computedMaxValue) * (chartHeight / 2),
    [chartHeight, computedMaxValue]
  )

  const tooltipIndex = displayIndex
  const hoveredCenterX =
    tooltipIndex === null ? null : xOffset + tooltipIndex * slotWidth + slotWidth / 2
  const hoveredPoint = tooltipIndex === null ? null : data[tooltipIndex]

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        className="h-full w-full overflow-visible"
        onMouseLeave={() => setHoveredIndex(null)}
        viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
      >
        <defs>
          <linearGradient id="talimy-mirror-positive-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={positiveColor} stopOpacity="0.14" />
            <stop offset="100%" stopColor={positiveColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="talimy-mirror-negative-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={negativeColor} stopOpacity="0" />
            <stop offset="100%" stopColor={negativeColor} stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="talimy-mirror-positive-gradient-active" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={positiveColor} stopOpacity="0.52" />
            <stop offset="45%" stopColor={positiveColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={positiveColor} stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="talimy-mirror-negative-gradient-active" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={negativeColor} stopOpacity="0.08" />
            <stop offset="55%" stopColor={negativeColor} stopOpacity="0.28" />
            <stop offset="100%" stopColor={negativeColor} stopOpacity="0.78" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((index) => {
          const y = (chartHeight / 4) * index
          const isCenter = index === 2

          return (
            <line
              key={`grid-${index}`}
              stroke={isCenter ? "color-mix(in oklab, var(--border) 90%, white 10%)" : "color-mix(in oklab, var(--border) 65%, white 35%)"}
              strokeDasharray={isCenter ? undefined : "6 6"}
              strokeWidth={isCenter ? 1.6 : 1}
              x1={xOffset}
              x2={chartWidth}
              y1={y}
              y2={y}
            />
          )
        })}

        {data.map((point, index) => {
          const x = xOffset + index * slotWidth
          const positiveValue = Number(point[positiveKey] ?? 0)
          const negativeValue = Number(point[negativeKey] ?? 0)
          const positiveHeight = scaleY(positiveValue)
          const negativeHeight = scaleY(negativeValue)
          const label = String(point[labelKey] ?? "")
          const isActive = hoveredIndex === index

          return (
            <g key={`${label}-${index}`} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(index)}>
              <rect
                fill={isActive ? "url(#talimy-mirror-positive-gradient-active)" : "url(#talimy-mirror-positive-gradient)"}
                height={positiveHeight}
                style={{ transition: "fill 180ms ease, opacity 180ms ease" }}
                width={slotWidth}
                x={x}
                y={centerY - positiveHeight}
              />
              <line
                stroke={positiveColor}
                strokeWidth={isActive ? 3.5 : 3}
                style={{ transition: "stroke-width 180ms ease" }}
                x1={x}
                x2={x + slotWidth}
                y1={centerY - positiveHeight}
                y2={centerY - positiveHeight}
              />

              <rect
                fill={isActive ? "url(#talimy-mirror-negative-gradient-active)" : "url(#talimy-mirror-negative-gradient)"}
                height={negativeHeight}
                style={{ transition: "fill 180ms ease, opacity 180ms ease" }}
                width={slotWidth}
                x={x}
                y={centerY}
              />
              <line
                stroke={negativeColor}
                strokeWidth={isActive ? 3.5 : 3}
                style={{ transition: "stroke-width 180ms ease" }}
                x1={x}
                x2={x + slotWidth}
                y1={centerY + negativeHeight}
                y2={centerY + negativeHeight}
              />

              <text
                fill={isActive ? "var(--foreground)" : "var(--muted-foreground)"}
                fontSize="14"
                fontWeight={isActive ? "600" : "400"}
                textAnchor="middle"
                x={x + slotWidth / 2}
                y={chartHeight + 30}
              >
                {formatMonthLabel ? formatMonthLabel(label, index) : label}
              </text>
            </g>
          )
        })}

        {hoveredPoint && hoveredCenterX !== null ? (
          <g
            style={{
              opacity: tooltipVisible ? 1 : 0,
              pointerEvents: "none",
              transform: tooltipVisible ? "translateY(0px)" : "translateY(6px)",
              transformOrigin: `${hoveredCenterX}px ${centerY}px`,
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
          >
            <line
              stroke={positiveColor}
              strokeDasharray="4 4"
              strokeWidth="1"
              x1={hoveredCenterX}
              x2={hoveredCenterX}
              y1={0}
              y2={chartHeight}
            />
            <circle cx={hoveredCenterX} cy={centerY} fill={positiveColor} r="4.5" />

            <foreignObject
              height="128"
              width="208"
              x={Math.min(hoveredCenterX + 18, chartWidth - 208)}
              y={centerY - 78}
            >
              <div className="rounded-xl border border-border/70 bg-card/95 p-4 shadow-md backdrop-blur">
                <p className="text-xs font-medium text-muted-foreground">
                  {formatTooltipLabel(String(hoveredPoint[labelKey] ?? ""), tooltipIndex ?? 0)}
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: positiveColor }} />
                      <span>{positiveLabel}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatValue(Number(hoveredPoint[positiveKey] ?? 0), positiveKey)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: negativeColor }} />
                      <span>{negativeLabel}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatValue(Number(hoveredPoint[negativeKey] ?? 0), negativeKey)}
                    </span>
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
        ) : null}
      </svg>
    </div>
  )
}
