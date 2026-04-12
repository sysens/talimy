"use client"

import { Input, Label } from "@talimy/ui"
import type { StudentCreateFormOptions } from "@talimy/shared"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import { buildStudentGrantTypeOptions } from "@/components/students/form/student-form.constants"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"

type StudentCreateAcademicSectionProps = {
  classLabel: string
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
  formOptions: StudentCreateFormOptions
}

export function StudentCreateAcademicSection({
  classLabel,
  disabled = false,
  form,
  formOptions,
}: StudentCreateAcademicSectionProps) {
  const t = useTranslations("adminStudents.create")
  const grantTypeOptions = useMemo(
    () => buildStudentGrantTypeOptions((value) => t(`academic.grantTypeOptions.${value}`)),
    [t]
  )

  return (
    <FormSectionCard title={t("academic.title")}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="student-class-summary">{t("academic.classSummaryLabel")}</Label>
          <Input
            id="student-class-summary"
            disabled
            placeholder={t("academic.classSummaryPlaceholder")}
            value={classLabel}
          />
        </div>

        {formOptions.moduleSettings.grantEnabled ? (
          <Controller
            control={form.control}
            name="grantType"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("academic.grantTypeLabel")}
                options={grantTypeOptions}
                placeholder={t("academic.grantTypePlaceholder")}
                value={field.value}
                onChange={(value) => field.onChange(value as StudentCreateFormValues["grantType"])}
              />
            )}
          />
        ) : null}

        {formOptions.moduleSettings.financeEnabled ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Controller
              control={form.control}
              name="totalFee"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="student-total-fee">{t("academic.totalFeeLabel")}</Label>
                  <Input
                    id="student-total-fee"
                    disabled={disabled}
                    inputMode="decimal"
                    placeholder={t("academic.totalFeePlaceholder")}
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

            <Controller
              control={form.control}
              name="paidAmount"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="student-paid-amount">{t("academic.paidAmountLabel")}</Label>
                  <Input
                    id="student-paid-amount"
                    disabled={disabled}
                    inputMode="decimal"
                    placeholder={t("academic.paidAmountPlaceholder")}
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
        ) : null}
      </div>
    </FormSectionCard>
  )
}
