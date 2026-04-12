import type {
  StudentEnrollmentTrendsQueryInput,
  StudentSpecialProgramsQueryInput,
} from "@talimy/shared"

export type StudentDirectoryStatus = "active" | "onLeave" | "suspended"

export type StudentDirectoryPerformance = "good" | "needsSupport" | "atRisk"

export type StudentDirectoryItemView = {
  attendancePercentage: number
  avatarUrl: string | null
  classLabel: string
  gpa: number
  id: string
  name: string
  performance: StudentDirectoryPerformance
  status: StudentDirectoryStatus
  studentCode: string
}

export type StudentDirectoryListView = {
  data: readonly StudentDirectoryItemView[]
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export type StudentStatsView = {
  grade7Students: number
  grade8Students: number
  grade9Students: number
  totalStudents: number
}

export type StudentEnrollmentTrendPoint = {
  label: string
  shortLabel: string
  value: number
}

export type StudentEnrollmentTrendsView = {
  points: readonly StudentEnrollmentTrendPoint[]
  years: StudentEnrollmentTrendsQueryInput["years"]
}

export type StudentSpecialProgramTone = "sky" | "pink" | "mixed"

export type StudentSpecialProgramItemView = {
  avatarUrl: string | null
  classLabel: string
  id: string
  name: string
  programName: string
  tone: StudentSpecialProgramTone
  typeLabel: string
}

export type StudentSpecialProgramsView = {
  hasGrant: StudentSpecialProgramsQueryInput["hasGrant"]
  items: readonly StudentSpecialProgramItemView[]
}

export type StudentAttendanceOverviewDetail = {
  classLabel: string
  name: string
}

export type StudentAttendanceOverviewPoint = {
  absentStudents: readonly StudentAttendanceOverviewDetail[]
  date: string
  label: string
  value: number
}

export type StudentAttendanceOverviewView = {
  points: readonly StudentAttendanceOverviewPoint[]
  totalStudents: number
  week: "current"
}
