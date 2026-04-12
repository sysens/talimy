export type StudentDocumentDetailView = {
  fileName: string
  id: string
  mimeType: string
  sizeBytes: number
  storageKey: string
}

export type StudentAttendanceCalendarStatusView = "absent" | "late" | "present" | "sick"

export type StudentAttendanceCalendarMonthSummaryView = {
  label: "Absent" | "Late" | "Present" | "Sick"
  status: StudentAttendanceCalendarStatusView
  value: number
}

export type StudentAttendanceCalendarMonthView = {
  key: string
  monthNumber: number
  selectedDay: number | null
  statuses: Partial<Record<number, StudentAttendanceCalendarStatusView>>
  summary: readonly StudentAttendanceCalendarMonthSummaryView[]
  year: number
}

export type StudentScholarshipDetailView = {
  id: string
  scholarshipType: "enrichment" | "finance"
  title: string
}

export type StudentHealthRecordDetailView = {
  description: string
  id: string
  label: string
  tone: "danger" | "info" | "warning"
}

export type StudentAcademicPerformancePointView = {
  label: string
  monthKey: string
  value: number
}

export type StudentAcademicPerformanceDetailView = {
  averageScoreMax: number
  averageScoreValue: number
  note: string
  period: "last6Months" | "thisSemester"
  points: readonly StudentAcademicPerformancePointView[]
}

export type StudentExtracurricularRecordDetailView = {
  achievement: string
  advisorName: string
  clubName: string
  durationLabel: string
  iconKey: "dance" | "general" | "robotics" | "swimming"
  id: string
  roleLabel: string
}

export type StudentBehaviorLogDetailView = {
  actionStatus: "issue_warning" | "parent_notified" | "recognition_recorded" | "record_recognition"
  details: string
  entryType: "major_issue" | "minor_issue" | "positive_note"
  id: string
  recordDate: string
  reportedByLabel: string
  title: string
}
