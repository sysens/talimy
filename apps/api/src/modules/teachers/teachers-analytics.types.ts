export type TeacherStatsView = {
  totalTeachers: number
  fullTimeTeachers: number
  partTimeTeachers: number
  substituteTeachers: number
}

export type TeacherAttendanceOverviewPointView = {
  date: string
  label: string
  value: number
}

export type TeacherAttendanceOverviewView = {
  period: "weekly" | "monthly"
  points: ReadonlyArray<TeacherAttendanceOverviewPointView>
}

export type TeacherWorkloadSubjectOptionView = {
  id: string
  key: TeacherDepartmentKey
  label: string
}

export type TeacherWorkloadItemView = {
  teacherId: string
  label: string
  totalClasses: number
  teachingHours: number
  extraDuties: number
}

export type TeacherWorkloadView = {
  period: "weekly" | "monthly"
  subjectId: string
  subjectOptions: ReadonlyArray<TeacherWorkloadSubjectOptionView>
  items: ReadonlyArray<TeacherWorkloadItemView>
}

export type TeacherDepartmentKey =
  | "science"
  | "mathematics"
  | "language"
  | "social"
  | "arts"
  | "physicalEducation"
  | "other"

export type TeachersByDepartmentItemView = {
  count: number
  key: TeacherDepartmentKey
  label: string
  percentage: number
}

export type TeachersByDepartmentView = {
  totalTeachers: number
  items: ReadonlyArray<TeachersByDepartmentItemView>
}
