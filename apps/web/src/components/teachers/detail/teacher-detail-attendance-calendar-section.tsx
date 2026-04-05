"use client"

import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@talimy/ui"

import { CalendarWidget } from "@/components/shared/calendar/calendar-widget"
import { getTeacherDetailAttendanceCalendar } from "@/components/teachers/detail/teacher-detail-api"
import { mapAttendanceCalendarMonths } from "@/components/teachers/detail/teacher-detail.mappers"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"

type TeacherDetailAttendanceCalendarSectionProps = {
  teacherId: string
}

export function TeacherDetailAttendanceCalendarSection({
  teacherId,
}: TeacherDetailAttendanceCalendarSectionProps) {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const attendanceCalendarQuery = useQuery({
    queryFn: () => getTeacherDetailAttendanceCalendar(teacherId, month),
    queryKey: teacherDetailQueryKeys.attendanceCalendar(teacherId, month),
    staleTime: 60_000,
  })

  if (attendanceCalendarQuery.isLoading) {
    return <Skeleton className="h-[360px] w-72 rounded-[28px]" />
  }

  if (attendanceCalendarQuery.isError || !attendanceCalendarQuery.data) {
    return null
  }

  return (
    <CalendarWidget
      className="w-72"
      months={mapAttendanceCalendarMonths(attendanceCalendarQuery.data)}
      variant="attendance"
    />
  )
}
