"use client"

import { useQuery } from "@tanstack/react-query"
import { Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Skeleton, StatCard, cn } from "@talimy/ui"

import { getStudentsStats } from "@/components/students/overview/students-overview-api"
import { studentsOverviewQueryKeys } from "@/components/students/overview/students-overview-query-keys"

type GradeBadgeIconProps = {
  className?: string
  value: string
}

function GradeBadgeIcon({ className, value }: GradeBadgeIconProps) {
  return (
    <span
      className={cn(
        "inline-flex h-full w-full items-center justify-center rounded-full border border-current text-[11px] font-semibold leading-none",
        className
      )}
    >
      {value}
    </span>
  )
}

export function StudentsStatsRow() {
  const t = useTranslations("adminStudents.overview.stats")
  const statsQuery = useQuery({
    queryFn: getStudentsStats,
    queryKey: studentsOverviewQueryKeys.stats(),
    staleTime: 60_000,
  })

  if (statsQuery.isLoading) {
    return (
      <div className="grid max-w-[332px] grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-[146px] rounded-[28px]" key={`student-stat-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  const stats = statsQuery.data ?? {
    grade7Students: 0,
    grade8Students: 0,
    grade9Students: 0,
    totalStudents: 0,
  }

  return (
    <div className="grid max-w-[332px] grid-cols-2 gap-4">
      <StatCard
        active
        icon={Users}
        title={t("totalStudents")}
        tone="pink"
        value={stats.totalStudents.toLocaleString()}
        variant="stacked"
      />
      <StatCard
        icon={<GradeBadgeIcon value="7" />}
        title={t("grade7Students")}
        tone="sky"
        value={stats.grade7Students.toLocaleString()}
        variant="stacked"
      />
      <StatCard
        icon={<GradeBadgeIcon value="8" />}
        title={t("grade8Students")}
        tone="navy"
        value={stats.grade8Students.toLocaleString()}
        variant="stacked"
      />
      <StatCard
        icon={<GradeBadgeIcon value="9" />}
        title={t("grade9Students")}
        tone="pink"
        value={stats.grade9Students.toLocaleString()}
        variant="stacked"
      />
    </div>
  )
}
