"use client"

import { Input, Label } from "@talimy/ui"
import type { StudentCreateFormOptions } from "@talimy/shared"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import {
  buildStudentMealPlanOptions,
  buildStudentResidencePermitStatusOptions,
} from "@/components/students/form/student-form.constants"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"

type StudentCreateModulesSectionProps = {
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
  formOptions: StudentCreateFormOptions
}

export function StudentCreateModulesSection({
  disabled = false,
  form,
  formOptions,
}: StudentCreateModulesSectionProps) {
  const t = useTranslations("adminStudents.create")
  const mealPlanOptions = useMemo(
    () => buildStudentMealPlanOptions((value) => t(`modules.mealsOptions.${value}`)),
    [t]
  )
  const residencePermitOptions = useMemo(
    () =>
      buildStudentResidencePermitStatusOptions((value) =>
        t(`modules.residencePermitOptions.${value}`)
      ),
    [t]
  )
  const hasAnyModuleField = Object.values(formOptions.moduleSettings).some(Boolean)

  if (!hasAnyModuleField) {
    return null
  }

  return (
    <FormSectionCard title={t("modules.title")}>
      <div className="space-y-5">
        {formOptions.moduleSettings.dormitoryEnabled ? (
          <Controller
            control={form.control}
            name="dormitoryRoom"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="student-dormitory-room">{t("modules.dormitoryRoomLabel")}</Label>
                <Input
                  id="student-dormitory-room"
                  disabled={disabled}
                  placeholder={t("modules.dormitoryRoomPlaceholder")}
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
        ) : null}

        {formOptions.moduleSettings.mealsEnabled ? (
          <Controller
            control={form.control}
            name="mealsPerDay"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("modules.mealsLabel")}
                options={mealPlanOptions}
                placeholder={t("modules.mealsPlaceholder")}
                value={field.value}
                onChange={(value) =>
                  field.onChange(value as StudentCreateFormValues["mealsPerDay"])
                }
              />
            )}
          />
        ) : null}

        {formOptions.moduleSettings.residencePermitEnabled ? (
          <Controller
            control={form.control}
            name="residencePermitStatus"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("modules.residencePermitLabel")}
                options={residencePermitOptions}
                placeholder={t("modules.residencePermitPlaceholder")}
                value={field.value}
                onChange={(value) =>
                  field.onChange(value as StudentCreateFormValues["residencePermitStatus"])
                }
              />
            )}
          />
        ) : null}

        {formOptions.moduleSettings.contractNumberEnabled ? (
          <Controller
            control={form.control}
            name="contractNumber"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="student-contract-number">{t("modules.contractNumberLabel")}</Label>
                <Input
                  id="student-contract-number"
                  disabled={disabled}
                  placeholder={t("modules.contractNumberPlaceholder")}
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
        ) : null}
      </div>
    </FormSectionCard>
  )
}
