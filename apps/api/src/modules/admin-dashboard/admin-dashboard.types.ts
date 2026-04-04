import type {
  AdminAttendanceOverviewQueryInput,
  AdminFinanceEarningsQueryInput,
  AdminStudentsPerformanceQueryInput,
} from "@talimy/shared"

export type AdminDashboardStatsView = {
  activeTeachers: number
  enrolledStudents: number
  supportStaff: number
  totalAwards: number
}

export type AdminStudentsPerformancePoint = {
  grade7: number
  grade8: number
  grade9: number
  monthNumber: number
}

export type AdminStudentsPerformanceView = {
  period: AdminStudentsPerformanceQueryInput["period"]
  points: readonly AdminStudentsPerformancePoint[]
}

export type AdminStudentsByGenderView = {
  boys: number
  girls: number
  gradeId: string
  total: number
}

export type AdminAttendanceOverviewPoint = {
  date: string
  label: string
  value: number
}

export type AdminAttendanceOverviewView = {
  period: AdminAttendanceOverviewQueryInput["period"]
  points: readonly AdminAttendanceOverviewPoint[]
}

export type AdminFinanceEarningsPoint = {
  earnings: number
  expenses: number
  monthNumber: number
}

export type AdminFinanceEarningsView = {
  period: AdminFinanceEarningsQueryInput["period"]
  points: readonly AdminFinanceEarningsPoint[]
  year: number
}

export type AdminActivityViewItem = {
  action: string
  actorName: string | null
  id: string
  resource: string
  resourceLabel: string | null
  timestamp: string
}

export type AdminActivityView = {
  items: readonly AdminActivityViewItem[]
}
