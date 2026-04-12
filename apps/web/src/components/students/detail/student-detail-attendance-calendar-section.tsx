"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { CalendarWidget } from "@/components/shared/calendar/calendar-widget"
import { getStudentDetailAttendanceCalendar } from "@/components/students/detail/student-detail-api"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"
import { mapStudentAttendanceCalendarMonths } from "@/components/students/detail/student-detail.mappers"

type StudentDetailAttendanceCalendarSectionProps = {
  studentId: string
}

const DEFAULT_MONTH = "2035-03"

export function StudentDetailAttendanceCalendarSection({
  studentId,
}: StudentDetailAttendanceCalendarSectionProps) {
  const locale = useLocale()
  const t = useTranslations("adminStudents.detail.attendanceCalendar")
  const calendarQuery = useQuery({
    queryFn: () => getStudentDetailAttendanceCalendar(studentId, DEFAULT_MONTH),
    queryKey: studentDetailQueryKeys.attendanceCalendar(studentId, DEFAULT_MONTH),
    staleTime: 60_000,
  })

  if (calendarQuery.isLoading) {
    return <Skeleton className="h-[420px] w-full rounded-[28px]" />
  }

  if (calendarQuery.isError || !calendarQuery.data) {
    return null
  }

  return (
    <CalendarWidget
      attendanceSummaryVariant="cards"
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
      months={mapStudentAttendanceCalendarMonths(calendarQuery.data)}
      variant="attendance"
    />
  )
}
