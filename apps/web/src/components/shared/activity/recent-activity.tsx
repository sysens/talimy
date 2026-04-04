"use client"

import { Button } from "@talimy/ui"
import { Ellipsis } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineMarker,
} from "@/components/shared/timeline"
import { cn } from "@/lib/utils"
import type { RecentActivityItem } from "@/components/shared/activity/recent-activity.types"

type RecentActivityProps = {
  className?: string
  emptyState?: string
  items: readonly RecentActivityItem[]
  title?: string
}

export function RecentActivity({
  className,
  emptyState = "No recent activity.",
  items,
  title = "Recent Activity",
}: RecentActivityProps) {
  return (
    <section className={cn("w-full space-y-5", className)}>
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-[#274b6d]">{title}</h3>
        <Button
          className="h-7 w-7 p-0 text-[#8fa2b2] shadow-none"
          size="icon"
          type="button"
          variant="ghost"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </header>

      {items.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center rounded-[18px] border border-dashed border-slate-200 text-sm text-slate-400">
          {emptyState}
        </div>
      ) : (
        <Timeline>
          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <TimelineItem isLast={index === items.length - 1} key={item.id}>
                <TimelineMarker className={item.iconBackgroundClassName}>
                  <Icon className={cn("h-4 w-4", item.iconClassName)} />
                </TimelineMarker>

                <TimelineContent>
                  <p className="text-[14px] leading-6 font-medium text-[#314d68]">
                    {item.description}
                  </p>
                  <p className="text-[12px] text-[#97a7b5]">{item.timestamp}</p>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      )}
    </section>
  )
}
