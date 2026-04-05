export type TeacherDocumentDetailView = {
  id: string
  fileName: string
  mimeType: string
  sizeBytes: number
  storageKey: string
}

export type TeacherWorkloadDetailDataset = "last8Months" | "thisSemester"

export type TeacherWorkloadSnapshotDetailView = {
  extraDuties: number
  id: string
  label: string
  periodDate: string
  teachingHours: number
  totalClasses: number
}

export type TeacherTrainingStatusView = "cancelled" | "completed" | "upcoming"

export type TeacherTrainingDetailView = {
  eventDate: string
  id: string
  locationLabel: string
  status: TeacherTrainingStatusView
  subtitle: string
  title: string
}

export type TeacherAttendanceCalendarStatusView = "late" | "onLeave" | "present"

export type TeacherAttendanceCalendarMonthSummaryView = {
  label: "Late" | "On Leave" | "Present"
  status: TeacherAttendanceCalendarStatusView
  value: number
}

export type TeacherAttendanceCalendarMonthView = {
  key: string
  monthNumber: number
  selectedDay: number | null
  statuses: Partial<Record<number, TeacherAttendanceCalendarStatusView>>
  summary: readonly TeacherAttendanceCalendarMonthSummaryView[]
  year: number
}

export type TeacherLeaveRequestTypeView =
  | "annual_leave"
  | "personal_leave"
  | "sick_leave"
  | "unpaid_leave"

export type TeacherLeaveRequestStatusView = "approved" | "declined" | "pending"

export type TeacherLeaveRequestDetailView = {
  endDate: string
  id: string
  reason: string
  requestType: TeacherLeaveRequestTypeView
  startDate: string
  status: TeacherLeaveRequestStatusView
}

export type TeacherPerformancePeriodView = "lastMonth" | "lastQuarter"

export type TeacherPerformanceDetailView = {
  gradingTimelinessTarget: number
  gradingTimelinessValue: number
  period: TeacherPerformancePeriodView
  studentAverageGradeTarget: number
  studentAverageGradeValue: number
  studentFeedbackTarget: number
  studentFeedbackValue: number
}
