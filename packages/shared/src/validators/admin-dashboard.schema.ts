import { z } from "zod"

import { userTenantQuerySchema } from "./user.schema"

export const adminStudentPerformancePeriodSchema = z.enum(["last_semester", "this_semester"])
export const adminAttendanceOverviewPeriodSchema = z.enum(["weekly", "monthly"])
export const adminFinanceEarningsPeriodSchema = z.enum(["last_year", "this_year"])

export const adminDashboardStatsQuerySchema = userTenantQuerySchema

export const adminStudentsPerformanceQuerySchema = userTenantQuerySchema.extend({
  period: adminStudentPerformancePeriodSchema.default("last_semester"),
})

export const adminStudentsByGenderQuerySchema = userTenantQuerySchema.extend({
  gradeId: z.enum(["7", "8", "9"]),
})

export const adminAttendanceOverviewQuerySchema = userTenantQuerySchema.extend({
  period: adminAttendanceOverviewPeriodSchema.default("weekly"),
})

export const adminFinanceEarningsQuerySchema = userTenantQuerySchema.extend({
  period: adminFinanceEarningsPeriodSchema.default("this_year"),
})

export const adminActivityQuerySchema = userTenantQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(20).default(5),
})

export type AdminDashboardStatsQueryInput = z.infer<typeof adminDashboardStatsQuerySchema>
export type AdminStudentsPerformanceQueryInput = z.infer<typeof adminStudentsPerformanceQuerySchema>
export type AdminStudentsByGenderQueryInput = z.infer<typeof adminStudentsByGenderQuerySchema>
export type AdminAttendanceOverviewQueryInput = z.infer<typeof adminAttendanceOverviewQuerySchema>
export type AdminFinanceEarningsQueryInput = z.infer<typeof adminFinanceEarningsQuerySchema>
export type AdminActivityQueryInput = z.infer<typeof adminActivityQuerySchema>
