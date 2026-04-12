"use client"

import { Label, Switch, Textarea } from "@talimy/ui"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"

type StudentCreateAdditionalSectionProps = {
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
}

export function StudentCreateAdditionalSection({
  disabled = false,
  form,
}: StudentCreateAdditionalSectionProps) {
  const t = useTranslations("adminStudents.create")
  const showMedicalConditionDetails = form.watch("medicalConditionAlert")

  return (
    <FormSectionCard title={t("additional.title")}>
      <div className="space-y-5">
        <Controller
          control={form.control}
          name="hobbiesInterests"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="student-hobbies">{t("additional.hobbiesLabel")}</Label>
              <Textarea
                id="student-hobbies"
                disabled={disabled}
                placeholder={t("additional.hobbiesPlaceholder")}
                rows={3}
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
          name="specialNeedsSupport"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {t("additional.specialNeedsLabel")}
                </p>
                <p className="text-xs text-slate-500">{t("additional.specialNeedsDescription")}</p>
              </div>
              <Switch checked={field.value} disabled={disabled} onCheckedChange={field.onChange} />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="medicalConditionAlert"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {t("additional.medicalConditionLabel")}
                </p>
                <p className="text-xs text-slate-500">
                  {t("additional.medicalConditionDescription")}
                </p>
              </div>
              <Switch checked={field.value} disabled={disabled} onCheckedChange={field.onChange} />
            </div>
          )}
        />

        {showMedicalConditionDetails ? (
          <Controller
            control={form.control}
            name="medicalConditionDetails"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="student-medical-details">
                  {t("additional.medicalConditionDetailsLabel")}
                </Label>
                <Textarea
                  id="student-medical-details"
                  disabled={disabled}
                  placeholder={t("additional.medicalConditionDetailsPlaceholder")}
                  rows={4}
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
