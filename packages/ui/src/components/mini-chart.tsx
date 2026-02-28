"use client"

import * as React from "react"

import { cn } from "../lib/utils"
import { Card } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export type MiniChartFilterOption = {
  label: string
  value: string
}

export type MiniChartFilter = {
  ariaLabel?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: MiniChartFilterOption[]
  placeholder?: string
  value?: string
}

export type MiniChartLegendItem = {
  color: string
  id: string
  label: string
}

export type MiniChartMetricItem = {
  color?: string
  label: string
  value: React.ReactNode
}

export type MiniChartProps = Omit<React.ComponentPropsWithoutRef<typeof Card>, "children"> & {
  chartClassName?: string
  chartOverlay?: React.ReactNode
  children: React.ReactNode
  contentClassName?: string
  filter?: MiniChartFilter
  legend?: MiniChartLegendItem[]
  sideMetrics?: MiniChartMetricItem[]
  subtitle?: React.ReactNode
  title: React.ReactNode
}

export function MiniChart({
  chartClassName,
  chartOverlay,
  children,
  className,
  contentClassName,
  filter,
  legend,
  sideMetrics,
  subtitle,
  title,
  ...props
}: MiniChartProps) {
  return (
    <Card className={cn("rounded-3xl border-0 bg-card p-0 shadow-none", className)} {...props}>
      <div className={cn("space-y-4 p-5", contentClassName)}>
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base leading-none font-semibold tracking-tight text-[var(--talimy-color-navy)] dark:text-sky-200">
              {title}
            </h3>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>

          {filter ? (
            <Select defaultValue={filter.defaultValue} onValueChange={filter.onValueChange} value={filter.value}>
              <SelectTrigger
                aria-label={filter.ariaLabel ?? "Chart filter"}
                className="h-8 min-w-32 rounded-lg border-0 bg-[var(--talimy-color-sky)]/70 text-xs font-medium text-[var(--talimy-color-navy)] shadow-none dark:bg-sky-900/30 dark:text-sky-100"
              >
                <SelectValue placeholder={filter.placeholder ?? "Select"} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </header>

        {legend?.length ? (
          <div className="flex flex-wrap items-center gap-4">
            {legend.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className={cn("grid gap-4", sideMetrics?.length ? "md:grid-cols-[minmax(0,1fr)_126px]" : "grid-cols-1")}>
          <div className={cn("relative min-h-56", chartClassName)}>
            {children}
            {chartOverlay ? <div className="absolute top-2 right-2">{chartOverlay}</div> : null}
          </div>

          {sideMetrics?.length ? (
            <div className="space-y-2 rounded-xl border border-border/60 bg-card/80 p-3">
              {sideMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span
                      className={cn("size-2 shrink-0 rounded-full", metric.color ? "" : "bg-border")}
                      style={metric.color ? { backgroundColor: metric.color } : undefined}
                    />
                    <span className="truncate">{metric.label}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-[var(--talimy-color-navy)] dark:text-sky-200">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
