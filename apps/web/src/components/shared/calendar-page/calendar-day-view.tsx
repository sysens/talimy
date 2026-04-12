"use client"

import { isSameDay, parseISO } from "date-fns"

import { CalendarTimeEventBlock } from "@/components/shared/calendar-page/calendar-time-event-block"
import {
  buildHourSlots,
  getEventMinutes,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import type { CalendarPageEvent } from "@/components/shared/calendar-page/calendar-page.types"

const HOUR_HEIGHT = 64
const START_HOUR = 8
const END_HOUR = 20

type CalendarDayViewProps = {
  activeDate: Date
  events: readonly CalendarPageEvent[]
  locale: string
  onEventSelect: (event: CalendarPageEvent) => void
}

function resolveEventBlockStyle(event: CalendarPageEvent) {
  const startMinutes = Math.max(getEventMinutes(event.startDate), START_HOUR * 60)
  const endMinutes = Math.min(getEventMinutes(event.endDate), END_HOUR * 60)
  const durationMinutes = Math.max(endMinutes - startMinutes, 45)

  return {
    height: (durationMinutes / 60) * HOUR_HEIGHT,
    left: 12,
    right: 12,
    top: ((startMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT,
  }
}

export function CalendarDayView({
  activeDate,
  events,
  locale,
  onEventSelect,
}: CalendarDayViewProps) {
  const hourSlots = buildHourSlots()
  const dayEvents = events.filter((event) => isSameDay(parseISO(event.startDate), activeDate))

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white">
      <div className="flex border-b border-slate-100 bg-[#fafbfe]">
        <div className="w-[72px] shrink-0 border-r border-slate-100" />
        <div className="px-4 py-3">
          <div className="text-[12px] font-medium text-slate-500">
            {new Intl.DateTimeFormat(locale, { weekday: "long" }).format(activeDate)}
          </div>
          <div className="mt-1 text-[16px] font-semibold text-talimy-navy">
            {activeDate.getDate()}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-[72px] shrink-0 border-r border-slate-100">
          {hourSlots.slice(0, -1).map((hour) => (
            <div
              className="relative border-b border-slate-100 px-3 text-right text-[11px] font-medium text-slate-400"
              key={hour}
              style={{ height: HOUR_HEIGHT }}
            >
              <span className="-translate-y-1/2 absolute right-3 top-0 bg-white px-1">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        <div className="relative flex-1">
          {hourSlots.slice(0, -1).map((hour) => (
            <div className="border-b border-slate-100" key={hour} style={{ height: HOUR_HEIGHT }} />
          ))}

          {dayEvents.map((event) => (
            <CalendarTimeEventBlock
              event={event}
              key={event.id}
              locale={locale}
              onClick={onEventSelect}
              style={resolveEventBlockStyle(event)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
