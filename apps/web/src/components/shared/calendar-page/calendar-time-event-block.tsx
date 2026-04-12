"use client"

import type { CSSProperties } from "react"

import {
  formatEventClock,
  getCalendarCategoryPalette,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import type { CalendarPageEvent } from "@/components/shared/calendar-page/calendar-page.types"

type CalendarTimeEventBlockProps = {
  event: CalendarPageEvent
  locale: string
  onClick: (event: CalendarPageEvent) => void
  style: CSSProperties
}

export function CalendarTimeEventBlock({
  event,
  locale,
  onClick,
  style,
}: CalendarTimeEventBlockProps) {
  const palette = getCalendarCategoryPalette(event.category)

  return (
    <button
      className={[
        "absolute z-10 overflow-hidden rounded-[14px] px-3 py-2 text-left shadow-none",
        palette.chipClassName,
      ].join(" ")}
      onClick={(domEvent) => {
        domEvent.stopPropagation()
        onClick(event)
      }}
      style={style}
      type="button"
    >
      <div className="line-clamp-2 text-[11px] font-semibold">{event.title}</div>
      <div className="mt-2 text-[10px] font-medium opacity-80">
        {formatEventClock(locale, event.startDate)}
      </div>
    </button>
  )
}
