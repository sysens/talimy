import { AttendanceOverviewChart } from "@/components/teachers/overview/attendance-overview-chart"
import { DepartmentDonutChart } from "@/components/teachers/overview/department-donut-chart"
import { TeachersDirectorySection } from "@/components/teachers/list/teachers-directory-section"
import { TeachersStatsRow } from "@/components/teachers/overview/teachers-stats-row"
import { WorkloadDistributionChart } from "@/components/teachers/overview/workload-distribution-chart"

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_272px] xl:items-start">
        <div className="min-w-0 space-y-6">
          <TeachersStatsRow />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
            <AttendanceOverviewChart />
            <WorkloadDistributionChart />
          </div>
        </div>
        <DepartmentDonutChart />
      </div>
      <TeachersDirectorySection />
    </div>
  )
}
