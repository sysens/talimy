"use client"

import { CalendarWidget } from "@/components/shared/calendar/calendar-widget"

import {
  CALENDAR_ATTENDANCE_MONTHS,
  CALENDAR_EVENT_MONTHS,
} from "@/components/shared/calendar/calendar-widget.data"
import type { CalendarViewVariant } from "@/components/shared/calendar/calendar-widget.types"

type CalendarWidgetShowcaseProps = {
  variant?: CalendarViewVariant
}

export function CalendarWidgetShowcase({ variant = "events" }: CalendarWidgetShowcaseProps) {
  return (
    <CalendarWidget
      months={variant === "attendance" ? CALENDAR_ATTENDANCE_MONTHS : CALENDAR_EVENT_MONTHS}
      variant={variant}
    />
  )
}
