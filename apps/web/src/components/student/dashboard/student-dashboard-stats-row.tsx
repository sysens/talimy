"use client"

import type { LucideIcon } from "lucide-react"
import { AlarmClockCheck, Award, CheckSquare2, ListTodo } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton, StatCard } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { getStudentDashboardStats } from "@/components/student/dashboard/student-dashboard-api"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"

type StudentDashboardStatConfig = {
  icon: LucideIcon
  key: "attendancePercentage" | "rewardPoints" | "taskCompletedCount" | "taskInProgressPercentage"
  tone: "pink" | "sky"
}

const STUDENT_DASHBOARD_STATS: readonly StudentDashboardStatConfig[] = [
  { icon: AlarmClockCheck, key: "attendancePercentage", tone: "sky" },
  { icon: CheckSquare2, key: "taskCompletedCount", tone: "sky" },
  { icon: ListTodo, key: "taskInProgressPercentage", tone: "pink" },
  { icon: Award, key: "rewardPoints", tone: "pink" },
] as const

export function StudentDashboardStatsRow() {
  const locale = useLocale()
  const t = useTranslations("studentDashboard.stats")
  const statsQuery = useQuery({
    queryFn: () => getStudentDashboardStats(),
    queryKey: studentDashboardQueryKeys.stats(),
    staleTime: 60_000,
  })

  if (statsQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {STUDENT_DASHBOARD_STATS.map((item) => (
          <Skeleton className="h-[96px] rounded-[22px]" key={item.key} />
        ))}
      </div>
    )
  }

  if (!statsQuery.data) {
    return null
  }

  const stats = statsQuery.data

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {STUDENT_DASHBOARD_STATS.map((item) => (
        <StatCard
          className="h-fit rounded-[22px]"
          icon={item.icon}
          key={item.key}
          title={t(item.key)}
          tone={item.tone}
          value={formatStudentStatValue(locale, item.key, stats[item.key])}
          variant="finance"
        />
      ))}
    </div>
  )
}

function formatStudentStatValue(
  locale: string,
  key: StudentDashboardStatConfig["key"],
  value: number
) {
  if (key === "attendancePercentage" || key === "taskInProgressPercentage") {
    return `${value.toFixed(0)}%`
  }

  if (key === "taskCompletedCount") {
    return `${value.toLocaleString(locale)}+`
  }

  return value.toLocaleString(locale)
}
