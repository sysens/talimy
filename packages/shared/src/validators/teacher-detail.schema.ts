import { z } from "zod"

import { userTenantQuerySchema } from "./user.schema"

export const teacherWorkloadRangeSchema = z.enum(["last8Months", "thisSemester"])
export const teacherTrainingSemesterSchema = z.enum(["current", "previous"])
export const teacherAttendanceCalendarMonthSchema = z.string().regex(/^\d{4}-\d{2}$/)
export const teacherLeaveRequestStatusSchema = z.enum(["pending", "approved", "declined"])
export const teacherLeaveRequestTypeSchema = z.enum([
  "annual_leave",
  "personal_leave",
  "sick_leave",
  "unpaid_leave",
])
export const teacherPerformancePeriodSchema = z.enum(["lastMonth", "lastQuarter"])

export const teacherDocumentsQuerySchema = userTenantQuerySchema

export const teacherWorkloadDetailQuerySchema = userTenantQuerySchema.extend({
  range: teacherWorkloadRangeSchema.default("last8Months"),
})

export const teacherTrainingQuerySchema = userTenantQuerySchema.extend({
  semester: teacherTrainingSemesterSchema.default("current"),
})

export const teacherAttendanceCalendarQuerySchema = userTenantQuerySchema.extend({
  month: teacherAttendanceCalendarMonthSchema.default("2035-03"),
})

export const teacherLeaveRequestsQuerySchema = userTenantQuerySchema

export const updateTeacherLeaveRequestSchema = z.object({
  status: z.enum(["approved", "declined"]),
})

export const teacherPerformanceQuerySchema = userTenantQuerySchema.extend({
  period: teacherPerformancePeriodSchema.default("lastMonth"),
})

export type TeacherDocumentsQueryInput = z.infer<typeof teacherDocumentsQuerySchema>
export type TeacherWorkloadDetailQueryInput = z.infer<typeof teacherWorkloadDetailQuerySchema>
export type TeacherTrainingQueryInput = z.infer<typeof teacherTrainingQuerySchema>
export type TeacherAttendanceCalendarQueryInput = z.infer<
  typeof teacherAttendanceCalendarQuerySchema
>
export type TeacherLeaveRequestsQueryInput = z.infer<typeof teacherLeaveRequestsQuerySchema>
export type UpdateTeacherLeaveRequestInput = z.infer<typeof updateTeacherLeaveRequestSchema>
export type TeacherPerformanceQueryInput = z.infer<typeof teacherPerformanceQuerySchema>
