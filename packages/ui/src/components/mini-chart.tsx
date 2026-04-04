"use client"

import * as React from "react"

import { cn } from "../lib/utils"
import { ChartFilterSelect } from "./chart-filter-select"
import { Card } from "./ui/card"

export type MiniChartFilterOption = {
  label: React.ReactNode
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
  marker?: "dot" | "line"
}

export type MiniChartMetricItem = {
  color?: string
  label: string
  value: React.ReactNode
}

export type MiniChartAxisLabels = {
  className?: string
  distribution?: "evenly" | "grid"
  style?: React.CSSProperties
  values: React.ReactNode[]
}

export type MiniChartScale = {
  className?: string
  position?: "left" | "right"
  values: React.ReactNode[]
}

export type MiniChartProps = Omit<React.ComponentPropsWithoutRef<typeof Card>, "children"> & {
  chartClassName?: string
  chartOverlay?: React.ReactNode
  children: React.ReactNode
  contentClassName?: string
  filter?: MiniChartFilter
  filterTriggerClassName?: string
  legend?: MiniChartLegendItem[]
  sideMetrics?: MiniChartMetricItem[]
  subtitle?: React.ReactNode
  title: React.ReactNode
  titleClassName?: string
  topLabels?: MiniChartAxisLabels
  yScale?: MiniChartScale
  bottomLabels?: MiniChartAxisLabels
}

export function MiniChart({
  chartClassName,
  chartOverlay,
  children,
  className,
  contentClassName,
  filter,
  filterTriggerClassName,
  legend,
  sideMetrics,
  subtitle,
  title,
  titleClassName,
  topLabels,
  yScale,
  bottomLabels,
  ...props
}: MiniChartProps) {
  const scalePosition = yScale?.position ?? "left"
  const hasLeftScale = Boolean(yScale && scalePosition === "left")
  const hasRightScale = Boolean(yScale && scalePosition === "right")

  return (
    <Card
      className={cn("rounded-3xl border-0 bg-card p-0 shadow-none ring-0", className)}
      {...props}
    >
      <div className={cn("space-y-4 p-5", contentClassName)}>
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3
              className={cn(
                "text-base leading-none font-semibold tracking-tight text-[var(--talimy-color-navy)] dark:text-sky-200",
                titleClassName
              )}
            >
              {title}
            </h3>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>

          {filter ? (
            <ChartFilterSelect
              ariaLabel={filter.ariaLabel}
              defaultValue={filter.defaultValue}
              onValueChange={filter.onValueChange}
              options={filter.options}
              placeholder={filter.placeholder}
              triggerClassName={filterTriggerClassName}
              value={filter.value}
            />
          ) : null}
        </header>

        {legend?.length ? (
          <div className="flex flex-wrap items-center gap-4">
            {legend.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={cn(
                    entry.marker === "line" ? "h-0.5 w-4 rounded-full" : "size-2 rounded-full"
                  )}
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            "grid gap-4",
            sideMetrics?.length ? "md:grid-cols-[minmax(0,1fr)_126px]" : "grid-cols-1"
          )}
        >
          <div className="space-y-2">
            {topLabels ? (
              <div
                className={cn(
                  "grid text-center text-[11px] font-semibold text-[var(--talimy-color-navy)] dark:text-sky-200",
                  hasLeftScale ? "pl-8" : "",
                  hasRightScale ? "pr-8" : "",
                  topLabels.className
                )}
                style={{
                  gridTemplateColumns: `repeat(${topLabels.values.length}, minmax(0, 1fr))`,
                }}
              >
                {topLabels.values.map((value, index) => (
                  <span key={`top-label-${index}`}>{value}</span>
                ))}
              </div>
            ) : null}

            <div
              className={cn(
                "relative min-h-56",
                hasLeftScale ? "pl-8" : "",
                hasRightScale ? "pr-8" : "",
                chartClassName
              )}
            >
              {hasLeftScale ? (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 flex w-8 flex-col justify-between py-1 text-[11px] text-muted-foreground",
                    yScale?.className
                  )}
                >
                  {yScale?.values.map((value, index) => (
                    <span key={`left-scale-${index}`} className="leading-none">
                      {value}
                    </span>
                  ))}
                </div>
              ) : null}

              {hasRightScale ? (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-0 right-0 flex w-8 flex-col justify-between py-1 text-right text-[11px] text-muted-foreground",
                    yScale?.className
                  )}
                >
                  {yScale?.values.map((value, index) => (
                    <span key={`right-scale-${index}`} className="leading-none">
                      {value}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="h-full w-full">{children}</div>
              {chartOverlay ? <div className="absolute top-2 right-2">{chartOverlay}</div> : null}
            </div>

            {bottomLabels ? (
              <div
                className={cn(
                  bottomLabels.distribution === "evenly"
                    ? "flex justify-evenly text-center text-xs text-[var(--talimy-color-gray)] dark:text-muted-foreground"
                    : "grid text-center text-xs text-[var(--talimy-color-gray)] dark:text-muted-foreground",
                  hasLeftScale ? "pl-8" : "",
                  hasRightScale ? "pr-8" : "",
                  bottomLabels.className
                )}
                style={{
                  ...(bottomLabels.distribution === "evenly"
                    ? undefined
                    : {
                        gridTemplateColumns: `repeat(${bottomLabels.values.length}, minmax(0, 1fr))`,
                      }),
                  ...bottomLabels.style,
                }}
              >
                {bottomLabels.values.map((value, index) => (
                  <span
                    key={`bottom-label-${index}`}
                    className={
                      bottomLabels.distribution === "evenly" ? "flex-1 text-center" : undefined
                    }
                  >
                    {value}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {sideMetrics?.length ? (
            <div className="space-y-2 rounded-xl border border-border/60 bg-card/80 p-3">
              {sideMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        metric.color ? "" : "bg-border"
                      )}
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
