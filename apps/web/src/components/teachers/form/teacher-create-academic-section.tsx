"use client"

import { parseDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import type { TeacherCreateFormOptions } from "@talimy/shared"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { TalimyDatePicker } from "@/components/shared/forms/talimy-date-picker"
import { HeroMultiSelectField } from "@/components/shared/forms/hero-multi-select-field"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import type { TeacherCreateFormValues } from "@/components/teachers/form/teacher-form.schema"

type TeacherCreateAcademicSectionProps = {
  disabled?: boolean
  form: UseFormReturn<TeacherCreateFormValues>
  options: TeacherCreateFormOptions
}

import { format } from "date-fns"

function stringToNativeDate(value: string): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

export function TeacherCreateAcademicSection({
  disabled = false,
  form,
  options,
}: TeacherCreateAcademicSectionProps) {
  const t = useTranslations("adminTeachers.create")
  const subjectOptions = useMemo(
    () =>
      options.subjects.map((option) => ({
        label: option.label,
        value: option.id,
      })),
    [options.subjects]
  )
  const classOptions = useMemo(
    () =>
      options.classes.map((option) => ({
        label: option.label,
        value: option.id,
      })),
    [options.classes]
  )
  const employmentTypeOptions = useMemo(
    () => [
      { value: "full_time", label: t("academic.employmentTypeOptions.fullTime") },
      { value: "part_time", label: t("academic.employmentTypeOptions.partTime") },
      { value: "substitute", label: t("academic.employmentTypeOptions.hourly") },
    ],
    [t]
  )

  return (
    <FormSectionCard title={t("academic.title")}>
      <div className="space-y-5">
        <Controller
          control={form.control}
          name="subjectIds"
          render={({ field, fieldState }) => (
            <HeroMultiSelectField
              disabled={disabled}
              errorMessage={fieldState.error?.message}
              label={t("academic.subjectsLabel")}
              options={subjectOptions}
              placeholder={t("academic.subjectsPlaceholder")}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={form.control}
          name="classIds"
          render={({ field, fieldState }) => (
            <HeroMultiSelectField
              disabled={disabled}
              errorMessage={fieldState.error?.message}
              label={t("academic.classesLabel")}
              options={classOptions}
              placeholder={t("academic.classesPlaceholder")}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={form.control}
          name="employmentType"
          render={({ field, fieldState }) => (
            <HeroSelectField
              disabled={disabled}
              errorMessage={fieldState.error?.message}
              label={t("academic.employmentTypeLabel")}
              options={employmentTypeOptions}
              placeholder={t("academic.employmentTypePlaceholder")}
              value={field.value}
              onChange={(value) =>
                field.onChange(value as TeacherCreateFormValues["employmentType"])
              }
            />
          )}
        />

        <Controller
          control={form.control}
          name="joinDate"
          render={({ field, fieldState }) => (
            <TalimyDatePicker
              disabled={disabled}
              errorMessage={fieldState.error?.message}
              label={t("academic.joinDateLabel")}
              name="joinDate"
              value={stringToNativeDate(field.value)}
              onChange={(val) => field.onChange(val ? format(val, "yyyy-MM-dd") : "")}
            />
          )}
        />
      </div>
    </FormSectionCard>
  )
}
