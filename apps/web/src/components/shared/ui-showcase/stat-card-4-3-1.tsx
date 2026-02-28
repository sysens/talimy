"use client"

import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  CircleDollarSign,
  Clock3,
  FileText,
  Flag,
  GraduationCap,
  Hourglass,
  LayoutGrid,
  Shield,
  Timer,
  Trophy,
  UserMinus,
  Users,
} from "lucide-react"
import { StatCard } from "@talimy/ui"


export function StatCardShowcase431() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/platform/dashboard</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Shield} title="Schools" tone="navy" value="24" />
          <StatCard icon={GraduationCap} title="Students" tone="pink" value="8,432" />
          <StatCard icon={CircleDollarSign} title="MRR" tone="sky" value="$48,200" />
          <StatCard icon={BadgeCheck} title="Active" tone="pink" value="21" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/admin/teachers</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} title="Total Teachers" tone="navy" value="86" />
          <StatCard icon={Clock3} title="Full-Time Teacher" tone="pink" value="62" />
          <StatCard icon={Timer} title="Part-Time Teacher" tone="sky" value="18" />
          <StatCard icon={UserMinus} title="Substitute Teacher" tone="pink" value="6" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={GraduationCap} title="Enrolled Students" tone="navy" value="1,245" />
          <StatCard icon={BookOpen} title="Active Teachers" tone="pink" value="86" />
          <StatCard icon={Shield} title="Support Staff" tone="navy" value="34" />
          <StatCard icon={Trophy} title="Total Awards" tone="pink" value="152" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/admin/students</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard active icon={Users} title="Total Students" tone="pink" value="1,245" variant="stacked"/>
          <StatCard icon={Clock3} title="Grade 7 Students" tone="sky" value="410" variant="stacked" />
          <StatCard icon={Clock3} title="Grade 8 Students" tone="navy" value="415" variant="stacked" />
          <StatCard icon={Clock3} title="Grade 9 Students" tone="pink" value="420" variant="stacked"/>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/admin/calendar</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard active icon={LayoutGrid} title="All Schedules" tone="sky" value="12" variant="pill" />
          <StatCard icon={BookOpen} title="Academic" tone="pink" value="4" variant="pill" />
          <StatCard icon={Flag} title="Events" tone="sky" value="3" variant="pill" />
          <StatCard icon={CircleDollarSign} title="Finance" tone="navy" value="2" variant="pill" />
          <StatCard icon={FileText} title="Administration" tone="pink" value="3" variant="pill" />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">/admin/finance/payments</h3>
          <div className="max-w-sm space-y-3">
            <StatCard icon={BadgeCheck} title="Fees Collected" tone="navy" value="$92,500" variant="finance" />
            <StatCard icon={Hourglass} title="Pending Fees" tone="sky" value="$12,300" variant="finance" />
            <StatCard icon={AlertCircle} title="Overdue Payments" tone="pink" value="$4,750" variant="finance"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">/admin/finance</h3>
          <div className="max-w-sm space-y-3">
            <StatCard icon={CircleDollarSign} title="Total Fees" tone="navy" value="$109,550" variant="finance" />
            <StatCard icon={BadgeCheck} title="Collected" tone="sky" value="$92,500" variant="finance" />
            <StatCard icon={AlertCircle} title="Debt" tone="pink" value="$17,050" variant="finance" />
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/teacher/dashboard</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} title="My Students" tone="navy" value="124" />
          <StatCard icon={LayoutGrid} title="Today&apos;s Classes" tone="pink" value="6" />
          <StatCard icon={FileText} title="Pending Assignments" tone="sky" value="18" />
          <StatCard icon={BadgeCheck} title="Attendance" tone="pink" value="95%" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/student/dashboard</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={BadgeCheck} title="Attendance" tone="navy" value="97%" />
          <StatCard icon={FileText} title="Task Completed" tone="pink" value="258+" />
          <StatCard icon={Timer} title="In Progress" tone="sky" value="64%" />
          <StatCard icon={Trophy} title="Reward Points" tone="pink" value="245" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">/parent/dashboard</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={BadgeCheck} title="Child Attendance" tone="navy" value="97%" />
          <StatCard icon={BookOpen} title="Tasks Completed" tone="pink" value="258+" />
          <StatCard icon={Timer} title="In Progress" tone="sky" value="64%" />
          <StatCard icon={Trophy} title="Reward Points" tone="pink" value="245" />
        </div>
      </section>
    </div>
  )
}
