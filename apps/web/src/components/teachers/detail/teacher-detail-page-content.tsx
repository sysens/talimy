"use client"

import { TeacherDetailAttendanceCalendarSection } from "@/components/teachers/detail/teacher-detail-attendance-calendar-section"
import { TeacherDetailDocumentsSection } from "@/components/teachers/detail/teacher-detail-documents-section"
import { TeacherDetailLeaveRequestSection } from "@/components/teachers/detail/teacher-detail-leave-request-section"
import { TeacherDetailOverviewSection } from "@/components/teachers/detail/teacher-detail-overview-section"
import { TeacherDetailPerformanceSection } from "@/components/teachers/detail/teacher-detail-performance-section"
import { TeacherDetailPersonalInfoSection } from "@/components/teachers/detail/teacher-detail-personal-info-section"
import { TeacherDetailScheduleSection } from "@/components/teachers/detail/teacher-detail-schedule-section"
import { TeacherDetailTrainingSection } from "@/components/teachers/detail/teacher-detail-training-section"
import { TeacherDetailWorkloadSummarySection } from "@/components/teachers/detail/teacher-detail-workload-summary-section"

type TeacherDetailPageContentProps = {
  teacherId: string
}

export function TeacherDetailPageContent({ teacherId }: TeacherDetailPageContentProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_288px] xl:items-start">
      <div className="w-full max-w-75 space-y-4">
        <TeacherDetailOverviewSection teacherId={teacherId} />
        <TeacherDetailPersonalInfoSection teacherId={teacherId} />
        <TeacherDetailDocumentsSection teacherId={teacherId} />
      </div>

      <div className="min-w-0 space-y-4">
        <TeacherDetailWorkloadSummarySection teacherId={teacherId} />
        <TeacherDetailScheduleSection teacherId={teacherId} />
        <TeacherDetailTrainingSection teacherId={teacherId} />
      </div>

      <div className="w-full max-w-72 space-y-4">
        <TeacherDetailAttendanceCalendarSection teacherId={teacherId} />
        <TeacherDetailLeaveRequestSection teacherId={teacherId} />
        <TeacherDetailPerformanceSection teacherId={teacherId} />
      </div>
    </div>
  )
}
