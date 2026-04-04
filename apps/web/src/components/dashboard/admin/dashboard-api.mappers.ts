import {
  BadgeCheck,
  BookOpenCheck,
  CalendarClock,
  Megaphone,
  Pencil,
  UserRoundPlus,
} from "lucide-react"

import type { FeedItem } from "@/components/shared/feed/feed-table"
import type {
  CalendarEntry,
  CalendarIconKey,
  CalendarMonthData,
} from "@/components/shared/calendar/calendar-widget.types"
import type { EventListItem } from "@/components/shared/events/events-list.types"
import type { RecentActivityItem } from "@/components/shared/activity/recent-activity.types"
import type {
  AdminActivityResponse,
  AdminAttendanceOverviewResponse,
  AdminFinanceEarningsResponse,
  AdminStudentPerformanceResponse,
  DashboardCalendarPayload,
  EventsResponse,
  NoticesResponse,
} from "@/components/dashboard/admin/dashboard-api.types"
import {
  buildWeekdayLabels,
  formatDateTime,
  formatMonthDay,
  formatMonthDayYear,
  formatMonthShort,
} from "@/lib/dashboard/dashboard-formatters"

type Translator = (key: string, values?: Record<string, string | number>) => string

type NoticePriority = NoticesResponse["data"][number]["priority"]

const NOTICE_AVATARS: Record<NoticePriority, string> = {
  high: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
  low: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
  medium: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
  urgent: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
}

const EVENT_ICON_MAP: Record<EventsResponse["data"][number]["type"], CalendarIconKey> = {
  academic: "classroom",
  exam: "books",
  holiday: "announcement",
  other: "meeting",
  sports: "workshop",
}

const EVENT_COLOR_MAP: Record<EventsResponse["data"][number]["type"], string> = {
  academic: "text-sky-500",
  exam: "text-violet-500",
  holiday: "text-amber-500",
  other: "text-emerald-500",
  sports: "text-fuchsia-500",
}

const PRIORITY_BADGE_MAP: Record<NoticePriority, string> = {
  high: "bg-orange-100 text-orange-700",
  low: "bg-slate-100 text-slate-700",
  medium: "bg-sky-100 text-sky-700",
  urgent: "bg-rose-100 text-rose-700",
}

export function mapStudentPerformanceRows(
  locale: string,
  response: AdminStudentPerformanceResponse
): ReadonlyArray<{ grade7: number; grade8: number; grade9: number; month: string }> {
  return response.points.map((point) => ({
    grade7: point.grade7,
    grade8: point.grade8,
    grade9: point.grade9,
    month: formatMonthShort(locale, point.monthNumber),
  }))
}

export function mapAttendanceChartPoints(
  locale: string,
  response: AdminAttendanceOverviewResponse
): ReadonlyArray<{
  label: string
  value: number
  absentBreakdown: ReadonlyArray<{ label: string; value: number }>
}> {
  return response.points.map((point) => ({
    absentBreakdown: [],
    label:
      response.period === "weekly"
        ? new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(point.date))
        : formatMonthShort(locale, new Date(point.date).getMonth() + 1),
    value: point.value,
  }))
}

export function mapEarningsRows(
  locale: string,
  response: AdminFinanceEarningsResponse
): ReadonlyArray<{ earnings: number; expenses: number; month: string }> {
  return response.points.map((point) => ({
    earnings: point.earnings,
    expenses: point.expenses,
    month: formatMonthShort(locale, point.monthNumber),
  }))
}

export function mapNoticesToFeed(
  locale: string,
  t: Translator,
  response: NoticesResponse
): readonly FeedItem[] {
  return response.data.map((item) => ({
    badges: [
      {
        className: PRIORITY_BADGE_MAP[item.priority],
        label: t(`priority.${item.priority}`),
      },
    ],
    id: item.id,
    imageFallback: item.title.slice(0, 2).toUpperCase(),
    imageUrl: resolveNoticeAvatar(item.priority),
    metadata: [
      { label: t("meta.audience"), value: t(`audiences.${item.targetRole}`) },
      { label: t("meta.date"), value: formatMonthDayYear(locale, item.publishDate) },
      {
        label: t("meta.createdBy"),
        value: item.createdByName ?? t("createdByFallback"),
      },
    ],
    popularity: resolveNoticePopularity(item.priority, item.publishDate),
    publishedAt: item.publishDate,
    title: item.title,
  }))
}

function resolveNoticeAvatar(priority: NoticePriority): string {
  return NOTICE_AVATARS[priority]
}

export function buildCalendarPayload(
  locale: string,
  t: Translator,
  selectedDate: string,
  response: EventsResponse
): DashboardCalendarPayload {
  const selected = new Date(selectedDate)
  const selectedYear = Number.isNaN(selected.getTime())
    ? new Date().getFullYear()
    : selected.getFullYear()
  const selectedMonth = Number.isNaN(selected.getTime())
    ? new Date().getMonth() + 1
    : selected.getMonth() + 1
  const monthDescriptors = [-1, 0, 1].map((offset) => {
    const date = new Date(Date.UTC(selectedYear, selectedMonth - 1 + offset, 1, 0, 0, 0, 0))
    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      monthNumber: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
    }
  })

  const eventsByMonth = new Map<string, CalendarEntry[]>()

  for (const item of response.data) {
    const date = new Date(item.startDate)
    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
    const entry: CalendarEntry = {
      colorClassName: EVENT_COLOR_MAP[item.type],
      day: date.getUTCDate(),
      iconKey: EVENT_ICON_MAP[item.type],
      metaLabel: buildCalendarEntryMeta(locale, t, item),
      title: item.title,
    }

    const monthEntries = eventsByMonth.get(monthKey) ?? []
    monthEntries.push(entry)
    eventsByMonth.set(monthKey, monthEntries)
  }

  return {
    eventCountLabel: (count) => t("eventsCount", { count }),
    months: monthDescriptors.map((descriptor) => {
      const entries = eventsByMonth.get(descriptor.key) ?? []
      const groupedEntries: Partial<Record<number, readonly CalendarEntry[]>> = {}

      for (const entry of entries) {
        const existingEntries = groupedEntries[entry.day] ?? []
        groupedEntries[entry.day] = [...existingEntries, entry]
      }

      const descriptorSelectedDay =
        descriptor.year === selectedYear && descriptor.monthNumber === selectedMonth
          ? selected.getDate()
          : (entries[0]?.day ?? null)

      return {
        events: groupedEntries,
        key: descriptor.key,
        kind: "events" as const,
        month: formatMonthShort(locale, descriptor.monthNumber),
        monthNumber: descriptor.monthNumber,
        selectedDay: descriptorSelectedDay,
        year: descriptor.year,
      } satisfies CalendarMonthData
    }),
    weekdayLabels: buildWeekdayLabels(locale),
  }
}

export function mapEventsToAgenda(
  locale: string,
  t: Translator,
  response: EventsResponse
): readonly EventListItem[] {
  return response.data.map((item) => ({
    audience: item.location ?? t("locationFallback"),
    dateLabel: formatMonthDay(locale, item.startDate),
    id: item.id,
    timeRange: buildTimeRange(locale, item.startDate, item.endDate),
    title: item.title,
  }))
}

export function mapRecentActivityItems(
  locale: string,
  t: Translator,
  response: AdminActivityResponse
): readonly RecentActivityItem[] {
  return response.items.map((item) => {
    const iconConfig = resolveActivityIcon(item.resource)
    const actorName = item.actorName ?? t("systemActor")
    const description = t("templates.generic", {
      action: t(`actions.${resolveActivityActionKey(item.action)}`),
      actor: actorName,
      resource: t(`resources.${resolveActivityResourceKey(item.resource)}`),
    })

    return {
      description,
      icon: iconConfig.icon,
      iconBackgroundClassName: iconConfig.backgroundClassName,
      iconClassName: iconConfig.iconClassName,
      id: item.id,
      timestamp: formatDateTime(locale, item.timestamp),
    }
  })
}

function buildCalendarEntryMeta(
  locale: string,
  t: Translator,
  item: EventsResponse["data"][number]
): string {
  const timeLabel = buildTimeRange(locale, item.startDate, item.endDate)
  if (item.location) {
    return `${timeLabel} · ${item.location}`
  }

  return `${timeLabel} · ${t(`types.${item.type}`)}`
}

function buildTimeRange(locale: string, startDate: string, endDate: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })

  return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`
}

function resolveNoticePopularity(
  priority: NoticesResponse["data"][number]["priority"],
  publishDate: string
): number {
  const baseScore =
    priority === "urgent" ? 400 : priority === "high" ? 300 : priority === "medium" ? 200 : 100
  return baseScore + new Date(publishDate).getTime()
}

function resolveActivityActionKey(
  action: string
): "create" | "delete" | "replace" | "update" | "write" {
  if (action === "create" || action === "update" || action === "delete" || action === "replace") {
    return action
  }

  return "write"
}

function resolveActivityResourceKey(
  resource: string
): "attendance" | "auth" | "events" | "notices" | "payments" | "students" | "teachers" | "unknown" {
  if (
    resource === "attendance" ||
    resource === "auth" ||
    resource === "events" ||
    resource === "notices" ||
    resource === "payments" ||
    resource === "students" ||
    resource === "teachers"
  ) {
    return resource
  }

  return "unknown"
}

function resolveActivityIcon(resource: string): {
  backgroundClassName: string
  icon: typeof UserRoundPlus
  iconClassName: string
} {
  switch (resource) {
    case "attendance":
      return {
        backgroundClassName: "bg-[#f5bcff]",
        icon: BadgeCheck,
        iconClassName: "text-[#5e547f]",
      }
    case "payments":
      return {
        backgroundClassName: "bg-[#264f79]",
        icon: BookOpenCheck,
        iconClassName: "text-white",
      }
    case "events":
    case "notices":
      return {
        backgroundClassName: "bg-[#f5bcff]",
        icon: Megaphone,
        iconClassName: "text-[#5e547f]",
      }
    case "teachers":
    case "students":
      return {
        backgroundClassName: "bg-[#264f79]",
        icon: UserRoundPlus,
        iconClassName: "text-white",
      }
    case "auth":
      return {
        backgroundClassName: "bg-[#264f79]",
        icon: CalendarClock,
        iconClassName: "text-white",
      }
    default:
      return { backgroundClassName: "bg-[#f5bcff]", icon: Pencil, iconClassName: "text-[#5e547f]" }
  }
}
