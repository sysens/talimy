"use client"

import type { LucideIcon } from "lucide-react"
import { BookOpen, GraduationCap, Shield, Trophy } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { Skeleton, StatCard } from "@talimy/ui"

import { getAdminDashboardStats } from "@/components/dashboard/admin/dashboard-api"
import { adminDashboardQueryKeys } from "@/components/dashboard/admin/dashboard-query-keys"
import type { AppLocale } from "@/config/site"

type AdminDashboardStat = {
  icon: LucideIcon
  key: "activeTeachers" | "enrolledStudents" | "supportStaff" | "totalAwards"
  tone: "navy" | "pink"
  value: number
}

const ADMIN_DASHBOARD_STATS: readonly AdminDashboardStat[] = [
  {
    icon: GraduationCap,
    key: "enrolledStudents",
    tone: "navy",
    value: 0,
  },
  {
    icon: BookOpen,
    key: "activeTeachers",
    tone: "pink",
    value: 0,
  },
  {
    icon: Shield,
    key: "supportStaff",
    tone: "navy",
    value: 0,
  },
  {
    icon: Trophy,
    key: "totalAwards",
    tone: "pink",
    value: 0,
  },
] as const

export function AdminDashboardStatsRow() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("adminDashboard")

  const localizedStats = useMemo(
    () => ({
      activeTeachers: t("stats.activeTeachers"),
      enrolledStudents: t("stats.enrolledStudents"),
      supportStaff: t("stats.supportStaff"),
      totalAwards: t("stats.totalAwards"),
    }),
    [t]
  )

  const statsQuery = useQuery({
    queryKey: adminDashboardQueryKeys.stats(locale),
    queryFn: () => getAdminDashboardStats(),
    refetchInterval: 60_000,
  })

  const stats = useMemo(
    () =>
      ADMIN_DASHBOARD_STATS.map((stat) => ({
        ...stat,
        title: localizedStats[stat.key],
        value: statsQuery.data?.[stat.key] ?? 0,
      })),
    [localizedStats, statsQuery.data]
  )

  return (
    <section
      aria-label={t("stats.sectionAriaLabel")}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {statsQuery.isLoading
        ? ADMIN_DASHBOARD_STATS.map((stat) => (
            <Skeleton key={stat.key} className="h-[126px] rounded-[22px]" />
          ))
        : stats.map((stat) => (
            <StatCard
              key={stat.key}
              className="rounded-[22px]"
              icon={stat.icon}
              title={stat.title}
              tone={stat.tone}
              value={stat.value.toLocaleString(locale)}
            />
          ))}
    </section>
  )
}
