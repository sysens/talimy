"use client"

import * as React from "react"
import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { useTeacherDetailOverviewQuery } from "@/components/teachers/detail/use-teacher-detail-overview-query"
import { TimetableGridCard } from "@/components/shared/schedule/timetable-grid-card"
import type { TimetableGridEntry } from "@/components/shared/schedule/timetable-grid-card.types"

type TeacherDetailScheduleSectionProps = {
  teacherId: string
}

const mapScheduleRecords = (records: readonly any[]): TimetableGridEntry[] => {
  return records.map((record) => ({
    id: record.id,
    day: record.dayOfWeek,
    startTime: record.startTime,
    endTime: record.endTime,
    title: record.subject,
    type: "lecture",
    room: record.room,
  }))
}

export function TeacherDetailScheduleSection({ teacherId }: TeacherDetailScheduleSectionProps) {
  const [period, setPeriod] = React.useState("weekly")
  const t = useTranslations("adminTeachers.detail.schedule")

  const query = useTeacherDetailOverviewQuery(teacherId)

  if (query.isLoading) {
    return <Skeleton className="h-[432px] w-full rounded-[28px]" />
  }

  if (query.isError || !query.data) {
    return null
  }

  const entries = mapScheduleRecords(query.data.schedule)

  return (
    <TimetableGridCard
      entries={entries}
      onPeriodChange={setPeriod}
      period={period}
      periodOptions={[
        { label: t("periodOptions.weekly"), value: "weekly" },
        { label: t("periodOptions.today"), value: "today" },
      ]}
      title={t("title")}
    />
  )
}
