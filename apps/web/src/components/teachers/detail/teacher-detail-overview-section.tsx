"use client"

import { useEffect, useMemo, useRef } from "react"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"
import { sileo } from "sileo"

import type {
  TeacherDetailEmploymentType,
  TeacherDetailScheduleRecord,
} from "@/components/teachers/detail/teacher-detail-api.types"
import { useTeacherDetailOverviewQuery } from "@/components/teachers/detail/use-teacher-detail-overview-query"
import { ProfileDetailsCard } from "@/components/shared/profile/profile-details-card"
import { ProfileOverviewCard } from "@/components/shared/profile/profile-overview-card"

type TeacherDetailOverviewSectionProps = {
  teacherId: string
}

function getAvatarFallback(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "TR"
}

function formatCompactClassName(name: string): string {
  const normalizedName = name.trim()
  const gradeMatch = /^grade\s+(\d+)\s*([a-z])$/i.exec(normalizedName)

  if (gradeMatch) {
    const gradeLevel = gradeMatch[1] ?? ""
    const gradeSection = gradeMatch[2]?.toUpperCase() ?? ""
    return `${gradeLevel}${gradeSection}`
  }

  const compactMatch = /(\d+)\s*([a-z])/i.exec(normalizedName)

  if (compactMatch) {
    const compactLevel = compactMatch[1] ?? ""
    const compactSection = compactMatch[2]?.toUpperCase() ?? ""
    return `${compactLevel}${compactSection}`
  }

  return normalizedName
}

function parseTimeToMinutes(value: string): number {
  const [hoursPart = "0", minutesPart = "0"] = value.split(":")
  const hours = Number(hoursPart)
  const minutes = Number(minutesPart)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0
  }

  return hours * 60 + minutes
}

function getWeeklyHoursLabel(
  schedule: readonly TeacherDetailScheduleRecord[],
  formatLabel: (values: { hours: number }) => string
): string {
  const totalMinutes = schedule.reduce((sum, item) => {
    const duration = parseTimeToMinutes(item.endTime) - parseTimeToMinutes(item.startTime)
    return duration > 0 ? sum + duration : sum
  }, 0)

  return formatLabel({ hours: Math.round(totalMinutes / 60) })
}

export function TeacherDetailOverviewSection({ teacherId }: TeacherDetailOverviewSectionProps) {
  const t = useTranslations("adminTeachers.detail")
  const hasShownErrorToastRef = useRef(false)

  const teacherDetailQuery = useTeacherDetailOverviewQuery(teacherId)

  const statusLabelByType = useMemo<Record<TeacherDetailEmploymentType, string>>(
    () => ({
      full_time: t("employmentCompact.fullTime"),
      part_time: t("employmentCompact.partTime"),
      substitute: t("employmentCompact.substitute"),
    }),
    [t]
  )

  useEffect(() => {
    if (!teacherDetailQuery.isError || hasShownErrorToastRef.current) {
      return
    }

    sileo.error({
      title: t("toastErrorTitle"),
      description:
        teacherDetailQuery.error instanceof Error
          ? teacherDetailQuery.error.message
          : t("toastErrorDescription"),
    })
    hasShownErrorToastRef.current = true
  }, [t, teacherDetailQuery.error, teacherDetailQuery.isError])

  if (teacherDetailQuery.isLoading) {
    return (
      <div className="max-w-85 space-y-4">
        <Skeleton className="h-69.5 rounded-[32px]" />
        <Skeleton className="h-33 rounded-[22px]" />
      </div>
    )
  }

  if (teacherDetailQuery.isError) {
    return null
  }

  const teacher = teacherDetailQuery.data?.teacher

  if (!teacher) {
    return (
      <Card className="max-w-85 rounded-[28px] border border-slate-100 bg-white shadow-none">
        <CardContent className="px-5 py-6 text-sm text-slate-500">{t("states.empty")}</CardContent>
      </Card>
    )
  }

  const classesLabel =
    teacherDetailQuery.data?.classes.map((item) => formatCompactClassName(item.name)).join(" - ") ||
    t("notAssigned")
  const weeklyHoursLabel = getWeeklyHoursLabel(
    teacherDetailQuery.data?.schedule ?? [],
    ({ hours }) => t("weeklyHours", { hours })
  )

  return (
    <div className="max-w-75 space-y-4 bg-white p-4 pt-10 rounded-4xl">
      <ProfileOverviewCard
        avatarFallback={getAvatarFallback(teacher.fullName)}
        avatarUrl={teacher.avatar ?? undefined}
        metaLabel={weeklyHoursLabel}
        name={teacher.fullName}
        statusLabel={statusLabelByType[teacher.employmentType]}
      />

      <ProfileDetailsCard
        items={[
          {
            label: t("subject"),
            value: teacher.subject,
          },
          {
            label: t("class"),
            value: classesLabel,
          },
        ]}
      />
    </div>
  )
}
