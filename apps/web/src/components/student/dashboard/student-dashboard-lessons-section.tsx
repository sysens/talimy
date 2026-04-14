"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { getStudentDashboardLessons } from "@/components/student/dashboard/student-dashboard-api"
import { mapStudentLessonSections } from "@/components/student/dashboard/student-dashboard.mappers"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { LessonsOverviewCard } from "@/components/shared/schedule/lessons-overview-card"

export function StudentDashboardLessonsSection() {
  const t = useTranslations("studentDashboard.lessons")
  const lessonsQuery = useQuery({
    queryFn: () => getStudentDashboardLessons(),
    queryKey: studentDashboardQueryKeys.lessons(),
    staleTime: 60_000,
  })

  if (lessonsQuery.isLoading) {
    return <Skeleton className="h-[360px] rounded-[28px]" />
  }

  if (!lessonsQuery.data) {
    return null
  }

  return (
    <LessonsOverviewCard
      emptyLabel={t("empty")}
      sections={mapStudentLessonSections(
        {
          today: t("today"),
          tomorrow: t("tomorrow"),
        },
        lessonsQuery.data
      )}
      title={t("title")}
    />
  )
}
