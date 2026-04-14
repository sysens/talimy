import { StudentDashboardAgendaSection } from "@/components/student/dashboard/student-dashboard-agenda-section"
import { StudentDashboardAssignmentsSection } from "@/components/student/dashboard/student-dashboard-assignments-section"
import { StudentDashboardGradeRadarSection } from "@/components/student/dashboard/student-dashboard-grade-radar-section"
import { StudentDashboardLessonsSection } from "@/components/student/dashboard/student-dashboard-lessons-section"
import { StudentDashboardMessagesSection } from "@/components/student/dashboard/student-dashboard-messages-section"
import { StudentDashboardMiniCalendarSection } from "@/components/student/dashboard/student-dashboard-mini-calendar-section"
import { StudentDashboardPerformanceGaugeSection } from "@/components/student/dashboard/student-dashboard-performance-gauge-section"
import { StudentDashboardScoreActivitySection } from "@/components/student/dashboard/student-dashboard-score-activity-section"
import { StudentDashboardStatsRow } from "@/components/student/dashboard/student-dashboard-stats-row"
import { StudentDashboardWelcomeSection } from "@/components/student/dashboard/student-dashboard-welcome-section"

export function StudentDashboardPageContent() {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1 space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px]">
          <StudentDashboardWelcomeSection />
          <StudentDashboardStatsRow />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
          <div className="space-y-4">
            <StudentDashboardPerformanceGaugeSection />
            <StudentDashboardLessonsSection />
          </div>
          <div className="space-y-6">
            <StudentDashboardScoreActivitySection />
            <StudentDashboardGradeRadarSection />
          </div>
        </div>

        <StudentDashboardAssignmentsSection />
      </div>

      <aside className="w-full shrink-0 space-y-4 xl:w-[280px] bg-white">
        <StudentDashboardMiniCalendarSection />
        <StudentDashboardAgendaSection />
        <StudentDashboardMessagesSection />
      </aside>
    </div>
  )
}
