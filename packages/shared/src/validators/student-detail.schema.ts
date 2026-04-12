import { z } from "zod"

import { userTenantQuerySchema } from "./user.schema"

export const studentAttendanceCalendarMonthSchema = z.string().regex(/^\d{4}-\d{2}$/)
export const studentAcademicPerformancePeriodSchema = z.enum(["last6Months", "thisSemester"])

export const studentDocumentsQuerySchema = userTenantQuerySchema
export const studentScholarshipsQuerySchema = userTenantQuerySchema
export const studentHealthQuerySchema = userTenantQuerySchema
export const studentExtracurricularQuerySchema = userTenantQuerySchema
export const studentBehaviorLogQuerySchema = userTenantQuerySchema

export const studentAttendanceCalendarQuerySchema = userTenantQuerySchema.extend({
  month: studentAttendanceCalendarMonthSchema.default("2035-03"),
})

export const studentAcademicPerformanceQuerySchema = userTenantQuerySchema.extend({
  period: studentAcademicPerformancePeriodSchema.default("last6Months"),
})

export type StudentDocumentsQueryInput = z.infer<typeof studentDocumentsQuerySchema>
export type StudentScholarshipsQueryInput = z.infer<typeof studentScholarshipsQuerySchema>
export type StudentHealthQueryInput = z.infer<typeof studentHealthQuerySchema>
export type StudentExtracurricularQueryInput = z.infer<typeof studentExtracurricularQuerySchema>
export type StudentBehaviorLogQueryInput = z.infer<typeof studentBehaviorLogQuerySchema>
export type StudentAttendanceCalendarQueryInput = z.infer<
  typeof studentAttendanceCalendarQuerySchema
>
export type StudentAcademicPerformanceQueryInput = z.infer<
  typeof studentAcademicPerformanceQuerySchema
>
