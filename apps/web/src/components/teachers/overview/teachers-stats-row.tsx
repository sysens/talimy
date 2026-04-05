"use client"

import { Clock3, Repeat2, Timer, Users } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Skeleton, StatCard } from "@talimy/ui"

import { getTeacherOverviewStats } from "@/components/teachers/overview/teacher-overview-api"
import { teacherOverviewQueryKeys } from "@/components/teachers/overview/teacher-overview-query-keys"

export function TeachersStatsRow() {
  const locale = useLocale()
  const t = useTranslations("adminTeachers.overview.stats")

  const statsQuery = useQuery({
    queryKey: teacherOverviewQueryKeys.stats(locale),
    queryFn: () => getTeacherOverviewStats(),
    staleTime: 60_000,
  })

  if (statsQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={`teacher-stats-${index}`} className="h-[96px] rounded-[22px]" />
        ))}
      </div>
    )
  }

  const stats = statsQuery.data

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        title={t("totalTeachers")}
        tone="navy"
        value={stats?.totalTeachers ?? 0}
      />
      <StatCard
        icon={Clock3}
        title={t("fullTimeTeachers")}
        tone="pink"
        value={stats?.fullTimeTeachers ?? 0}
      />
      <StatCard
        icon={Timer}
        title={t("partTimeTeachers")}
        tone="sky"
        value={stats?.partTimeTeachers ?? 0}
      />
      <StatCard
        icon={Repeat2}
        title={t("substituteTeachers")}
        tone="gray"
        value={stats?.substituteTeachers ?? 0}
      />
    </div>
  )
}
