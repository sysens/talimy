export type TeacherDetailEmploymentType = "full_time" | "part_time" | "substitute"

export type TeacherDetailRecord = {
  address: string | null
  avatar: string | null
  dateOfBirth: string | null
  email: string
  employeeId: string
  employmentType: TeacherDetailEmploymentType
  fullName: string
  gender: "female" | "male"
  id: string
  phone: string | null
  subject: string
}

export type TeacherDetailClassRecord = {
  id: string
  name: string
}

export type TeacherDetailScheduleRecord = {
  className: string
  dayOfWeek: "friday" | "monday" | "thursday" | "tuesday" | "wednesday"
  endTime: string
  id: string
  startTime: string
}

export type TeacherDetailOverviewResponse = {
  classes: readonly TeacherDetailClassRecord[]
  schedule: readonly TeacherDetailScheduleRecord[]
  teacher: TeacherDetailRecord
}

export type TeacherDetailDocumentRecord = {
  fileName: string
  id: string
  mimeType: string
  sizeBytes: number
  storageKey: string
}

export type TeacherDetailWorkloadRange = "last8Months" | "thisSemester"

export type TeacherDetailWorkloadRecord = {
  extraDuties: number
  id: string
  label: string
  periodDate: string
  teachingHours: number
  totalClasses: number
}

export type TeacherDetailTrainingSemester = "current" | "previous"

export type TeacherDetailTrainingRecord = {
  eventDate: string
  id: string
  locationLabel: string
  status: "cancelled" | "completed" | "upcoming"
  subtitle: string
  title: string
}

export type TeacherDetailAttendanceCalendarStatus = "late" | "onLeave" | "present"

export type TeacherDetailAttendanceCalendarMonthRecord = {
  key: string
  monthNumber: number
  selectedDay: number | null
  statuses: Partial<Record<number, TeacherDetailAttendanceCalendarStatus>>
  summary: ReadonlyArray<{
    label: "Late" | "On Leave" | "Present"
    status: TeacherDetailAttendanceCalendarStatus
    value: number
  }>
  year: number
}

export type TeacherDetailLeaveRequestRecord = {
  endDate: string
  id: string
  reason: string
  requestType: "annual_leave" | "personal_leave" | "sick_leave" | "unpaid_leave"
  startDate: string
  status: "approved" | "declined" | "pending"
}

export type TeacherDetailPerformancePeriod = "lastMonth" | "lastQuarter"

export type TeacherDetailPerformanceRecord = {
  gradingTimelinessTarget: number
  gradingTimelinessValue: number
  period: TeacherDetailPerformancePeriod
  studentAverageGradeTarget: number
  studentAverageGradeValue: number
  studentFeedbackTarget: number
  studentFeedbackValue: number
}
