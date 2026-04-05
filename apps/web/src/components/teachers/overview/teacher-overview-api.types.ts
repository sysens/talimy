export type TeacherOverviewStatsResponse = {
  totalTeachers: number
  fullTimeTeachers: number
  partTimeTeachers: number
  substituteTeachers: number
}

export type TeacherOverviewAttendanceResponse = {
  period: "weekly" | "monthly"
  points: ReadonlyArray<{
    date: string
    label: string
    value: number
  }>
}

export type TeacherOverviewWorkloadResponse = {
  period: "weekly" | "monthly"
  subjectId: string
  subjectOptions: ReadonlyArray<{
    id: string
    key: TeacherOverviewDepartmentKey
    label: string
  }>
  items: ReadonlyArray<{
    teacherId: string
    label: string
    totalClasses: number
    teachingHours: number
    extraDuties: number
  }>
}

export type TeacherOverviewDepartmentKey =
  | "science"
  | "mathematics"
  | "language"
  | "social"
  | "arts"
  | "physicalEducation"
  | "other"

export type TeacherOverviewDepartmentResponse = {
  totalTeachers: number
  items: ReadonlyArray<{
    count: number
    key: TeacherOverviewDepartmentKey
    label: string
    percentage: number
  }>
}

export type TeacherOverviewAttendancePeriod = "weekly" | "monthly"
export type TeacherOverviewWorkloadPeriod = "weekly" | "monthly"
