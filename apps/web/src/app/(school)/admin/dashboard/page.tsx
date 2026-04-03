import { AdminDashboardEarningsSection } from "@/components/dashboard/admin/admin-dashboard-earnings-section"
import { AdminDashboardStudentPerformanceSection } from "@/components/dashboard/admin/admin-dashboard-student-performance-section"
import { AdminDashboardStatsRow } from "@/components/dashboard/admin/admin-dashboard-stats-row"

export default function Page() {
  return (
    <div className="flex gap-6 py-1 xl:items-start">
      <div className="min-w-0 flex-1">
        <div className="space-y-6">
          <AdminDashboardStatsRow />
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminDashboardStudentPerformanceSection />
            <AdminDashboardEarningsSection />
          </div>
        </div>
      </div>
      <aside aria-label="Dashboard sidebar" className="hidden w-52 shrink-0 xl:block" />
    </div>
  )
}
