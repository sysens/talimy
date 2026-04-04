"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { Skeleton } from "@talimy/ui"

import {
  getAdminRecentActivity,
  getDashboardEvents,
} from "@/components/dashboard/admin/dashboard-api"
import {
  buildCalendarPayload,
  mapEventsToAgenda,
  mapRecentActivityItems,
} from "@/components/dashboard/admin/dashboard-api.mappers"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import { CalendarWidget } from "@/components/shared/calendar/calendar-widget"
import { EventsList } from "@/components/shared/events/events-list"
import { RecentActivity } from "@/components/shared/activity/recent-activity"
import type { AppLocale } from "@/config/site"
import { useDashboardStore } from "@/stores/dashboard-store"

function SidebarSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[300px] rounded-[24px]" />
      <Skeleton className="h-[280px] rounded-[24px]" />
      <Skeleton className="h-[280px] rounded-[24px]" />
    </div>
  )
}

export function AdminDashboardRightPanelContent() {
  const locale = useLocale() as AppLocale
  const calendarT = useTranslations("adminDashboard.sidebar.calendar")
  const eventsT = useTranslations("adminDashboard.sidebar.events")
  const recentActivityT = useTranslations("adminDashboard.sidebar.recentActivity")
  const selectedDate = useDashboardStore((state) => state.selectedDate)
  const setSelectedDate = useDashboardStore((state) => state.setSelectedDate)

  const calendarQuery = useQuery({
    queryKey: adminDashboardQueryKeys.calendar(locale, selectedDate),
    queryFn: async () => {
      const { dateFrom, dateTo } = buildCalendarRange(selectedDate)
      const response = await getDashboardEvents(dateFrom, dateTo, 50)
      return buildCalendarPayload(locale, calendarT, selectedDate, response)
    },
    refetchInterval: 60_000,
  })

  const eventsQuery = useQuery({
    queryKey: adminDashboardQueryKeys.events(locale, selectedDate),
    queryFn: async () => {
      const { dateFrom, dateTo } = buildAgendaRange(selectedDate)
      const response = await getDashboardEvents(dateFrom, dateTo, 3)
      return mapEventsToAgenda(locale, eventsT, response)
    },
    refetchInterval: 60_000,
  })

  const recentActivityQuery = useQuery({
    queryKey: adminDashboardQueryKeys.recentActivity(locale),
    queryFn: async () => {
      const response = await getAdminRecentActivity(5)
      return mapRecentActivityItems(locale, recentActivityT, response)
    },
    refetchInterval: 60_000,
  })

  if (calendarQuery.isLoading || eventsQuery.isLoading || recentActivityQuery.isLoading) {
    return <SidebarSkeleton />
  }

  if (!calendarQuery.data || !eventsQuery.data || !recentActivityQuery.data) {
    return <SidebarSkeleton />
  }

  return (
    <div className="space-y-5">
      <CalendarWidget
        labels={{
          eventCountLabel: calendarQuery.data.eventCountLabel,
          weekdayLabels: calendarQuery.data.weekdayLabels,
        }}
        locale={locale}
        months={calendarQuery.data.months}
        onSelectedDateChange={setSelectedDate}
        selectedDate={selectedDate}
        variant="events"
      />
      <EventsList
        emptyState={eventsT("emptyState")}
        events={eventsQuery.data}
        title={eventsT("title")}
      />
      <RecentActivity
        emptyState={recentActivityT("emptyState")}
        items={recentActivityQuery.data}
        title={recentActivityT("title")}
      />
    </div>
  )
}

function buildAgendaRange(selectedDate: string): { dateFrom: string; dateTo: string } {
  const startDate = startOfDay(selectedDate)
  const endDate = new Date(startDate)
  endDate.setUTCDate(endDate.getUTCDate() + 30)

  return {
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString(),
  }
}

function buildCalendarRange(selectedDate: string): { dateFrom: string; dateTo: string } {
  const selected = startOfDay(selectedDate)
  const startDate = new Date(
    Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth() - 1, 1, 0, 0, 0, 0)
  )
  const endDate = new Date(
    Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth() + 2, 1, 0, 0, 0, 0)
  )

  return {
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString(),
  }
}

function startOfDay(value: string): Date {
  const resolved = new Date(value)
  if (Number.isNaN(resolved.getTime())) {
    const now = new Date()
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
  }

  return new Date(
    Date.UTC(resolved.getUTCFullYear(), resolved.getUTCMonth(), resolved.getUTCDate(), 0, 0, 0, 0)
  )
}
