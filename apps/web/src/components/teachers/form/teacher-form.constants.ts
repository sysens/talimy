import type { HeroSelectFieldOption } from "@/components/shared/forms/hero-select-field"

export const TEACHER_NATIONALITY_OPTIONS = [
  "uzbek",
  "kazakh",
  "kyrgyz",
  "russian",
  "tajik",
  "turkish",
  "other",
] as const

export const TEACHER_GENDER_OPTIONS = ["male", "female"] as const
export const TEACHER_STATUS_OPTIONS = ["active", "inactive"] as const
export const TEACHER_EMPLOYMENT_OPTIONS = ["full_time", "part_time", "substitute"] as const

export type TeacherNationalityOption = (typeof TEACHER_NATIONALITY_OPTIONS)[number]
export type TeacherGenderOption = (typeof TEACHER_GENDER_OPTIONS)[number]
export type TeacherStatusOption = (typeof TEACHER_STATUS_OPTIONS)[number]
export type TeacherEmploymentOption = (typeof TEACHER_EMPLOYMENT_OPTIONS)[number]

export function buildTeacherNationalityOptions(
  getLabel: (value: TeacherNationalityOption) => string
): readonly HeroSelectFieldOption[] {
  return TEACHER_NATIONALITY_OPTIONS.map((value) => ({
    label: getLabel(value),
    value,
  }))
}

export function buildTeacherGenderOptions(
  getLabel: (value: TeacherGenderOption) => string
): readonly HeroSelectFieldOption[] {
  return TEACHER_GENDER_OPTIONS.map((value) => ({
    label: getLabel(value),
    value,
  }))
}
