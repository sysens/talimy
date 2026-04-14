"use client"

import { Card, CardContent, CardHeader, CardTitle, ChartRadialStacked } from "@talimy/ui"

import { cn } from "@/lib/utils"

type PerformanceGaugeCardProps = {
  className?: string
  centerLabel: string
  maxValue: number
  remainingLabel: string
  rangeLabel: string
  title: string
  value: number
}

function formatGaugeValue(value: number, maxValue: number) {
  return (
    <>
      {value.toFixed(1)}
      <tspan className="fill-muted-foreground text-base font-medium">/{maxValue.toFixed(1)}</tspan>
    </>
  )
}

export function PerformanceGaugeCard({
  className,
  centerLabel,
  maxValue,
  remainingLabel,
  rangeLabel,
  title,
  value,
}: PerformanceGaugeCardProps) {
  const normalizedValue = Math.max(0, Math.min(100, (value / maxValue) * 100))

  return (
    <Card className={cn("rounded-[28px] border border-slate-100 shadow-none", className)}>
      <CardHeader className="pb-0">
        <CardTitle className="text-[18px] font-semibold text-talimy-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        <ChartRadialStacked
          centerLabel={centerLabel}
          centerValue={formatGaugeValue(value, maxValue)}
          containerClassName="max-w-[220px]"
          cx="50%"
          cy="86%"
          guideRadius={58}
          hideHeader
          innerRadius={46}
          outerRadius={76}
          segments={[
            {
              color: "var(--talimy-color-navy)",
              key: "score",
              label: title,
              value: normalizedValue,
            },
            {
              color: "color-mix(in srgb, var(--talimy-color-pink) 70%, white 30%)",
              key: "remaining",
              label: remainingLabel,
              value: Math.max(0, 105 - normalizedValue),
            },
          ]}
        />

        <p className="text-center text-[14px] font-medium text-talimy-navy">{rangeLabel}</p>
      </CardContent>
    </Card>
  )
}
