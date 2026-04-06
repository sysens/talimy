import type { SortDescriptor } from "@heroui/react"

export type StudentListStatus = "active" | "onLeave" | "suspended"

export type StudentPerformanceLevel = "good" | "needsSupport" | "atRisk"

export type StudentListItem = {
  attendancePercentage: number
  avatarUrl: string
  classLabel: string
  gpa: number
  id: string
  name: string
  performance: StudentPerformanceLevel
  status: StudentListStatus
  studentCode: string
}

export type StudentsStatusFilter = "all" | StudentListStatus

export type StudentsTableSortColumn =
  | "student"
  | "class"
  | "gpa"
  | "performance"
  | "attendance"
  | "status"

export type StudentsTableSortDescriptor = Omit<SortDescriptor, "column"> & {
  column: StudentsTableSortColumn
}
