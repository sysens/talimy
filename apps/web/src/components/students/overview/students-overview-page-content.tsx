import { StudentsDirectorySection } from "@/components/students/list/students-directory-section"
import { AcademicPerformanceChart } from "@/components/students/overview/academic-performance-chart"
import { EnrollmentTrendsChart } from "@/components/students/overview/enrollment-trends-chart"
import { StudentsAttendanceOverviewSection } from "@/components/students/overview/students-attendance-overview-section"
import { StudentsSpecialProgramsSection } from "@/components/students/overview/students-special-programs-section"
import { StudentsStatsRow } from "@/components/students/overview/students-stats-row"

export function StudentsOverviewPageContent() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="min-w-0 space-y-6">
        <div className="grid gap-6 xl:grid-cols-[332px_minmax(0,1fr)] xl:items-start">
          <div className="min-w-0">
            <StudentsStatsRow />
          </div>
          <div className="min-w-0">
            <AcademicPerformanceChart />
          </div>
        </div>
        <StudentsDirectorySection />
      </div>
      <div className="min-w-0 space-y-6">
        <EnrollmentTrendsChart />
        <StudentsAttendanceOverviewSection />
        <StudentsSpecialProgramsSection />
      </div>
    </div>
  )
}
