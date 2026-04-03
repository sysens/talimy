import type { LucideIcon } from "lucide-react"
import { BookOpen, GraduationCap, Shield, Trophy } from "lucide-react"

import { StatCard } from "@talimy/ui"

type AdminDashboardStat = {
  icon: LucideIcon
  title: string
  tone: "navy" | "pink"
  value: string
}

const ADMIN_DASHBOARD_STATS: AdminDashboardStat[] = [
  {
    icon: GraduationCap,
    title: "Enrolled Students",
    tone: "navy",
    value: "1,245",
  },
  {
    icon: BookOpen,
    title: "Active Teachers",
    tone: "pink",
    value: "86",
  },
  {
    icon: Shield,
    title: "Support Staff",
    tone: "navy",
    value: "34",
  },
  {
    icon: Trophy,
    title: "Total Awards",
    tone: "pink",
    value: "152",
  },
]

export function AdminDashboardStatsRow() {
  return (
    <section aria-label="Dashboard statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ADMIN_DASHBOARD_STATS.map((stat) => (
        <StatCard
          key={stat.title}
          className="rounded-[22px]"
          icon={stat.icon}
          title={stat.title}
          tone={stat.tone}
          value={stat.value}
        />
      ))}
    </section>
  )
}
