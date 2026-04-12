import { AdminAttendanceGridSection } from "@/components/attendance/admin/admin-attendance-grid-section"
import { AdminAttendanceSummarySection } from "@/components/attendance/admin/admin-attendance-summary-section"

export function AdminAttendancePageContent() {
  return (
    <div className="space-y-6">
      <AdminAttendanceSummarySection />
      <AdminAttendanceGridSection />
    </div>
  )
}
