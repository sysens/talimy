"use client"

import { isSameDay, isSameMonth, parseISO } from "date-fns"

import { CalendarEventChip } from "@/components/shared/calendar-page/calendar-event-chip"
import {
  buildMonthGrid,
  getEventsForDate,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import type { CalendarPageEvent } from "@/components/shared/calendar-page/calendar-page.types"

type CalendarMonthViewProps = {
  activeDate: Date
  events: readonly CalendarPageEvent[]
  locale: string
  onDateSelect: (date: Date) => void
  onEventSelect: (event: CalendarPageEvent) => void
  selectedDate: Date
}

export function CalendarMonthView({
  activeDate,
  events,
  locale,
  onDateSelect,
  onEventSelect,
  selectedDate,
}: CalendarMonthViewProps) {
  const days = buildMonthGrid(activeDate)
  const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(days[index] ?? new Date())
  )

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white">
      <div className="grid grid-cols-7 bg-[#fafbfe]">
        {weekdayLabels.map((label) => (
          <div
            className="border-b border-slate-100 px-4 py-3 text-center text-[12px] font-medium text-slate-500"
            key={label}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = getEventsForDate(events, day)
          const isCurrentMonth = isSameMonth(day, activeDate)
          const isSelected = isSameDay(day, selectedDate)

          return (
            <div
              className={[
                "flex min-h-[138px] flex-col gap-2 border-b border-r border-slate-100 px-3 py-3 text-left align-top transition-colors",
                isCurrentMonth ? "bg-white hover:bg-slate-50" : "bg-[#fcfcfd] text-slate-300",
                isSelected ? "ring-1 ring-inset ring-[#d9e9f3]" : "",
              ].join(" ")}
              key={day.toISOString()}
              onClick={() => {
                if (!isCurrentMonth) {
                  return
                }

                onDateSelect(day)
              }}
              onKeyDown={(event) => {
                if (!isCurrentMonth) {
                  return
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onDateSelect(day)
                }
              }}
              role="button"
              tabIndex={isCurrentMonth ? 0 : -1}
            >
              <span
                className={[
                  "text-[12px] font-medium",
                  isCurrentMonth ? "text-slate-500" : "text-slate-300",
                ].join(" ")}
              >
                {day.getDate()}
              </span>

              {isCurrentMonth ? (
                <div className="space-y-2">
                  {dayEvents.slice(0, 2).map((event) => (
                    <CalendarEventChip
                      event={event}
                      key={event.id}
                      locale={locale}
                      onClick={onEventSelect}
                    />
                  ))}

                  {dayEvents.length > 2 ? (
                    <div className="px-1 text-[10px] font-medium text-slate-400">
                      +{dayEvents.length - 2}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
