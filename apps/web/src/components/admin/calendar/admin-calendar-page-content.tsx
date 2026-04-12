"use client"

import * as React from "react"
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query"
import { Button, Skeleton } from "@talimy/ui"
import { format, isSameMonth, parseISO } from "date-fns"
import { Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import {
  getAdminCalendarEventById,
  getAdminCalendarEvents,
} from "@/components/admin/calendar/admin-calendar-api"
import { adminCalendarQueryKeys } from "@/components/admin/calendar/admin-calendar-query-keys"
import { AddAgendaModal } from "@/components/shared/calendar-page/add-agenda-modal"
import { CalendarCategoryTabs } from "@/components/shared/calendar-page/calendar-category-tabs"
import { CalendarDayView } from "@/components/shared/calendar-page/calendar-day-view"
import { CalendarHeader } from "@/components/shared/calendar-page/calendar-header"
import {
  buildCalendarCategoryTabs,
  buildCalendarMonthOptions,
  filterCalendarEvents,
  findInitialSelectedDate,
  getEventsForDate,
  getMonthDate,
  mapCalendarEvent,
} from "@/components/shared/calendar-page/calendar-page.helpers"
import { CalendarMonthView } from "@/components/shared/calendar-page/calendar-month-view"
import { CalendarWeekView } from "@/components/shared/calendar-page/calendar-week-view"
import { ScheduleDetailPanel } from "@/components/shared/calendar-page/schedule-detail-panel"
import type {
  CalendarPageCategory,
  CalendarPageCategoryFilter,
  CalendarPageEvent,
  CalendarPageView,
} from "@/components/shared/calendar-page/calendar-page.types"

const DEFAULT_MONTH = "2035-03"

export function AdminCalendarPageContent() {
  const locale = useLocale()
  const t = useTranslations("adminCalendar")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [monthValue, setMonthValue] = React.useState(DEFAULT_MONTH)
  const [view, setView] = React.useState<CalendarPageView>("month")
  const [category, setCategory] = React.useState<CalendarPageCategoryFilter>("all")
  const [activeDate, setActiveDate] = React.useState(() => getMonthDate(DEFAULT_MONTH))
  const [panelDate, setPanelDate] = React.useState<Date | null>(null)
  const monthNames = React.useMemo(
    () =>
      [
        t("monthNames.january"),
        t("monthNames.february"),
        t("monthNames.march"),
        t("monthNames.april"),
        t("monthNames.may"),
        t("monthNames.june"),
        t("monthNames.july"),
        t("monthNames.august"),
        t("monthNames.september"),
        t("monthNames.october"),
        t("monthNames.november"),
        t("monthNames.december"),
      ] as const,
    [t]
  )

  const eventsQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      getAdminCalendarEvents({
        limit: 200,
        month: monthValue,
        order: "asc",
        page: 1,
        sort: "startDate",
      }),
    queryKey: adminCalendarQueryKeys.list(monthValue),
    staleTime: 30_000,
  })

  const allEvents = React.useMemo(
    () => (eventsQuery.data?.data ?? []).map(mapCalendarEvent),
    [eventsQuery.data?.data]
  )
  const monthDate = React.useMemo(() => getMonthDate(monthValue), [monthValue])
  const monthEvents = React.useMemo(
    () => allEvents.filter((event) => isSameMonth(parseISO(event.startDate), monthDate)),
    [allEvents, monthDate]
  )
  const filteredEvents = React.useMemo(
    () => filterCalendarEvents(allEvents, category),
    [allEvents, category]
  )
  const selectedDayEvents = React.useMemo(
    () => (panelDate ? getEventsForDate(filteredEvents, panelDate) : []),
    [filteredEvents, panelDate]
  )
  const detailQueries = useQueries({
    queries: selectedDayEvents.map((event) => ({
      queryFn: () => getAdminCalendarEventById(event.id),
      queryKey: adminCalendarQueryKeys.event(event.id),
      staleTime: 30_000,
    })),
  })

  const panelEvents = React.useMemo(() => {
    if (
      detailQueries.length === 0 ||
      detailQueries.some((query) => query.isLoading || query.isError)
    ) {
      return selectedDayEvents
    }

    return detailQueries
      .map((query) => query.data)
      .filter((event): event is NonNullable<typeof event> => Boolean(event))
      .map(mapCalendarEvent)
  }, [detailQueries, selectedDayEvents])

  React.useEffect(() => {
    if (!panelDate && monthEvents.length > 0) {
      setPanelDate(findInitialSelectedDate(monthEvents, monthValue))
    }
  }, [monthEvents, monthValue, panelDate])

  React.useEffect(() => {
    if (!panelDate) {
      return
    }

    const hasSelectedDayEvents = getEventsForDate(filteredEvents, panelDate).length > 0
    if (!hasSelectedDayEvents && monthEvents.length > 0) {
      setPanelDate(findInitialSelectedDate(filterCalendarEvents(monthEvents, category), monthValue))
    }
  }, [category, filteredEvents, monthEvents, monthValue, panelDate])

  const monthOptions = React.useMemo(
    () => buildCalendarMonthOptions(monthDate, monthNames),
    [monthDate, monthNames]
  )
  const tabItems = React.useMemo(() => buildCalendarCategoryTabs(monthEvents), [monthEvents])

  const categoryLabels: Record<CalendarPageCategoryFilter, string> = {
    academic: t("categories.academic"),
    administration: t("categories.administration"),
    all: t("categories.all"),
    events: t("categories.events"),
    finance: t("categories.finance"),
  }
  const scheduleCategoryLabels: Record<CalendarPageCategory, string> = {
    academic: t("categories.academic"),
    administration: t("categories.administration"),
    events: t("categories.events"),
    finance: t("categories.finance"),
  }

  function handleDateSelect(date: Date) {
    setActiveDate(date)
    setPanelDate(date)
    const nextMonthValue = format(date, "yyyy-MM")
    if (nextMonthValue !== monthValue) {
      setMonthValue(nextMonthValue)
    }
  }

  function handleMonthDateSelect(date: Date) {
    if (!isSameMonth(date, monthDate)) {
      return
    }

    setActiveDate(date)
    setPanelDate(date)
  }

  function handleEventSelect(event: CalendarPageEvent) {
    const eventDate = parseISO(event.startDate)
    setActiveDate(eventDate)
    setPanelDate(eventDate)
  }

  if (eventsQuery.isLoading && !eventsQuery.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 rounded-[28px]" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-[680px] rounded-[28px]" />
          <Skeleton className="h-[680px] rounded-[28px]" />
        </div>
      </div>
    )
  }

  const defaultAgendaDate = format(panelDate ?? activeDate, "yyyy-MM-dd")

  return (
    <div className="space-y-4">
      <CalendarCategoryTabs
        activeValue={category}
        items={tabItems}
        labels={categoryLabels}
        onValueChange={setCategory}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_285px] xl:items-start">
        <div className="space-y-4">
          <CalendarHeader
            addAction={
              <Button
                className="h-10 rounded-[16px] bg-[var(--talimy-color-pink)] px-4 text-[13px] font-medium text-talimy-navy shadow-none hover:bg-[var(--talimy-color-pink)]/90"
                onClick={() => setIsAddModalOpen(true)}
                type="button"
              >
                <Plus className="mr-1 size-4" />
                {t("header.addAgenda")}
              </Button>
            }
            labels={{
              addAgenda: t("header.addAgenda"),
              day: t("header.day"),
              month: t("header.month"),
              monthAriaLabel: t("header.monthAriaLabel"),
              week: t("header.week"),
            }}
            monthOptions={monthOptions}
            monthValue={monthValue}
            onMonthChange={(value) => {
              setMonthValue(value)
              setActiveDate(getMonthDate(value))
            }}
            onViewChange={setView}
            view={view}
          />

          {view === "month" ? (
            <CalendarMonthView
              activeDate={monthDate}
              events={filteredEvents}
              locale={locale}
              onDateSelect={handleMonthDateSelect}
              onEventSelect={handleEventSelect}
              selectedDate={panelDate ?? activeDate}
            />
          ) : null}

          {view === "week" ? (
            <CalendarWeekView
              activeDate={activeDate}
              events={filteredEvents}
              locale={locale}
              onDateSelect={handleDateSelect}
              onEventSelect={handleEventSelect}
              selectedDate={panelDate ?? activeDate}
            />
          ) : null}

          {view === "day" ? (
            <CalendarDayView
              activeDate={activeDate}
              events={filteredEvents}
              locale={locale}
              onEventSelect={handleEventSelect}
            />
          ) : null}
        </div>

        <div className="xl:sticky xl:top-4">
          <ScheduleDetailPanel
            categoryLabels={scheduleCategoryLabels}
            events={panelEvents}
            labels={{
              empty: t("detailPanel.empty"),
              notes: t("detailPanel.notes"),
              title: t("detailPanel.title"),
            }}
            locale={locale}
            onClose={() => setPanelDate(null)}
          />
        </div>
      </section>

      <AddAgendaModal
        defaultDate={defaultAgendaDate}
        labels={{
          actions: {
            cancel: t("addAgenda.actions.cancel"),
            submit: t("addAgenda.actions.submit"),
            submitting: t("addAgenda.actions.submitting"),
          },
          description: t("addAgenda.description"),
          fields: {
            category: t("addAgenda.fields.category"),
            date: t("addAgenda.fields.date"),
            endTime: t("addAgenda.fields.endTime"),
            location: t("addAgenda.fields.location"),
            notes: t("addAgenda.fields.notes"),
            startTime: t("addAgenda.fields.startTime"),
            title: t("addAgenda.fields.title"),
            visibility: t("addAgenda.fields.visibility"),
          },
          title: t("addAgenda.title"),
          toasts: {
            errorDescription: t("addAgenda.toasts.errorDescription"),
            errorTitle: t("addAgenda.toasts.errorTitle"),
            successDescription: t("addAgenda.toasts.successDescription"),
            successTitle: t("addAgenda.toasts.successTitle"),
          },
        }}
        onOpenChange={setIsAddModalOpen}
        open={isAddModalOpen}
        optionLabels={{
          categories: scheduleCategoryLabels,
          visibility: {
            admin: t("addAgenda.visibility.admin"),
            all: t("addAgenda.visibility.all"),
            students: t("addAgenda.visibility.students"),
            teachers: t("addAgenda.visibility.teachers"),
          },
        }}
      />
    </div>
  )
}
