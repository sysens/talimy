import { z } from "zod"

import { userTenantQuerySchema } from "./user.schema"

export const adminAttendanceSummaryDateSchema = z.enum(["today"])
export const adminAttendanceTrendPeriodSchema = z.enum(["last_semester", "this_semester"])
export const adminAttendanceGridTypeSchema = z.enum(["students", "teachers", "staff"])
export const adminAttendanceEditableStatusSchema = z.enum(["on_time", "late", "absent"])

const monthValueSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")

export const adminAttendanceSummaryQuerySchema = userTenantQuerySchema.extend({
  date: adminAttendanceSummaryDateSchema.default("today"),
})

export const adminAttendanceTrendQuerySchema = userTenantQuerySchema.extend({
  period: adminAttendanceTrendPeriodSchema.default("last_semester"),
})

export const adminAttendanceOptionsQuerySchema = userTenantQuerySchema

export const adminAttendanceGridQuerySchema = userTenantQuerySchema.extend({
  department: z.string().min(1).optional(),
  type: adminAttendanceGridTypeSchema.default("students"),
  classId: z.string().uuid().optional(),
  month: monthValueSchema.default(new Date().toISOString().slice(0, 7)),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export const adminAttendanceMarkSchema = userTenantQuerySchema.extend({
  date: z.string().date(),
  type: adminAttendanceGridTypeSchema,
  records: z
    .array(
      z.object({
        entityId: z.string().uuid(),
        note: z.string().max(500).optional(),
        status: adminAttendanceEditableStatusSchema,
      })
    )
    .min(1),
})

export type AdminAttendanceSummaryQueryInput = z.infer<typeof adminAttendanceSummaryQuerySchema>
export type AdminAttendanceTrendQueryInput = z.infer<typeof adminAttendanceTrendQuerySchema>
export type AdminAttendanceOptionsQueryInput = z.infer<typeof adminAttendanceOptionsQuerySchema>
export type AdminAttendanceGridQueryInput = z.infer<typeof adminAttendanceGridQuerySchema>
export type AdminAttendanceMarkInput = z.infer<typeof adminAttendanceMarkSchema>
