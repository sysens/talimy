"use client"

import { z } from "zod"
import {
  studentCreateStatusSchema,
  studentGrantTypeSchema,
  studentGuardianRelationSchema,
  studentMealPlanSchema,
  studentResidencePermitStatusSchema,
} from "@talimy/shared"

import type { StudentCreateFormValues } from "./student-form.schema"

const studentCreateDraftSchema = z.object({
  address: z.string(),
  classId: z.string(),
  dateOfBirth: z.string(),
  email: z.string(),
  enrollmentDate: z.string(),
  firstName: z.string(),
  gender: z.enum(["male", "female"]),
  grade: z.string(),
  grantType: z.union([studentGrantTypeSchema, z.literal("")]),
  guardians: z.object({
    alternative: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      relation: z.union([studentGuardianRelationSchema, z.literal("")]),
    }),
    father: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
    }),
    mother: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
    }),
  }),
  hobbiesInterests: z.string(),
  lastName: z.string(),
  medicalConditionAlert: z.boolean(),
  medicalConditionDetails: z.string(),
  mealsPerDay: z.union([studentMealPlanSchema, z.literal("")]),
  middleName: z.string(),
  paidAmount: z.string(),
  phone: z.string(),
  previousSchool: z.string(),
  residencePermitStatus: z.union([studentResidencePermitStatusSchema, z.literal("")]),
  section: z.string(),
  specialNeedsSupport: z.boolean(),
  status: studentCreateStatusSchema,
  totalFee: z.string(),
  dormitoryRoom: z.string(),
  contractNumber: z.string(),
})

function resolveStudentCreateDraftStorageKey(tenantId: string): string {
  return `talimy:student-create-draft:${tenantId}`
}

export function readStudentCreateDraft(tenantId: string): StudentCreateFormValues | null {
  if (typeof window === "undefined") {
    return null
  }

  const rawValue = window.localStorage.getItem(resolveStudentCreateDraftStorageKey(tenantId))
  if (!rawValue) {
    return null
  }

  const parsedResult = studentCreateDraftSchema.safeParse(JSON.parse(rawValue))
  return parsedResult.success ? parsedResult.data : null
}

export function saveStudentCreateDraft(tenantId: string, values: StudentCreateFormValues): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(resolveStudentCreateDraftStorageKey(tenantId), JSON.stringify(values))
}

export function clearStudentCreateDraft(tenantId: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(resolveStudentCreateDraftStorageKey(tenantId))
}
