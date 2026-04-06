import type {
  StudentDirectoryItemView,
  StudentDirectoryPerformance,
  StudentDirectoryStatus,
} from "./students-directory.types"

type StudentDirectoryRow = {
  attendancePercentage: number
  avatarUrl: string | null
  classLabel: string | null
  firstName: string
  gpa: number
  id: string
  lastName: string
  status: "active" | "inactive" | "graduated" | "transferred"
  studentCode: string
}

export function resolveStudentDirectoryPerformance(gpa: number): StudentDirectoryPerformance {
  if (gpa >= 3.5) {
    return "good"
  }

  if (gpa >= 2.5) {
    return "needsSupport"
  }

  return "atRisk"
}

export function resolveStudentDirectoryStatus(
  status: StudentDirectoryRow["status"]
): StudentDirectoryStatus {
  if (status === "active") {
    return "active"
  }

  if (status === "inactive") {
    return "suspended"
  }

  return "onLeave"
}

export function toStudentDirectoryItemView(row: StudentDirectoryRow): StudentDirectoryItemView {
  return {
    attendancePercentage: row.attendancePercentage,
    avatarUrl: row.avatarUrl,
    classLabel: row.classLabel ?? "—",
    gpa: row.gpa,
    id: row.id,
    name: `${row.firstName} ${row.lastName}`.trim(),
    performance: resolveStudentDirectoryPerformance(row.gpa),
    status: resolveStudentDirectoryStatus(row.status),
    studentCode: row.studentCode,
  }
}
