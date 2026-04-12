export type StudentsStatsResponse = {
  grade7Students: number
  grade8Students: number
  grade9Students: number
  totalStudents: number
}

export type StudentsAcademicPerformanceResponse = {
  period: "last_semester" | "this_semester"
  points: ReadonlyArray<{
    grade7: number
    grade8: number
    grade9: number
    monthNumber: number
  }>
}

export type StudentsEnrollmentTrendsResponse = {
  points: ReadonlyArray<{
    label: string
    shortLabel: string
    value: number
  }>
  years: number
}

export type StudentsAttendanceWeeklyResponse = {
  points: ReadonlyArray<{
    absentStudents: ReadonlyArray<{
      classLabel: string
      name: string
    }>
    date: string
    label: string
    value: number
  }>
  totalStudents: number
  week: "current"
}

export type StudentsSpecialProgramsResponse = {
  hasGrant: boolean
  items: ReadonlyArray<{
    avatarUrl: string | null
    classLabel: string
    id: string
    name: string
    programName: string
    tone: "sky" | "pink" | "mixed"
    typeLabel: string
  }>
}
