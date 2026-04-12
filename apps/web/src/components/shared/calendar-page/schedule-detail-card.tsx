"use client"

import { CalendarDays, Clock3, MapPin } from "lucide-react"

import {
  formatEventDate,
  formatEventTimeRange,
  getCalendarCategoryPalette,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import type { CalendarPageEvent } from "@/components/shared/calendar-page/calendar-page.types"

type ScheduleDetailCardProps = {
  categoryLabel: string
  event: CalendarPageEvent
  locale: string
  labels: {
    notes: string
  }
}

export function ScheduleDetailCard({
  categoryLabel,
  event,
  labels,
  locale,
}: ScheduleDetailCardProps) {
  const palette = getCalendarCategoryPalette(event.category)

  return (
    <article className={["rounded-[22px] p-4", palette.detailCardClassName].join(" ")}>
      <div className="space-y-4">
        <span
          className={[
            "inline-flex rounded-full px-3 py-1 text-[11px] font-medium",
            palette.labelClassName,
          ].join(" ")}
        >
          {categoryLabel}
        </span>

        <div className="space-y-1">
          <h3 className="text-[18px] font-semibold leading-6">{event.title}</h3>
        </div>

        <div className="space-y-3 text-[12px] font-medium">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5" />
            <span>{formatEventDate(locale, event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-3.5" />
            <span>{formatEventTimeRange(locale, event.startDate, event.endDate)}</span>
          </div>
          {event.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5" />
              <span>{event.location}</span>
            </div>
          ) : null}
        </div>

        {event.description ? (
          <div className="space-y-2 rounded-[14px] bg-white/55 p-3 text-[12px] leading-5 text-inherit">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-65">
              {labels.notes}
            </div>
            <p>{event.description}</p>
          </div>
        ) : null}
      </div>
    </article>
  )
}
