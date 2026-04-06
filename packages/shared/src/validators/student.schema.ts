import { z } from "zod"

function toCsvArray(value: string | readonly string[] | undefined): string[] {
  let items: readonly string[] = []

  if (typeof value === "string") {
    items = value.split(",")
  } else if (Array.isArray(value)) {
    items = value
  }

  return items.map((item) => item.trim()).filter((item) => item.length > 0)
}

export const studentStatusSchema = z.enum(["active", "inactive", "graduated", "transferred"])
export const studentListStatusFilterSchema = z.enum([
  "active",
  "inactive",
  "graduated",
  "transferred",
  "on_leave",
  "suspended",
])
export const studentStatsQuerySchema = z.object({
  tenantId: z.string().uuid(),
})
export const studentSpecialProgramsQuerySchema = z.object({
  tenantId: z.string().uuid(),
  hasGrant: z.coerce.boolean().default(true),
  limit: z.coerce.number().int().min(1).max(12).default(4),
})
export const studentEnrollmentTrendsQuerySchema = z.object({
  tenantId: z.string().uuid(),
  years: z.coerce.number().int().min(1).max(10).default(5),
})
export const studentAttendanceWeeklyQuerySchema = z.object({
  tenantId: z.string().uuid(),
  week: z.enum(["current"]).default("current"),
})

export const listStudentsQuerySchema = z
  .object({
    tenantId: z.string().uuid(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    sort: z
      .enum(["attendance", "classLabel", "createdAt", "fullName", "gpa", "performance", "status"])
      .optional(),
    order: z.enum(["asc", "desc"]).default("desc"),
    classId: z.string().uuid().optional(),
    gender: z.enum(["male", "female"]).optional(),
    status: z
      .union([studentListStatusFilterSchema, z.array(studentListStatusFilterSchema)])
      .optional()
      .transform((value) => toCsvArray(value)),
    enrollmentDateFrom: z.string().date().optional(),
    enrollmentDateTo: z.string().date().optional(),
  })
  .refine(
    (data) =>
      !data.enrollmentDateFrom ||
      !data.enrollmentDateTo ||
      new Date(data.enrollmentDateFrom) <= new Date(data.enrollmentDateTo),
    {
      message: "enrollmentDateFrom must be before or equal to enrollmentDateTo",
      path: ["enrollmentDateFrom"],
    }
  )

export const createStudentSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  studentId: z.string().min(2),
  gender: z.enum(["male", "female"]),
  enrollmentDate: z.string().date(),
  dateOfBirth: z.string().date().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  status: studentStatusSchema.optional(),
  fullName: z.string().min(2),
})

export const updateStudentSchema = z.object({
  classId: z.string().uuid().optional(),
  studentId: z.string().min(2).optional(),
  gender: z.enum(["male", "female"]).optional(),
  enrollmentDate: z.string().date().optional(),
  dateOfBirth: z.string().date().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  status: studentStatusSchema.optional(),
  fullName: z.string().min(2).optional(),
})

export type ListStudentsQueryInput = z.infer<typeof listStudentsQuerySchema>
export type CreateStudentInput = z.infer<typeof createStudentSchema>
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>
export type StudentStatsQueryInput = z.infer<typeof studentStatsQuerySchema>
export type StudentSpecialProgramsQueryInput = z.infer<typeof studentSpecialProgramsQuerySchema>
export type StudentEnrollmentTrendsQueryInput = z.infer<typeof studentEnrollmentTrendsQuerySchema>
export type StudentAttendanceWeeklyQueryInput = z.infer<typeof studentAttendanceWeeklyQuerySchema>
