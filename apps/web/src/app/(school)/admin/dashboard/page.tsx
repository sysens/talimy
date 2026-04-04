import { AdminDashboardEarningsSection } from "@/components/dashboard/admin/admin-dashboard-earnings-section"
import { AdminDashboardNoticeBoardSection } from "@/components/dashboard/admin/admin-dashboard-notice-board-section"
import { AdminDashboardRightPanel } from "@/components/dashboard/admin/admin-dashboard-right-panel"
import { AdminDashboardStudentAttendanceSection } from "@/components/dashboard/admin/admin-dashboard-student-attendance-section"
import { AdminDashboardStudentPerformanceSection } from "@/components/dashboard/admin/admin-dashboard-student-performance-section"
import { AdminDashboardStudentsByGenderSection } from "@/components/dashboard/admin/admin-dashboard-students-by-gender-section"
import { AdminDashboardStatsRow } from "@/components/dashboard/admin/admin-dashboard-stats-row"
import { AdminDashboardTodoListSection } from "@/components/dashboard/admin/admin-dashboard-todo-list-section"

export default function Page() {
  return (
    <div className="flex flex-col gap-6 py-1 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1">
        <div className="space-y-6">
          <AdminDashboardStatsRow />
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminDashboardStudentPerformanceSection />
            <AdminDashboardEarningsSection />
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <AdminDashboardStudentsByGenderSection />
            <AdminDashboardStudentAttendanceSection />
            <AdminDashboardTodoListSection />
          </div>
          <AdminDashboardNoticeBoardSection />
        </div>
      </div>
      <AdminDashboardRightPanel />
    </div>
  )
}
