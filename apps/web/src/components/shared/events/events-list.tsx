"use client"

import { Button } from "@talimy/ui"
import { Ellipsis, School } from "lucide-react"

import { AnimatedList } from "@/components/shared/animated-list"
import { cn } from "@/lib/utils"
import type { EventListItem } from "@/components/shared/events/events-list.types"

type EventsListProps = {
  className?: string
  emptyState?: string
  events: readonly EventListItem[]
  title?: string
}

export function EventsList({
  className,
  emptyState = "No events scheduled.",
  events,
  title = "Events",
}: EventsListProps) {
  return (
    <section className={cn("w-full space-y-5 bg-white px-1.5", className)}>
      <header className="flex items-center justify-between gap-3 pt-2 mb-1! rounded-2xl">
        <h3 className="text-[16px] font-semibold text-[#274b6d]">{title}</h3>
        <Button
          className="h-7 w-7 p-0 text-[#8fa2b2] shadow-none"
          size="icon"
          type="button"
          variant="ghost"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </header>

      {events.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-[18px] border border-dashed border-slate-200 text-sm text-slate-400">
          {emptyState}
        </div>
      ) : (
        <AnimatedList
          className="w-full"
          displayScrollbar={false}
          enableArrowNavigation={false}
          getItemKey={(item) => item.id}
          itemClassName="mb-4"
          items={events}
          renderItem={(item, { isSelected }) => (
            <article
              className={cn(
                "rounded-[18px] bg-[#f7f8fb] px-4 py-4 transition-colors",
                isSelected ? "bg-[#f2f5fa]" : ""
              )}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-[#f5bcff] px-2 py-1 text-[12px] leading-none font-medium text-[#5b4673]">
                  {item.dateLabel}
                </span>
                <span className="text-[12px] text-[#97a7b5]">{item.timeRange}</span>
              </div>

              <h4 className="text-[15px] leading-6 font-semibold text-[#274b6d]">{item.title}</h4>

              <div className="mt-3 flex items-center gap-2 text-[13px] text-[#9aa8b6]">
                <School className="h-4 w-4 shrink-0" />
                <span>{item.audience}</span>
              </div>
            </article>
          )}
          showGradients={false}
        />
      )}
    </section>
  )
}
