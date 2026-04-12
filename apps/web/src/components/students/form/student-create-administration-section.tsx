"use client"

import { Input, Label } from "@talimy/ui"
import { format } from "date-fns"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import type { HeroSelectFieldOption } from "@/components/shared/forms/hero-select-field"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import { TalimyDatePicker } from "@/components/shared/forms/talimy-date-picker"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"
import { stringToNativeDate } from "@/components/students/form/student-form.utils"

type StudentCreateAdministrationSectionProps = {
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
  gradeOptions: readonly HeroSelectFieldOption[]
  sectionOptions: readonly HeroSelectFieldOption[]
}

export function StudentCreateAdministrationSection({
  disabled = false,
  form,
  gradeOptions,
  sectionOptions,
}: StudentCreateAdministrationSectionProps) {
  const t = useTranslations("adminStudents.create")

  return (
    <FormSectionCard title={t("administration.title")}>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Controller
            control={form.control}
            name="grade"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("administration.gradeLabel")}
                options={gradeOptions}
                placeholder={t("administration.gradePlaceholder")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={form.control}
            name="section"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled || sectionOptions.length === 0}
                errorMessage={fieldState.error?.message}
                label={t("administration.sectionLabel")}
                options={sectionOptions}
                placeholder={t("administration.sectionPlaceholder")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="enrollmentDate"
          render={({ field, fieldState }) => (
            <TalimyDatePicker
              disabled={disabled}
              errorMessage={fieldState.error?.message}
              label={t("administration.enrollmentDateLabel")}
              name="student-enrollmentDate"
              value={stringToNativeDate(field.value)}
              onChange={(value) => field.onChange(value ? format(value, "yyyy-MM-dd") : "")}
            />
          )}
        />

        <Controller
          control={form.control}
          name="previousSchool"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="student-previous-school">
                {t("administration.previousSchoolLabel")}
              </Label>
              <Input
                id="student-previous-school"
                disabled={disabled}
                placeholder={t("administration.previousSchoolPlaceholder")}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
              />
              {fieldState.error?.message ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>
    </FormSectionCard>
  )
}
