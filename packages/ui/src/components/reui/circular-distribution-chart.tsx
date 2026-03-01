"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { ChartFilterSelect, type ChartFilterOption } from "../chart-filter-select"
import { Card } from "../ui/card"

export type CircularDistributionSegment = {
  color: string
  key: string
  label: string
  startAngle?: number
  trackColor?: string
  value: number
}

export type CircularDistributionChartProps = {
  centerContent?: React.ReactNode
  className?: string
  filterAriaLabel?: string
  filterOptions?: ChartFilterOption[]
  filterValue?: string
  onFilterChange?: (value: string) => void
  segments: CircularDistributionSegment[]
  title: React.ReactNode
  totalLabel?: (total: number) => React.ReactNode
}

const VIEWBOX_SIZE = 220
const CENTER = VIEWBOX_SIZE / 2

function getCircumference(radius: number) {
  return 2 * Math.PI * radius
}

function getProgressStroke(value: number, total: number, circumference: number) {
  if (total <= 0) {
    return `0 ${circumference}`
  }

  return `${(value / total) * circumference} ${circumference}`
}

function getStrokeOffsetFromAngle(angle: number, circumference: number) {
  return -((angle % 360) / 360) * circumference
}

export function CircularDistributionChart({
  centerContent,
  className,
  filterAriaLabel = "Distribution filter",
  filterOptions,
  filterValue,
  onFilterChange,
  segments,
  title,
  totalLabel = (total) => total.toLocaleString(),
}: CircularDistributionChartProps) {
  const total = React.useMemo(
    () => segments.reduce((sum, segment) => sum + segment.value, 0),
    [segments]
  )

  return (
    <Card className={cn("rounded-[28px] border-0 bg-card p-0 shadow-none", className)}>
      <div className="space-y-5 p-6">
        <header className="flex items-start justify-between gap-3">
          <h3 className="text-[1.75rem] leading-none font-semibold tracking-tight text-[var(--talimy-color-navy)] dark:text-sky-200">
            {title}
          </h3>

          {filterOptions?.length ? (
            <ChartFilterSelect
              ariaLabel={filterAriaLabel}
              options={filterOptions}
              triggerClassName="h-11 min-w-28 rounded-xl px-3 text-base"
              value={filterValue}
              onValueChange={onFilterChange}
            />
          ) : null}
        </header>

        <div className="mx-auto flex w-full max-w-[300px] flex-col items-center gap-5">
          <div className="relative grid place-items-center">
            <svg
              aria-hidden="true"
              className="-rotate-90 overflow-visible"
              height="220"
              viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
              width="220"
            >
              {segments.map((segment, index) => {
                const radius = 78 - index * 28
                const strokeWidth = 22
                const circumference = getCircumference(radius)

                const startOffset = getStrokeOffsetFromAngle(segment.startAngle ?? 0, circumference)

                return (
                  <g key={segment.key}>
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      fill="none"
                      r={radius}
                      stroke={segment.trackColor ?? "color-mix(in oklab, var(--talimy-color-sky) 10%, var(--background) 90%)"}
                      strokeWidth={strokeWidth}
                    />
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      fill="none"
                      r={radius}
                      stroke={segment.color}
                      strokeDasharray={getProgressStroke(segment.value, total, circumference)}
                      strokeDashoffset={startOffset}
                      strokeLinecap="round"
                      strokeWidth={strokeWidth}
                      style={{ transition: "stroke-dasharray 320ms ease, stroke-dashoffset 320ms ease" }}
                    />
                  </g>
                )
              })}
            </svg>

            <div className="absolute inset-0 grid place-items-center">
              <div className="grid size-[92px] place-items-center rounded-full bg-[color-mix(in_oklab,var(--background)_86%,white_14%)]">
                {centerContent ?? (
                  <p className="text-[2.2rem] leading-none font-semibold text-[var(--talimy-color-navy)] dark:text-sky-200">
                    {totalLabel(total)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            {segments.map((segment) => (
              <div key={segment.key} className="flex items-center justify-center gap-2 text-base">
                <span className="size-3 rounded-[4px]" style={{ backgroundColor: segment.color }} />
                <span className="text-[var(--talimy-color-gray)] dark:text-muted-foreground">{segment.label}:</span>
                <span className="font-semibold text-[var(--talimy-color-navy)] dark:text-sky-200">
                  {segment.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
