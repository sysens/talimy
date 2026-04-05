"use client"

import type { ChartFilterSelectProps } from "@talimy/ui"
import { ChartFilterSelect, cn } from "@talimy/ui"
import { Card } from "@heroui/react"

import { MetricProgressRow } from "@/components/shared/performance/metric-progress-row"

import type { MetricProgressCardItem } from "./metric-progress-card.types"

type MetricProgressCardProps = {
  className?: string
  filter?: Omit<ChartFilterSelectProps, "className">
  items: readonly MetricProgressCardItem[]
  title: string
}

export function MetricProgressCard({ className, filter, items, title }: MetricProgressCardProps) {
  return (
    <Card className={cn("w-full p-0 bg-transparent shadow-none rounded-none", className)}>
      <Card.Content className="gap-4 bg-transparent ">
        <div className="flex items-start justify-between gap-3 ">
          <h3 className="text-[14px] leading-none font-semibold text-talimy-navy">{title}</h3>

          {filter ? (
            <ChartFilterSelect
              {...filter}
              className="shrink-0"
              triggerClassName="h-10 min-w-[124px] rounded-2xl px-3 text-[13px] font-semibold"
            />
          ) : null}
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <MetricProgressRow item={item} key={item.id} />
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
