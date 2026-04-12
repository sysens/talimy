"use client"

import { endOfDay, isSameDay, isSameMonth, max, min, parseISO, startOfDay } from "date-fns"

import { CalendarTimeEventBlock } from "@/components/shared/calendar-page/calendar-time-event-block"
import {
  buildHourSlots,
  getEventMinutes,
  getWeekDates,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import type { CalendarPageEvent } from "@/components/shared/calendar-page/calendar-page.types"

const HOUR_HEIGHT = 56
const START_HOUR = 8
const END_HOUR = 20

type CalendarWeekViewProps = {
  activeDate: Date
  events: readonly CalendarPageEvent[]
  locale: string
  onDateSelect: (date: Date) => void
  onEventSelect: (event: CalendarPageEvent) => void
  selectedDate: Date
}

function resolveEventBlockStyle(event: CalendarPageEvent, day: Date) {
  const clippedStart = max([parseISO(event.startDate), startOfDay(day)])
  const clippedEnd = min([parseISO(event.endDate), endOfDay(day)])
  const startMinutes = Math.max(getEventMinutes(clippedStart.toISOString()), START_HOUR * 60)
  const endMinutes = Math.min(getEventMinutes(clippedEnd.toISOString()), END_HOUR * 60)
  const durationMinutes = Math.max(endMinutes - startMinutes, 45)
  const top = ((startMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT
  const height = (durationMinutes / 60) * HOUR_HEIGHT

  return { height, left: 6, right: 6, top }
}

export function CalendarWeekView({
  activeDate,
  events,
  locale,
  onDateSelect,
  onEventSelect,
  selectedDate,
}: CalendarWeekViewProps) {
  const weekDates = getWeekDates(activeDate)
  const hourSlots = buildHourSlots()
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white">
      <div className="flex border-b border-slate-100 bg-[#fafbfe]">
        <div className="w-[72px] shrink-0 border-r border-slate-100" />
        <div className="grid flex-1 grid-cols-7">
          {weekDates.map((date) => (
            <button
              className={[
                "border-r border-slate-100 px-2 py-3 text-center last:border-r-0",
                isSameDay(date, selectedDate) ? "bg-[#f7fbfd]" : "",
              ].join(" ")}
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              type="button"
            >
              <div className="text-[12px] font-medium text-slate-500">
                {new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date)}
              </div>
              <div
                className={[
                  "mt-1 text-[14px] font-semibold",
                  isSameMonth(date, activeDate) ? "text-talimy-navy" : "text-slate-300",
                ].join(" ")}
              >
                {date.getDate()}
              </div>
            </button>
          ))}
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

        <div className="grid flex-1 grid-cols-7">
          {weekDates.map((day) => {
            const dayEvents = events.filter((event) => isSameDay(parseISO(event.startDate), day))

            return (
              <div
                className="relative border-r border-slate-100 last:border-r-0"
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onDateSelect(day)
                  }
                }}
                role="button"
                style={{ height: totalHeight }}
                tabIndex={0}
              >
                {hourSlots.slice(0, -1).map((hour) => (
                  <div
                    className="border-b border-slate-100"
                    key={`${day.toISOString()}-${hour}`}
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {dayEvents.map((event) => (
                  <CalendarTimeEventBlock
                    event={event}
                    key={event.id}
                    locale={locale}
                    onClick={onEventSelect}
                    style={resolveEventBlockStyle(event, day)}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
