"use client"

import type { CSSProperties } from "react"

import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"

import type { MetricProgressCardItem } from "./metric-progress-card.types"

type MetricProgressRowProps = {
  item: MetricProgressCardItem
}

function clampPercentage(value: number): number {
  if (value < 0) {
    return 0
  }

  if (value > 100) {
    return 100
  }

  return value
}

function formatMetricLabel(value: number, fallbackLabel: string | undefined): string {
  if (fallbackLabel) {
    return fallbackLabel
  }

  return value.toString()
}

export function MetricProgressRow({ item }: MetricProgressRowProps) {
  const fillPercentage = clampPercentage((item.valueValue / item.maxValue) * 100)
  const targetPercentage = clampPercentage((item.targetValue / item.maxValue) * 100)
  const markerStyle = { left: `calc(${targetPercentage}% - 1px)` } satisfies CSSProperties
  const fillStyle = {
    backgroundColor: "color-mix(in srgb, var(--talimy-color-pink) 78%, white 22%)",
    width: `${fillPercentage}%`,
  } satisfies CSSProperties
  const trackStyle = {
    backgroundColor: "color-mix(in srgb, var(--talimy-color-pink) 18%, white 82%)",
  } satisfies CSSProperties
  const valueLabel = formatMetricLabel(item.valueValue, item.valueLabel)
  const targetLabel = formatMetricLabel(item.targetValue, item.targetLabel)

  return (
    <MutedPanelCard className="rounded-4xl bg-white">
      <div className="grid grid-cols-[minmax(0,1fr)_106px] items-center gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-[12px] mb-4 leading-none font-medium text-talimy-navy">
            {item.label}
          </p>
          <p className="text-[11px] leading-none text-slate-400">{item.helperText}</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-right text-[12px] mb-4 leading-none font-semibold text-talimy-navy">
            {valueLabel}/{targetLabel}
          </p>

          <div
            aria-label={`${item.label} progress`}
            aria-valuemax={item.maxValue}
            aria-valuemin={0}
            aria-valuenow={item.valueValue}
            className="relative h-2 rounded-full"
            role="progressbar"
            style={trackStyle}
          >
            <div className="absolute inset-y-0 left-0 rounded-full" style={fillStyle} />
            <div
              className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-talimy-navy"
              style={markerStyle}
            />
          </div>
        </div>
      </div>
    </MutedPanelCard>
  )
}
