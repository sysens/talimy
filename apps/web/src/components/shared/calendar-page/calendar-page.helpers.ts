import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { BookOpen, BriefcaseBusiness, CalendarDays, Coins, FileText } from "lucide-react"

import type { AdminCalendarEventResponse } from "@/components/admin/calendar/admin-calendar-api.types"
import type {
  CalendarCategoryTabItem,
  CalendarMonthOption,
  CalendarPageCategory,
  CalendarPageCategoryFilter,
  CalendarPageEvent,
} from "@/components/shared/calendar-page/calendar-page.types"

type CategoryPalette = {
  chipClassName: string
  detailCardClassName: string
  labelClassName: string
  tone: CalendarCategoryTabItem["tone"]
}

const CATEGORY_PALETTE: Record<CalendarPageCategory, CategoryPalette> = {
  academic: {
    chipClassName: "bg-talimy-pink text-[#274760]",
    detailCardClassName: "bg-talimy-pink text-[#274760]",
    labelClassName: "bg-white/55 text-[#274760]",
    tone: "pink",
  },
  administration: {
    chipClassName: "bg-talimy-pink/40 text-[#4f5b76]",
    detailCardClassName: "bg-talimy-pink/40 text-[#274760]",
    labelClassName: "bg-white/55 text-[#4f5b76]",
    tone: "gray",
  },
  events: {
    chipClassName: "bg-[#cfeef8] text-[#274760]",
    detailCardClassName: "bg-[#cfeef8] text-[#274760]",
    labelClassName: "bg-white/55 text-[#476881]",
    tone: "sky",
  },
  finance: {
    chipClassName: "bg-talimy-sky text-talimy-navy",
    detailCardClassName: "bg-talimy-sky text-talimy-navy",
    labelClassName: "bg-white text-talimy-navy",
    tone: "navy",
  },
}

const CATEGORY_ICONS = {
  academic: BookOpen,
  administration: FileText,
  all: CalendarDays,
  events: BriefcaseBusiness,
  finance: Coins,
} as const

function resolveCategory(type: AdminCalendarEventResponse["type"]): CalendarPageCategory {
  switch (type) {
    case "academic":
    case "exam":
      return "academic"
    case "events":
    case "holiday":
    case "sports":
      return "events"
    case "finance":
      return "finance"
    case "administration":
    case "other":
    default:
      return "administration"
  }
}

export function mapCalendarEvent(event: AdminCalendarEventResponse): CalendarPageEvent {
  return {
    category: resolveCategory(event.type),
    description: event.description,
    endDate: event.endDate,
    id: event.id,
    location: event.location,
    startDate: event.startDate,
    title: event.title,
    type: event.type,
    visibility: event.visibility,
  }
}

export function getCalendarCategoryPalette(category: CalendarPageCategory): CategoryPalette {
  return CATEGORY_PALETTE[category]
}

export function buildCalendarCategoryTabs(
  events: readonly CalendarPageEvent[]
): readonly CalendarCategoryTabItem[] {
  const counts = {
    academic: 0,
    administration: 0,
    events: 0,
    finance: 0,
  }

  for (const event of events) {
    counts[event.category] += 1
  }

  return [
    {
      count: events.length,
      icon: CATEGORY_ICONS.all,
      tone: "sky",
      value: "all",
    },
    {
      count: counts.academic,
      icon: CATEGORY_ICONS.academic,
      tone: CATEGORY_PALETTE.academic.tone,
      value: "academic",
    },
    {
      count: counts.events,
      icon: CATEGORY_ICONS.events,
      tone: CATEGORY_PALETTE.events.tone,
      value: "events",
    },
    {
      count: counts.finance,
      icon: CATEGORY_ICONS.finance,
      tone: CATEGORY_PALETTE.finance.tone,
      value: "finance",
    },
    {
      count: counts.administration,
      icon: CATEGORY_ICONS.administration,
      tone: CATEGORY_PALETTE.administration.tone,
      value: "administration",
    },
  ]
}

export function filterCalendarEvents(
  events: readonly CalendarPageEvent[],
  category: CalendarPageCategoryFilter
): readonly CalendarPageEvent[] {
  if (category === "all") {
    return events
  }

  return events.filter((event) => event.category === category)
}

export function buildMonthGrid(baseDate: Date): readonly Date[] {
  const monthStart = startOfMonth(baseDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(endOfMonth(baseDate), { weekStartsOn: 0 })
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

export function buildCalendarMonthOptions(
  baseDate: Date,
  monthNames: readonly string[]
): readonly CalendarMonthOption[] {
  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = addMonths(startOfMonth(baseDate), index - 5)
    const value = format(monthDate, "yyyy-MM")
    const monthIndex = monthDate.getMonth()
    const monthName = monthNames[monthIndex] ?? `Month ${monthIndex + 1}`

    return {
      label: `${monthName} ${monthDate.getFullYear()}`,
      value,
    }
  })
}

export function getCalendarMonthLabel(value: string, monthNames: readonly string[]): string {
  const [yearToken, monthToken] = value.split("-")
  const year = Number(yearToken)
  const monthIndex = Number(monthToken) - 1
  const monthName = monthNames[monthIndex] ?? `Month ${monthIndex + 1}`
  return `${monthName} ${year}`
}

export function getMonthDate(value: string): Date {
  const [yearToken, monthToken] = value.split("-")
  return new Date(Number(yearToken), Number(monthToken) - 1, 1)
}

export function getVisibleMonthEventRange(monthValue: string): {
  dateFrom: string
  dateTo: string
} {
  const monthDate = getMonthDate(monthValue)
  const rangeStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 })
  const rangeEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 })

  return {
    dateFrom: startOfDay(rangeStart).toISOString(),
    dateTo: endOfDay(rangeEnd).toISOString(),
  }
}

export function groupEventsByDay(
  events: readonly CalendarPageEvent[]
): ReadonlyMap<string, readonly CalendarPageEvent[]> {
  const grouped = new Map<string, CalendarPageEvent[]>()

  for (const event of events) {
    const dayKey = format(parseISO(event.startDate), "yyyy-MM-dd")
    const existing = grouped.get(dayKey) ?? []
    grouped.set(dayKey, [...existing, event])
  }

  return grouped
}

export function getSelectedDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function findInitialSelectedDate(
  events: readonly CalendarPageEvent[],
  monthValue: string
): Date {
  const monthDate = getMonthDate(monthValue)
  const monthEvents = events.filter((event) => isSameMonth(parseISO(event.startDate), monthDate))
  const grouped = groupEventsByDay(monthEvents)
  const dates = [...grouped.entries()].sort(([firstKey], [secondKey]) =>
    firstKey.localeCompare(secondKey)
  )
  const dayWithMostEvents = dates.sort(
    (first, second) => second[1].length - first[1].length || first[0].localeCompare(second[0])
  )[0]?.[0]

  return dayWithMostEvents ? parseISO(`${dayWithMostEvents}T00:00:00`) : monthDate
}

export function getEventsForDate(
  events: readonly CalendarPageEvent[],
  date: Date
): readonly CalendarPageEvent[] {
  return events.filter((event) => isSameDay(parseISO(event.startDate), date))
}

export function getWeekDates(baseDate: Date): readonly Date[] {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 })
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

export function buildHourSlots(): readonly number[] {
  return Array.from({ length: 13 }, (_, index) => index + 8)
}

export function getEventMinutes(dateIso: string): number {
  const date = parseISO(dateIso)
  return date.getHours() * 60 + date.getMinutes()
}

export function formatEventTimeRange(locale: string, startDate: string, endDate: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`
}

export function formatEventClock(locale: string, dateIso: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateIso))
}

export function formatEventDate(locale: string, dateIso: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateIso))
}

export function buildWeekdayLabels(locale: string): readonly string[] {
  const weekStart = startOfWeek(new Date(2035, 2, 4), { weekStartsOn: 0 })

  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(addDays(weekStart, index))
  )
}
