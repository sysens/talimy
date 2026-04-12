import type { HeroSelectFieldOption } from "@/components/shared/forms/hero-select-field"

export const STUDENT_GENDER_OPTIONS = ["male", "female"] as const
export const STUDENT_STATUS_OPTIONS = ["active", "inactive"] as const
export const STUDENT_GUARDIAN_RELATION_OPTIONS = [
  "aunt",
  "uncle",
  "guardian",
  "grandmother",
  "grandfather",
  "sibling",
  "other",
] as const
export const STUDENT_GRANT_TYPE_OPTIONS = ["zakat", "sponsor", "other"] as const
export const STUDENT_MEAL_PLAN_OPTIONS = ["none", "one_meal", "three_meals"] as const
export const STUDENT_RESIDENCE_PERMIT_STATUS_OPTIONS = [
  "obtained",
  "pending_90_days",
  "none",
] as const

type StudentGenderOption = (typeof STUDENT_GENDER_OPTIONS)[number]
type StudentStatusOption = (typeof STUDENT_STATUS_OPTIONS)[number]
type StudentGuardianRelationOption = (typeof STUDENT_GUARDIAN_RELATION_OPTIONS)[number]
type StudentGrantTypeOption = (typeof STUDENT_GRANT_TYPE_OPTIONS)[number]
type StudentMealPlanOption = (typeof STUDENT_MEAL_PLAN_OPTIONS)[number]
type StudentResidencePermitStatusOption = (typeof STUDENT_RESIDENCE_PERMIT_STATUS_OPTIONS)[number]

function mapToOptions<T extends string>(
  values: readonly T[],
  getLabel: (value: T) => string
): readonly HeroSelectFieldOption[] {
  return values.map((value) => ({
    label: getLabel(value),
    value,
  }))
}

export function buildStudentGenderOptions(
  getLabel: (value: StudentGenderOption) => string
): readonly HeroSelectFieldOption[] {
  return mapToOptions(STUDENT_GENDER_OPTIONS, getLabel)
}

export function buildStudentStatusOptions(
  getLabel: (value: StudentStatusOption) => string
): readonly HeroSelectFieldOption[] {
  return mapToOptions(STUDENT_STATUS_OPTIONS, getLabel)
}

export function buildStudentGuardianRelationOptions(
  getLabel: (value: StudentGuardianRelationOption) => string
): readonly HeroSelectFieldOption[] {
  return mapToOptions(STUDENT_GUARDIAN_RELATION_OPTIONS, getLabel)
}

export function buildStudentGrantTypeOptions(
  getLabel: (value: StudentGrantTypeOption) => string
): readonly HeroSelectFieldOption[] {
  return mapToOptions(STUDENT_GRANT_TYPE_OPTIONS, getLabel)
}

export function buildStudentMealPlanOptions(
  getLabel: (value: StudentMealPlanOption) => string
): readonly HeroSelectFieldOption[] {
  return mapToOptions(STUDENT_MEAL_PLAN_OPTIONS, getLabel)
}

export function buildStudentResidencePermitStatusOptions(
  getLabel: (value: StudentResidencePermitStatusOption) => string
): readonly HeroSelectFieldOption[] {
  return mapToOptions(STUDENT_RESIDENCE_PERMIT_STATUS_OPTIONS, getLabel)
}
