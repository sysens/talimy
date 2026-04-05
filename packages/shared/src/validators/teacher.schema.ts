import { z } from "zod"

import { userGenderScopeSchema, userTenantQuerySchema } from "./user.schema"

export const teacherEmploymentTypeSchema = z.enum(["full_time", "part_time", "substitute"])
export const teacherStatusSchema = z.enum(["active", "inactive", "on_leave"])
export const teacherCreateStatusSchema = z.enum(["active", "inactive"])
export const teacherDocumentTypeSchema = z.enum(["diploma", "certificate", "id_card", "other"])
export const teacherDepartmentKeySchema = z.enum([
  "science",
  "mathematics",
  "language",
  "social",
  "arts",
  "physicalEducation",
  "other",
])

function toCsvArray(value: string | readonly string[] | undefined): string[] {
  let items: readonly string[] = []

  if (typeof value === "string") {
    items = value.split(",")
  } else if (Array.isArray(value)) {
    items = value
  }

  return items.map((item: string) => item.trim()).filter((item: string) => item.length > 0)
}

export const listTeachersQuerySchema = z.object({
  tenantId: z.string().uuid(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z
    .enum(["createdAt", "employeeId", "fullName", "joinDate", "status", "updatedAt"])
    .optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  genderScope: userGenderScopeSchema.optional(),
  gender: z
    .union([z.enum(["male", "female"]), z.array(z.enum(["male", "female"]))])
    .optional()
    .transform((value) => toCsvArray(value)),
  status: z
    .union([teacherStatusSchema, z.array(teacherStatusSchema)])
    .optional()
    .transform((value) => toCsvArray(value)),
  departmentId: z
    .union([teacherDepartmentKeySchema, z.array(teacherDepartmentKeySchema)])
    .optional()
    .transform((value) => toCsvArray(value)),
})

export const teacherFormOptionsQuerySchema = userTenantQuerySchema.extend({
  genderScope: userGenderScopeSchema.optional(),
})

export const createTeacherDocumentSchema = z.object({
  documentType: teacherDocumentTypeSchema,
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(100),
  sizeBytes: z.number().int().positive(),
  storageKey: z.string().trim().min(1).max(500),
})

export const createTeacherSchema = z.object({
  tenantId: z.string().uuid(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  middleName: z.string().trim().max(100).optional().default(""),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().date(),
  nationality: z.string().trim().min(1).max(100),
  avatar: z.string().trim().url().max(500).optional().nullable(),
  avatarStorageKey: z.string().trim().min(1).max(500).optional().nullable(),
  email: z.string().trim().email().max(255),
  phone: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^\+[0-9][0-9\s()-]{5,29}$/),
  ]),
  telegramUsername: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^@?[a-zA-Z0-9_]{5,32}$/),
  ]),
  address: z.string().trim().max(500).optional().default(""),
  subjectIds: z.array(z.string().uuid()).min(1),
  classIds: z.array(z.string().uuid()).min(1),
  employmentType: teacherEmploymentTypeSchema,
  joinDate: z.string().date(),
  status: teacherCreateStatusSchema.default("active"),
  documents: z.array(createTeacherDocumentSchema).default([]),
})

export const updateTeacherSchema = z.object({
  employeeId: z.string().min(2).optional(),
  gender: z.enum(["male", "female"]).optional(),
  employmentType: teacherEmploymentTypeSchema.optional(),
  joinDate: z.string().date().optional(),
  dateOfBirth: z.string().date().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  salary: z.number().optional(),
  status: teacherStatusSchema.optional(),
})

export const teacherStatsQuerySchema = z.object({
  tenantId: z.string().uuid(),
})

export const teacherAttendanceOverviewQuerySchema = z.object({
  tenantId: z.string().uuid(),
  period: z.enum(["weekly", "monthly"]).default("weekly"),
})

export const teacherWorkloadQuerySchema = z.object({
  tenantId: z.string().uuid(),
  subjectId: z.string().uuid().optional(),
  period: z.enum(["weekly", "monthly"]).default("weekly"),
})

export const teachersByDepartmentQuerySchema = z.object({
  tenantId: z.string().uuid(),
})

export type ListTeachersQueryInput = z.infer<typeof listTeachersQuerySchema>
export type TeacherFormOptionsQueryInput = z.infer<typeof teacherFormOptionsQuerySchema>
export type CreateTeacherDocumentInput = z.infer<typeof createTeacherDocumentSchema>
export type CreateTeacherInput = z.infer<typeof createTeacherSchema>
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>
export type TeacherStatsQueryInput = z.infer<typeof teacherStatsQuerySchema>
export type TeacherAttendanceOverviewQueryInput = z.infer<
  typeof teacherAttendanceOverviewQuerySchema
>
export type TeacherWorkloadQueryInput = z.infer<typeof teacherWorkloadQuerySchema>
export type TeachersByDepartmentQueryInput = z.infer<typeof teachersByDepartmentQuerySchema>
