import { z } from "zod"

import { userGenderScopeSchema, userTenantQuerySchema } from "./user.schema"

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
export const studentCreateStatusSchema = z.enum(["active", "inactive"])
export const studentListStatusFilterSchema = z.enum([
  "active",
  "inactive",
  "graduated",
  "transferred",
  "on_leave",
  "suspended",
])
export const studentGuardianRelationSchema = z.enum([
  "aunt",
  "uncle",
  "guardian",
  "grandmother",
  "grandfather",
  "sibling",
  "other",
])
export const studentGrantTypeSchema = z.enum(["zakat", "sponsor", "other"])
export const studentMealPlanSchema = z.enum(["none", "one_meal", "three_meals"])
export const studentResidencePermitStatusSchema = z.enum(["obtained", "pending_90_days", "none"])

const requiredPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+[0-9][0-9\s()-]{5,29}$/)

const optionalPhoneSchema = z.union([z.literal(""), requiredPhoneSchema])

export const studentStatsQuerySchema = z.object({
  tenantId: z.string().uuid(),
})
export const studentFormOptionsQuerySchema = userTenantQuerySchema.extend({
  genderScope: userGenderScopeSchema.optional(),
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

export const createStudentGuardianSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: requiredPhoneSchema,
})

export const createStudentAlternativeGuardianSchema = z
  .object({
    firstName: z.string().trim().max(100).optional().default(""),
    lastName: z.string().trim().max(100).optional().default(""),
    phone: optionalPhoneSchema.optional().default(""),
    relation: studentGuardianRelationSchema.optional().nullable().default(null),
  })
  .superRefine((value, context) => {
    const hasAnyValue =
      value.firstName.length > 0 ||
      value.lastName.length > 0 ||
      value.phone.length > 0 ||
      value.relation !== null

    if (!hasAnyValue) {
      return
    }

    if (value.firstName.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["firstName"],
        message: "Alternative guardian first name is required",
      })
    }

    if (value.lastName.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastName"],
        message: "Alternative guardian last name is required",
      })
    }

    if (value.phone.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Alternative guardian phone is required",
      })
    }

    if (value.relation === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["relation"],
        message: "Alternative guardian relation is required",
      })
    }
  })

export const studentCreateModuleSettingsSchema = z.object({
  contractNumberEnabled: z.boolean(),
  dormitoryEnabled: z.boolean(),
  financeEnabled: z.boolean(),
  grantEnabled: z.boolean(),
  mealsEnabled: z.boolean(),
  residencePermitEnabled: z.boolean(),
})

export const studentCreateClassOptionSchema = z.object({
  feeAmount: z.number().nonnegative().nullable(),
  grade: z.string().trim().min(1).max(20),
  id: z.string().uuid(),
  label: z.string().trim().min(1).max(100),
  section: z.string().trim().min(1).max(20),
})

export const createStudentSchema = z
  .object({
    tenantId: z.string().uuid(),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    middleName: z.string().trim().max(100).optional().default(""),
    gender: z.enum(["male", "female"]),
    dateOfBirth: z.string().date(),
    avatar: z.string().trim().url().max(500).optional().nullable(),
    avatarStorageKey: z.string().trim().min(1).max(500).optional().nullable(),
    email: z.string().trim().email().max(255),
    phone: optionalPhoneSchema,
    address: z.string().trim().max(500).optional().default(""),
    enrollmentDate: z.string().date(),
    classId: z.string().uuid(),
    previousSchool: z.string().trim().min(1).max(255),
    hobbiesInterests: z.string().trim().max(500).optional().default(""),
    specialNeedsSupport: z.boolean().default(false),
    medicalConditionAlert: z.boolean().default(false),
    medicalConditionDetails: z.string().trim().max(1000).optional().default(""),
    status: studentCreateStatusSchema.default("active"),
    guardians: z.object({
      father: createStudentGuardianSchema,
      mother: createStudentGuardianSchema,
      alternative: createStudentAlternativeGuardianSchema.optional().default({
        firstName: "",
        lastName: "",
        phone: "",
        relation: null,
      }),
    }),
    grantType: studentGrantTypeSchema.optional().nullable().default(null),
    totalFee: z.number().nonnegative().nullable().optional().default(null),
    paidAmount: z.number().nonnegative().nullable().optional().default(null),
    dormitoryRoom: z.string().trim().max(50).optional().default(""),
    mealsPerDay: studentMealPlanSchema.optional().nullable().default(null),
    residencePermitStatus: studentResidencePermitStatusSchema.optional().nullable().default(null),
    contractNumber: z.string().trim().max(100).optional().default(""),
  })
  .superRefine((value, context) => {
    if (value.medicalConditionAlert && value.medicalConditionDetails.trim().length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["medicalConditionDetails"],
        message: "Medical condition details are required when alert is enabled",
      })
    }

    if (
      typeof value.totalFee === "number" &&
      typeof value.paidAmount === "number" &&
      value.paidAmount > value.totalFee
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paidAmount"],
        message: "Paid amount cannot exceed total fee",
      })
    }
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
export type StudentFormOptionsQueryInput = z.infer<typeof studentFormOptionsQuerySchema>
export type StudentSpecialProgramsQueryInput = z.infer<typeof studentSpecialProgramsQuerySchema>
export type StudentEnrollmentTrendsQueryInput = z.infer<typeof studentEnrollmentTrendsQuerySchema>
export type StudentAttendanceWeeklyQueryInput = z.infer<typeof studentAttendanceWeeklyQuerySchema>
export type CreateStudentGuardianInput = z.infer<typeof createStudentGuardianSchema>
export type CreateStudentAlternativeGuardianInput = z.infer<
  typeof createStudentAlternativeGuardianSchema
>
export type StudentCreateClassOptionInput = z.infer<typeof studentCreateClassOptionSchema>
export type StudentCreateModuleSettingsInput = z.infer<typeof studentCreateModuleSettingsSchema>
