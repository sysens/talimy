import { Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { AttendanceOverviewChartShowcase433 } from "@/components/shared/ui-showcase/attendance-overview-chart-4-3-3"
import { AttendanceProgressChartShowcase433 } from "@/components/shared/ui-showcase/attendance-progress-chart-4-3-3"
import { DataTableShowcase42 } from "@/components/shared/ui-showcase/data-table-4-2"
import { EarningsExpensesChartShowcase433 } from "@/components/shared/ui-showcase/earnings-expenses-chart-4-3-3"
import { EventsListShowcase } from "@/components/shared/ui-showcase/events-list-showcase"
import { FeesCollectionTrendChartShowcase433 } from "@/components/shared/ui-showcase/area-gradient"
import { FullStackedRadialChartShowcase433 } from "@/components/shared/ui-showcase/full-stacked-radial-4-3-3"
import { GenderDistributionChartShowcase433 } from "@/components/shared/ui-showcase/gender-distribution-chart-4-3-3"
import { AdminDashboardTodoListSection } from "@/components/dashboard/admin/admin-dashboard-todo-list-section"
import { AcademicPerformanceGroupedChartShowcase433 } from "@/components/shared/ui-showcase/academic-performance-grouped-chart-4-3-3"
import { NoticeBoardHerouiTableShowcase } from "@/components/shared/ui-showcase/notice-board-heroui-table"
import { PrimitivesShowcase411 } from "@/components/shared/ui-showcase/primitives-4-1-1"
import { PrimitivesShowcase412 } from "@/components/shared/ui-showcase/primitives-4-1-2"
import { PrimitivesShowcase413 } from "@/components/shared/ui-showcase/primitives-4-1-3"
import { PrimitivesShowcase414 } from "@/components/shared/ui-showcase/primitives-4-1-4"
import { PrimitivesShowcase415 } from "@/components/shared/ui-showcase/primitives-4-1-5"
import { PrimitivesShowcase416 } from "@/components/shared/ui-showcase/primitives-4-1-6"
import { MiniChartShowcase433 } from "@/components/shared/ui-showcase/mini-chart-4-3-3"
import { RecentActivityShowcase } from "@/components/shared/ui-showcase/recent-activity-showcase"
import { StatCardShowcase431 } from "@/components/shared/ui-showcase/stat-card-4-3-1"
import { StudentAcademicPerformanceChartShowcase433 } from "@/components/shared/ui-showcase/student-academic-performance-chart-4-3-3"
import { CalendarWidgetShowcase } from "@/components/shared/ui-showcase/calendar-widget-showcase"
import { TeacherAttendanceChartShowcase433 } from "@/components/shared/ui-showcase/teacher-attendance-chart-4-3-3"
import { TeacherDepartmentChartShowcase433 } from "@/components/shared/ui-showcase/teacher-department-chart-4-3-3"
import { TeacherProfileWorkloadChartShowcase433 } from "@/components/shared/ui-showcase/teacher-profile-workload-chart-4-3-3"
import { TeacherWorkloadChartShowcase433 } from "@/components/shared/ui-showcase/teacher-workload-chart-4-3-3"
import { ThemePreviewToggle } from "@/components/shared/ui-showcase/theme-preview-toggle"

export default function UiShowcasePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">UI Showcase</h1>
          <p className="text-sm text-muted-foreground">
            FAZA 4 preview sahifasi. Komponentlar tasklar bo&apos;yicha ketma-ket qo&apos;shiladi.
          </p>
        </div>
        <ThemePreviewToggle />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.1 - Core Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase411 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.2 - Overlays & Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase412 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.3 - Display Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase413 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.4 - Layout + Data Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase414 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.5 - Form + Feedback Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase415 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.1.6 - Navigation + Analytics Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <PrimitivesShowcase416 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.2 - Data Table Components</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTableShowcase42 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.3.1 - Stat Card</CardTitle>
        </CardHeader>
        <CardContent>
          <StatCardShowcase431 />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 4.3.3 - Mini Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 xl:grid-cols-2">
            <MiniChartShowcase433 />
            <EarningsExpensesChartShowcase433 />
            <GenderDistributionChartShowcase433 />
            <AttendanceOverviewChartShowcase433 />
            <AttendanceProgressChartShowcase433 />
            <FeesCollectionTrendChartShowcase433 />
            <FullStackedRadialChartShowcase433 />
            <TeacherAttendanceChartShowcase433 />
            <StudentAcademicPerformanceChartShowcase433 />
            <TeacherWorkloadChartShowcase433 />
            <TeacherDepartmentChartShowcase433 />
            <TeacherProfileWorkloadChartShowcase433 />
            <AcademicPerformanceGroupedChartShowcase433 />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

              <div className="max-w-sm">
                <AdminDashboardTodoListSection />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 6.2.7 - Notice Board</CardTitle>
        </CardHeader>
        <CardContent>
          <NoticeBoardHerouiTableShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 6.2.8 - Mini Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-start gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Admin / Event Calendar
              </h3>
              <CalendarWidgetShowcase />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Teacher Detail / Attendance Calendar
              </h3>
              <CalendarWidgetShowcase variant="attendance" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Task 6.2.9 - Events (Agenda)
              </h3>
              <EventsListShowcase />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Task 6.2.10 - Recent Activity
              </h3>
              <RecentActivityShowcase />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
