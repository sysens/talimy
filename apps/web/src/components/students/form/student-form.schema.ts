import { z } from "zod"
import {
  studentCreateStatusSchema,
  studentGrantTypeSchema,
  studentGuardianRelationSchema,
  studentMealPlanSchema,
  studentResidencePermitStatusSchema,
} from "@talimy/shared"

type StudentCreateFormGuardianValues = {
  firstName: string
  lastName: string
  phone: string
}

type StudentCreateAlternativeGuardianValues = StudentCreateFormGuardianValues & {
  relation: z.infer<typeof studentGuardianRelationSchema> | ""
}

export type StudentCreateFormValidationMessages = {
  addressRequired: string
  alternativeGuardianFirstNameRequired: string
  alternativeGuardianLastNameRequired: string
  alternativeGuardianPhoneRequired: string
  alternativeGuardianRelationRequired: string
  classRequired: string
  dateOfBirthRequired: string
  emailInvalid: string
  emailRequired: string
  enrollmentDateRequired: string
  fatherFirstNameRequired: string
  fatherLastNameRequired: string
  fatherPhoneInvalid: string
  firstNameRequired: string
  gradeRequired: string
  lastNameRequired: string
  medicalConditionDetailsRequired: string
  motherFirstNameRequired: string
  motherLastNameRequired: string
  motherPhoneInvalid: string
  paidAmountInvalid: string
  paidAmountTooLarge: string
  phoneInvalid: string
  phoneRequired: string
  previousSchoolRequired: string
  sectionRequired: string
  totalFeeInvalid: string
}

export type StudentCreateFormValues = {
  address: string
  classId: string
  dateOfBirth: string
  email: string
  enrollmentDate: string
  firstName: string
  gender: "female" | "male"
  grade: string
  grantType: z.infer<typeof studentGrantTypeSchema> | ""
  guardians: {
    alternative: StudentCreateAlternativeGuardianValues
    father: StudentCreateFormGuardianValues
    mother: StudentCreateFormGuardianValues
  }
  hobbiesInterests: string
  lastName: string
  medicalConditionAlert: boolean
  medicalConditionDetails: string
  mealsPerDay: z.infer<typeof studentMealPlanSchema> | ""
  middleName: string
  paidAmount: string
  phone: string
  previousSchool: string
  residencePermitStatus: z.infer<typeof studentResidencePermitStatusSchema> | ""
  section: string
  specialNeedsSupport: boolean
  status: z.infer<typeof studentCreateStatusSchema>
  totalFee: string
  dormitoryRoom: string
  contractNumber: string
}

const optionalCurrencyStringSchema = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/),
])

const optionalPhoneSchema = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .regex(/^\+[0-9][0-9\s()-]{5,29}$/),
])

export const STUDENT_CREATE_FORM_DEFAULT_VALUES: StudentCreateFormValues = {
  address: "",
  classId: "",
  dateOfBirth: "",
  email: "",
  enrollmentDate: "",
  firstName: "",
  gender: "male",
  grade: "",
  grantType: "",
  guardians: {
    alternative: {
      firstName: "",
      lastName: "",
      phone: "",
      relation: "",
    },
    father: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    mother: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  },
  hobbiesInterests: "",
  lastName: "",
  medicalConditionAlert: false,
  medicalConditionDetails: "",
  mealsPerDay: "",
  middleName: "",
  paidAmount: "",
  phone: "",
  previousSchool: "",
  residencePermitStatus: "",
  section: "",
  specialNeedsSupport: false,
  status: "active",
  totalFee: "",
  dormitoryRoom: "",
  contractNumber: "",
}

export function createStudentFormSchema(messages: StudentCreateFormValidationMessages) {
  return z
    .object({
      address: z.string().trim().min(1, messages.addressRequired).max(500),
      classId: z.string().trim().min(1, messages.classRequired),
      dateOfBirth: z.string().trim().min(1, messages.dateOfBirthRequired),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid)
        .max(255, messages.emailInvalid),
      enrollmentDate: z.string().trim().min(1, messages.enrollmentDateRequired),
      firstName: z.string().trim().min(1, messages.firstNameRequired).max(100),
      gender: z.enum(["male", "female"]),
      grade: z.string().trim().min(1, messages.gradeRequired),
      grantType: z.union([studentGrantTypeSchema, z.literal("")]),
      guardians: z.object({
        alternative: z.object({
          firstName: z.string().trim().max(100),
          lastName: z.string().trim().max(100),
          phone: optionalPhoneSchema,
          relation: z.union([studentGuardianRelationSchema, z.literal("")]),
        }),
        father: z.object({
          firstName: z.string().trim().min(1, messages.fatherFirstNameRequired).max(100),
          lastName: z.string().trim().min(1, messages.fatherLastNameRequired).max(100),
          phone: z
            .string()
            .trim()
            .min(1, messages.fatherPhoneInvalid)
            .regex(/^\+[0-9][0-9\s()-]{5,29}$/, messages.fatherPhoneInvalid),
        }),
        mother: z.object({
          firstName: z.string().trim().min(1, messages.motherFirstNameRequired).max(100),
          lastName: z.string().trim().min(1, messages.motherLastNameRequired).max(100),
          phone: z
            .string()
            .trim()
            .min(1, messages.motherPhoneInvalid)
            .regex(/^\+[0-9][0-9\s()-]{5,29}$/, messages.motherPhoneInvalid),
        }),
      }),
      hobbiesInterests: z.string().trim().max(500),
      lastName: z.string().trim().min(1, messages.lastNameRequired).max(100),
      medicalConditionAlert: z.boolean(),
      medicalConditionDetails: z.string().trim().max(1000),
      mealsPerDay: z.union([studentMealPlanSchema, z.literal("")]),
      middleName: z.string().trim().max(100),
      paidAmount: optionalCurrencyStringSchema,
      phone: z
        .string()
        .trim()
        .min(1, messages.phoneRequired)
        .regex(/^\+[0-9][0-9\s()-]{5,29}$/, messages.phoneInvalid),
      previousSchool: z.string().trim().min(1, messages.previousSchoolRequired).max(255),
      residencePermitStatus: z.union([studentResidencePermitStatusSchema, z.literal("")]),
      section: z.string().trim().min(1, messages.sectionRequired),
      specialNeedsSupport: z.boolean(),
      status: studentCreateStatusSchema,
      totalFee: optionalCurrencyStringSchema,
      dormitoryRoom: z.string().trim().max(50),
      contractNumber: z.string().trim().max(100),
    })
    .superRefine((value, context) => {
      const alternative = value.guardians.alternative
      const hasAlternativeValue =
        alternative.firstName.length > 0 ||
        alternative.lastName.length > 0 ||
        alternative.phone.length > 0 ||
        alternative.relation.length > 0

      if (hasAlternativeValue) {
        if (alternative.firstName.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.alternativeGuardianFirstNameRequired,
            path: ["guardians", "alternative", "firstName"],
          })
        }

        if (alternative.lastName.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.alternativeGuardianLastNameRequired,
            path: ["guardians", "alternative", "lastName"],
          })
        }

        if (alternative.phone.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.alternativeGuardianPhoneRequired,
            path: ["guardians", "alternative", "phone"],
          })
        }

        if (alternative.relation.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.alternativeGuardianRelationRequired,
            path: ["guardians", "alternative", "relation"],
          })
        }
      }

      if (value.medicalConditionAlert && value.medicalConditionDetails.trim().length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.medicalConditionDetailsRequired,
          path: ["medicalConditionDetails"],
        })
      }

      if (value.totalFee.length > 0 && !/^\d+(\.\d{1,2})?$/.test(value.totalFee)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.totalFeeInvalid,
          path: ["totalFee"],
        })
      }

      if (value.paidAmount.length > 0 && !/^\d+(\.\d{1,2})?$/.test(value.paidAmount)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.paidAmountInvalid,
          path: ["paidAmount"],
        })
      }

      const totalFee = value.totalFee.length > 0 ? Number(value.totalFee) : null
      const paidAmount = value.paidAmount.length > 0 ? Number(value.paidAmount) : null

      if (
        typeof totalFee === "number" &&
        Number.isFinite(totalFee) &&
        typeof paidAmount === "number" &&
        Number.isFinite(paidAmount) &&
        paidAmount > totalFee
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.paidAmountTooLarge,
          path: ["paidAmount"],
        })
      }
    })
}
