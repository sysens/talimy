import type { StudentCreateClassOption } from "@talimy/shared"

import type { HeroSelectFieldOption } from "@/components/shared/forms/hero-select-field"

export function buildStudentEmail(firstName: string, lastName: string, tenantSlug: string): string {
  const normalizedParts = [firstName, lastName]
    .map((value) =>
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "")
    )
    .filter((value) => value.length > 0)

  if (normalizedParts.length === 0) {
    return ""
  }

  return `${normalizedParts.join(".")}.student@${tenantSlug}.talimy.space`
}

export function buildStudentGradeOptions(
  options: readonly StudentCreateClassOption[]
): readonly HeroSelectFieldOption[] {
  const grades = [...new Set(options.map((option) => option.grade))]

  return grades.map((grade) => ({
    label: grade,
    value: grade,
  }))
}

export function buildStudentSectionOptions(
  options: readonly StudentCreateClassOption[],
  grade: string
): readonly HeroSelectFieldOption[] {
  const sections = [
    ...new Set(
      options.filter((option) => option.grade === grade).map((option) => option.section.trim())
    ),
  ]

  return sections.map((section) => ({
    label: section,
    value: section,
  }))
}

export function resolveStudentClassId(
  options: readonly StudentCreateClassOption[],
  grade: string,
  section: string
): string {
  const classOption = options.find(
    (option) => option.grade === grade && option.section.trim() === section.trim()
  )

  return classOption?.id ?? ""
}

export function resolveStudentClassFeeAmount(
  options: readonly StudentCreateClassOption[],
  classId: string
): number | null {
  const classOption = options.find((option) => option.id === classId)
  return classOption?.feeAmount ?? null
}

export function stringToNativeDate(value: string): Date | undefined {
  if (value.length === 0) {
    return undefined
  }

  const dateValue = new Date(value)
  return Number.isNaN(dateValue.getTime()) ? undefined : dateValue
}

export function parseOptionalNumber(value: string): number | null {
  const normalized = value.trim()
  if (normalized.length === 0) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}
