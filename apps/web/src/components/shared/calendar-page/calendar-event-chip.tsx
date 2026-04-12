"use client"

import {
  formatEventTimeRange,
  getCalendarCategoryPalette,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import type { CalendarPageEvent } from "@/components/shared/calendar-page/calendar-page.types"

type CalendarEventChipProps = {
  event: CalendarPageEvent
  locale: string
  onClick: (event: CalendarPageEvent) => void
}

export function CalendarEventChip({ event, locale, onClick }: CalendarEventChipProps) {
  const palette = getCalendarCategoryPalette(event.category)

  return (
    <button
      className={[
        "w-full rounded-[8px] px-2 py-2 text-left transition-transform hover:-translate-y-0.5",
        palette.chipClassName,
      ].join(" ")}
      onClick={(domEvent) => {
        domEvent.stopPropagation()
        onClick(event)
      }}
      type="button"
    >
      <div className="line-clamp-2 text-[10px] font-semibold leading-4">{event.title}</div>
      <div className="mt-1 text-[9px] font-medium opacity-80">
        {formatEventTimeRange(locale, event.startDate, event.endDate)}
      </div>
    </button>
  )
}
