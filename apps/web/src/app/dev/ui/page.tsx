import { Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { AttendanceOverviewChartShowcase433 } from "@/components/shared/ui-showcase/attendance-overview-chart-4-3-3"
import { AttendanceProgressChartShowcase433 } from "@/components/shared/ui-showcase/attendance-progress-chart-4-3-3"
import { AttendanceRosterGridCardShowcase } from "@/components/shared/ui-showcase/attendance-roster-grid-card-showcase"
import { DataTableShowcase42 } from "@/components/shared/ui-showcase/data-table-4-2"
import { DocumentsListCardShowcase } from "@/components/shared/ui-showcase/documents-list-card-showcase"
import { EarningsExpensesChartShowcase433 } from "@/components/shared/ui-showcase/earnings-expenses-chart-4-3-3"
import { EventsListShowcase } from "@/components/shared/ui-showcase/events-list-showcase"
import { FeesProgressCardShowcase } from "@/components/shared/ui-showcase/fees-progress-card-showcase"
import { FeesCollectionTrendChartShowcase433 } from "@/components/shared/ui-showcase/area-gradient"
import { ExpenseBreakdownDonutCardShowcase } from "@/components/shared/ui-showcase/expense-breakdown-donut-card-showcase"
import { ExpenseTrendChartCardShowcase } from "@/components/shared/ui-showcase/expense-trend-chart-card-showcase"
import { ExpensesTableCardShowcase } from "@/components/shared/ui-showcase/expenses-table-card-showcase"
import { FullStackedRadialChartShowcase433 } from "@/components/shared/ui-showcase/full-stacked-radial-4-3-3"
import { GenderDistributionChartShowcase433 } from "@/components/shared/ui-showcase/gender-distribution-chart-4-3-3"
import { AdminDashboardTodoListSection } from "@/components/dashboard/admin/admin-dashboard-todo-list-section"
import { AcademicPerformanceGroupedChartShowcase433 } from "@/components/shared/ui-showcase/academic-performance-grouped-chart-4-3-3"
import { AdminCalendarPageShowcase } from "@/components/shared/ui-showcase/admin-calendar-page-showcase"
import { NoticeBoardHerouiTableShowcase } from "@/components/shared/ui-showcase/notice-board-heroui-table"
import { PrimitivesShowcase411 } from "@/components/shared/ui-showcase/primitives-4-1-1"
import { PrimitivesShowcase412 } from "@/components/shared/ui-showcase/primitives-4-1-2"
import { PrimitivesShowcase413 } from "@/components/shared/ui-showcase/primitives-4-1-3"
import { PrimitivesShowcase414 } from "@/components/shared/ui-showcase/primitives-4-1-4"
import { PrimitivesShowcase415 } from "@/components/shared/ui-showcase/primitives-4-1-5"
import { PrimitivesShowcase416 } from "@/components/shared/ui-showcase/primitives-4-1-6"
import { MiniChartShowcase433 } from "@/components/shared/ui-showcase/mini-chart-4-3-3"
import { RecentActivityShowcase } from "@/components/shared/ui-showcase/recent-activity-showcase"
import { RecordsTableCardShowcase } from "@/components/shared/ui-showcase/records-table-card-showcase"
import { RequestDecisionCardShowcase } from "@/components/shared/ui-showcase/request-decision-card-showcase"
import { MetricProgressCardShowcase } from "@/components/shared/ui-showcase/metric-progress-card-showcase"
import { StatCardShowcase431 } from "@/components/shared/ui-showcase/stat-card-4-3-1"
import { StudentAcademicPerformanceChartShowcase433 } from "@/components/shared/ui-showcase/student-academic-performance-chart-4-3-3"
import { AttendanceSummaryCardsShowcase } from "@/components/shared/ui-showcase/attendance-summary-cards-showcase"
import { ReimbursementsTableCardShowcase } from "@/components/shared/ui-showcase/reimbursements-table-card-showcase"
import { StudentCreateFormShowcase } from "@/components/shared/ui-showcase/student-create-form-showcase"
import { StudentDashboardPageShowcase } from "@/components/shared/ui-showcase/student-dashboard-page-showcase"
import { StudentDetailPageShowcase } from "@/components/shared/ui-showcase/student-detail-page-showcase"
import { CalendarWidgetShowcase } from "@/components/shared/ui-showcase/calendar-widget-showcase"
import { ProfileDetailsCardShowcase } from "@/components/shared/ui-showcase/profile-details-card-showcase"
import { ProfileOverviewCardShowcase } from "@/components/shared/ui-showcase/profile-overview-card-showcase"
import { PersonalInfoCardShowcase } from "@/components/shared/ui-showcase/personal-info-card-showcase"
import { TeacherAttendanceChartShowcase433 } from "@/components/shared/ui-showcase/teacher-attendance-chart-4-3-3"
import { TeacherDepartmentChartShowcase433 } from "@/components/shared/ui-showcase/teacher-department-chart-4-3-3"
import { TeacherCardShowcase } from "@/components/shared/ui-showcase/teacher-card-showcase"
import { TeacherProfileWorkloadChartShowcase433 } from "@/components/shared/ui-showcase/teacher-profile-workload-chart-4-3-3"
import { TeachersFilterBarShowcase } from "@/components/shared/ui-showcase/teachers-filter-bar-showcase"
import { TeachersGridShowcase } from "@/components/shared/ui-showcase/teachers-grid-showcase"
import { TeachersPaginationShowcase } from "@/components/shared/ui-showcase/teachers-pagination-showcase"
import { TeachersResultsSummaryShowcase } from "@/components/shared/ui-showcase/teachers-results-summary-showcase"
import { TeacherCreateFormShowcase } from "@/components/shared/ui-showcase/teacher-create-form-showcase"
import { TimetableGridCardShowcase } from "@/components/shared/ui-showcase/timetable-grid-card-showcase"
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

      <Card>
        <CardHeader>
          <CardTitle>Task 7.1.5 / 7.1.6 / 7.1.8 - Teachers List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TeachersFilterBarShowcase />
          <TeacherCardShowcase />
          <TeachersGridShowcase />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TeachersResultsSummaryShowcase />
            <TeachersPaginationShowcase />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Task 7.2.1 / 7.2.2 / 7.2.3 / 7.2.4 / 7.2.9 - Profile Detail Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-full max-w-[320px] space-y-4">
              <ProfileOverviewCardShowcase />
              <ProfileDetailsCardShowcase />
            </div>
            <PersonalInfoCardShowcase />
            <DocumentsListCardShowcase />
            <RequestDecisionCardShowcase />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 7.2.6 - Weekly Schedule Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableGridCardShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 7.2.7 - Development & Training</CardTitle>
        </CardHeader>
        <CardContent>
          <RecordsTableCardShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 7.2.10 - Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricProgressCardShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 7.3.1 - 7.3.7 Add Teacher Page</CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherCreateFormShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 8.2.1 - 8.2.11 Student Detail Page</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentDetailPageShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 8.3.1 - 8.3.9 Add Student Page</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentCreateFormShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 9.1.1 - Attendance Summary Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceSummaryCardsShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 9.1.4 - Attendance Calendar Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceRosterGridCardShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 9.2.3 - Fees Collection Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <FeesProgressCardShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 9.3.1 - 9.3.5 Finance Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <ExpenseTrendChartCardShowcase />
            <ReimbursementsTableCardShowcase />
          </div>
          <ExpenseBreakdownDonutCardShowcase />
          <ExpensesTableCardShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 9.6.1 - 9.6.7 Calendar Page</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCalendarPageShowcase />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task 10.2.1 - 10.2.10 Student Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentDashboardPageShowcase />
        </CardContent>
      </Card>
    </main>
  )
}
