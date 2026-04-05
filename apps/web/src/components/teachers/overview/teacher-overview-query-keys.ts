import type {
  TeacherOverviewAttendancePeriod,
  TeacherOverviewWorkloadPeriod,
} from "@/components/teachers/overview/teacher-overview-api.types"

export const teacherOverviewQueryKeys = {
  attendance: (locale: string, period: TeacherOverviewAttendancePeriod) =>
    ["teacher-overview", locale, "attendance", period] as const,
  department: (locale: string) => ["teacher-overview", locale, "department"] as const,
  stats: (locale: string) => ["teacher-overview", locale, "stats"] as const,
  workload: (locale: string, period: TeacherOverviewWorkloadPeriod, subjectId: string) =>
    ["teacher-overview", locale, "workload", period, subjectId] as const,
} as const
