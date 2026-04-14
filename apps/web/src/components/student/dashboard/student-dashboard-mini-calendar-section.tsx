"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { getStudentDashboardAttendanceCalendar } from "@/components/student/dashboard/student-dashboard-api"
import {
  buildDashboardMonth,
  mapStudentDashboardCalendarMonths,
} from "@/components/student/dashboard/student-dashboard.mappers"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { CalendarWidget } from "@/components/shared/calendar/calendar-widget"
import type { AppLocale } from "@/config/site"

const DEFAULT_SELECTED_DATE = "2035-03-14"

export function StudentDashboardMiniCalendarSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("studentDashboard.calendar")
  const [selectedDate, setSelectedDate] = React.useState(DEFAULT_SELECTED_DATE)
  const month = buildDashboardMonth(selectedDate)
  const calendarQuery = useQuery({
    queryFn: () => getStudentDashboardAttendanceCalendar(month),
    queryKey: studentDashboardQueryKeys.attendanceCalendar(month),
    staleTime: 60_000,
  })

  if (calendarQuery.isLoading) {
    return <Skeleton className="h-[420px] rounded-[28px]" />
  }

  if (!calendarQuery.data) {
    return null
  }

  return (
    <CalendarWidget
      attendanceSummaryVariant="cards"
      attendanceSummaryGridClassName="grid-cols-2"
      labels={{
        attendanceStatusMeta: {
          absent: {
            description: t("meta.absentDescription"),
            label: t("meta.absent"),
          },
          late: {
            description: t("meta.lateDescription"),
            label: t("meta.late"),
          },
          onLeave: {
            description: t("meta.sickDescription"),
            label: t("meta.sick"),
          },
          present: {
            description: t("meta.presentDescription"),
            label: t("meta.present"),
          },
          sick: {
            description: t("meta.sickDescription"),
            label: t("meta.sick"),
          },
        },
        weekdayLabels: [
          t("weekdays.sunday"),
          t("weekdays.monday"),
          t("weekdays.tuesday"),
          t("weekdays.wednesday"),
          t("weekdays.thursday"),
          t("weekdays.friday"),
          t("weekdays.saturday"),
        ],
      }}
      locale={locale}
      months={mapStudentDashboardCalendarMonths(
        {
          absent: t("meta.absent"),
          late: t("meta.late"),
          present: t("meta.present"),
          sick: t("meta.sick"),
        },
        calendarQuery.data
      )}
      onSelectedDateChange={setSelectedDate}
      selectedDate={selectedDate}
      variant="attendance"
    />
  )
}
