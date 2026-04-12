"use client"

import { StudentDetailAcademicPerformanceSection } from "@/components/students/detail/student-detail-academic-performance-section"
import { StudentDetailAttendanceCalendarSection } from "@/components/students/detail/student-detail-attendance-calendar-section"
import { StudentDetailBehaviorLogSection } from "@/components/students/detail/student-detail-behavior-log-section"
import { StudentDetailDocumentsSection } from "@/components/students/detail/student-detail-documents-section"
import { StudentDetailExtracurricularSection } from "@/components/students/detail/student-detail-extracurricular-section"
import { StudentDetailGuardianSection } from "@/components/students/detail/student-detail-guardian-section"
import { StudentDetailHealthSection } from "@/components/students/detail/student-detail-health-section"
import { StudentDetailProfileSection } from "@/components/students/detail/student-detail-profile-section"
import { StudentDetailScholarshipsSection } from "@/components/students/detail/student-detail-scholarships-section"

type StudentDetailPageContentProps = {
  studentId: string
}

export function StudentDetailPageContent({ studentId }: StudentDetailPageContentProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[280px_300px_minmax(0,1fr)] xl:items-start">
      <div className="min-w-0 space-y-4">
        <StudentDetailProfileSection studentId={studentId} />
        <StudentDetailGuardianSection studentId={studentId} />
        <StudentDetailDocumentsSection studentId={studentId} />
      </div>

      <div className="min-w-0 space-y-4">
        <StudentDetailAttendanceCalendarSection studentId={studentId} />
        <StudentDetailScholarshipsSection studentId={studentId} />
        <StudentDetailHealthSection studentId={studentId} />
      </div>

      <div className="min-w-0 space-y-4">
        <StudentDetailAcademicPerformanceSection studentId={studentId} />
        <StudentDetailExtracurricularSection studentId={studentId} />
        <StudentDetailBehaviorLogSection studentId={studentId} />
      </div>
    </div>
  )
}
