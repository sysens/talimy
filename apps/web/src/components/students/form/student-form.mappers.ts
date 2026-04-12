import type { CreateStudentInput } from "@talimy/shared"

import type { UploadedStudentFile } from "./student-create-api.types"
import type { StudentCreateFormValues } from "./student-form.schema"
import { parseOptionalNumber } from "./student-form.utils"

type NonEmptyAlternativeRelation = Exclude<
  StudentCreateFormValues["guardians"]["alternative"]["relation"],
  ""
>
type NonEmptyGrantType = Exclude<StudentCreateFormValues["grantType"], "">
type NonEmptyMealPlan = Exclude<StudentCreateFormValues["mealsPerDay"], "">
type NonEmptyResidencePermitStatus = Exclude<StudentCreateFormValues["residencePermitStatus"], "">

function resolveAlternativeRelation(
  value: StudentCreateFormValues["guardians"]["alternative"]["relation"]
): NonEmptyAlternativeRelation | null {
  return value === "" ? null : value
}

function resolveGrantType(value: StudentCreateFormValues["grantType"]): NonEmptyGrantType | null {
  return value === "" ? null : value
}

function resolveMealPlan(value: StudentCreateFormValues["mealsPerDay"]): NonEmptyMealPlan | null {
  return value === "" ? null : value
}

function resolveResidencePermitStatus(
  value: StudentCreateFormValues["residencePermitStatus"]
): NonEmptyResidencePermitStatus | null {
  return value === "" ? null : value
}

export function mapStudentFormValuesToCreatePayload(
  values: StudentCreateFormValues,
  avatarUpload: UploadedStudentFile | null
): Omit<CreateStudentInput, "tenantId"> {
  const alternativeRelation = resolveAlternativeRelation(values.guardians.alternative.relation)
  const grantType = resolveGrantType(values.grantType)
  const mealsPerDay = resolveMealPlan(values.mealsPerDay)
  const residencePermitStatus = resolveResidencePermitStatus(values.residencePermitStatus)

  return {
    address: values.address,
    avatar: avatarUpload?.publicUrl ?? null,
    avatarStorageKey: avatarUpload?.storageKey ?? null,
    classId: values.classId,
    contractNumber: values.contractNumber,
    dateOfBirth: values.dateOfBirth,
    dormitoryRoom: values.dormitoryRoom,
    email: values.email,
    enrollmentDate: values.enrollmentDate,
    firstName: values.firstName,
    gender: values.gender,
    grantType,
    guardians: {
      alternative: {
        firstName: values.guardians.alternative.firstName,
        lastName: values.guardians.alternative.lastName,
        phone: values.guardians.alternative.phone,
        relation: alternativeRelation,
      },
      father: values.guardians.father,
      mother: values.guardians.mother,
    },
    hobbiesInterests: values.hobbiesInterests,
    lastName: values.lastName,
    mealsPerDay,
    medicalConditionAlert: values.medicalConditionAlert,
    medicalConditionDetails: values.medicalConditionDetails,
    middleName: values.middleName,
    paidAmount: parseOptionalNumber(values.paidAmount),
    phone: values.phone,
    previousSchool: values.previousSchool,
    residencePermitStatus,
    specialNeedsSupport: values.specialNeedsSupport,
    status: values.status,
    totalFee: parseOptionalNumber(values.totalFee),
  }
}
