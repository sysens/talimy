export type StudentDetailRecord = {
  address: string | null
  avatar: string | null
  bloodGroup: string | null
  className: string | null
  dateOfBirth: string | null
  email: string
  enrollmentDate: string
  fullName: string
  gender: "female" | "male"
  id: string
  phone: string | null
  status: "active" | "graduated" | "inactive" | "transferred"
  studentId: string
}

export type StudentGuardianRecord = {
  fullName: string
  id: string
  phone: string | null
  relationship: string
}

export type StudentDetailOverviewResponse = {
  guardians: readonly StudentGuardianRecord[]
  student: StudentDetailRecord
}

export type StudentDetailDocumentRecord = {
  fileName: string
  id: string
  mimeType: string
  sizeBytes: number
  storageKey: string
}

export type StudentDetailAttendanceCalendarStatus = "absent" | "late" | "present" | "sick"

export type StudentDetailAttendanceCalendarMonthRecord = {
  key: string
  monthNumber: number
  selectedDay: number | null
  statuses: Partial<Record<number, StudentDetailAttendanceCalendarStatus>>
  summary: ReadonlyArray<{
    label: "Absent" | "Late" | "Present" | "Sick"
    status: StudentDetailAttendanceCalendarStatus
    value: number
  }>
  year: number
}

export type StudentDetailScholarshipRecord = {
  id: string
  scholarshipType: "enrichment" | "finance"
  title: string
}

export type StudentDetailHealthRecord = {
  description: string
  id: string
  label: string
  tone: "danger" | "info" | "warning"
}

export type StudentDetailAcademicPerformancePeriod = "last6Months" | "thisSemester"

export type StudentDetailAcademicPerformanceRecord = {
  averageScoreMax: number
  averageScoreValue: number
  note: string
  period: StudentDetailAcademicPerformancePeriod
  points: ReadonlyArray<{
    label: string
    monthKey: string
    value: number
  }>
}

export type StudentDetailExtracurricularRecord = {
  achievement: string
  advisorName: string
  clubName: string
  durationLabel: string
  iconKey: "dance" | "general" | "robotics" | "swimming"
  id: string
  roleLabel: string
}

export type StudentDetailBehaviorLogRecord = {
  actionStatus: "issue_warning" | "parent_notified" | "recognition_recorded" | "record_recognition"
  details: string
  entryType: "major_issue" | "minor_issue" | "positive_note"
  id: string
  recordDate: string
  reportedByLabel: string
  title: string
}
