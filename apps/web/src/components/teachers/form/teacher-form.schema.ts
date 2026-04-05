import { z } from "zod"
import {
  teacherDocumentTypeSchema,
  teacherEmploymentTypeSchema,
  teacherCreateStatusSchema,
} from "@talimy/shared"

export type TeacherCreateFormValidationMessages = {
  classIdsRequired: string
  dateOfBirthRequired: string
  emailInvalid: string
  emailRequired: string
  firstNameRequired: string
  joinDateRequired: string
  lastNameRequired: string
  nationalityRequired: string
  phoneInvalid: string
  subjectIdsRequired: string
  telegramInvalid: string
}

export type TeacherCreateDocumentFormValue = {
  documentType: z.infer<typeof teacherDocumentTypeSchema>
  fileName: string
  mimeType: string
  sizeBytes: number
}

export type TeacherCreateFormValues = {
  address: string
  classIds: string[]
  dateOfBirth: string
  documents: TeacherCreateDocumentFormValue[]
  email: string
  employmentType: z.infer<typeof teacherEmploymentTypeSchema>
  firstName: string
  gender: "female" | "male"
  joinDate: string
  lastName: string
  middleName: string
  nationality: string
  phone: string
  status: z.infer<typeof teacherCreateStatusSchema>
  subjectIds: string[]
  telegramUsername: string
}

export const EMPTY_TEACHER_DOCUMENT_FORM_VALUE: TeacherCreateDocumentFormValue = {
  documentType: "diploma",
  fileName: "",
  mimeType: "",
  sizeBytes: 0,
}

export const TEACHER_CREATE_FORM_DEFAULT_VALUES: TeacherCreateFormValues = {
  address: "",
  classIds: [],
  dateOfBirth: "",
  documents: [],
  email: "",
  employmentType: "full_time",
  firstName: "",
  gender: "male",
  joinDate: "",
  lastName: "",
  middleName: "",
  nationality: "",
  phone: "",
  status: "active",
  subjectIds: [],
  telegramUsername: "",
}

export function createTeacherFormSchema(messages: TeacherCreateFormValidationMessages) {
  return z.object({
    address: z.string().trim().max(500),
    classIds: z.array(z.string().uuid()).min(1, messages.classIdsRequired),
    dateOfBirth: z.string().trim().min(1, messages.dateOfBirthRequired),
    documents: z.array(
      z.object({
        documentType: teacherDocumentTypeSchema,
        fileName: z.string().trim().max(255),
        mimeType: z.string().trim().max(100),
        sizeBytes: z.number().int().nonnegative(),
      })
    ),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid)
      .max(255, messages.emailInvalid),
    employmentType: teacherEmploymentTypeSchema,
    firstName: z.string().trim().min(1, messages.firstNameRequired).max(100),
    gender: z.enum(["male", "female"]),
    joinDate: z.string().trim().min(1, messages.joinDateRequired),
    lastName: z.string().trim().min(1, messages.lastNameRequired).max(100),
    middleName: z.string().trim().max(100),
    nationality: z.string().trim().min(1, messages.nationalityRequired).max(100),
    phone: z.union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^\+[0-9][0-9\s()-]{5,29}$/, messages.phoneInvalid),
    ]),
    status: teacherCreateStatusSchema,
    subjectIds: z.array(z.string().uuid()).min(1, messages.subjectIdsRequired),
    telegramUsername: z.union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^@?[a-zA-Z0-9_]{5,32}$/, messages.telegramInvalid),
    ]),
  })
}
