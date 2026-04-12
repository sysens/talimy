"use client"

import { Input, Label, ReUI, Textarea } from "@talimy/ui"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"

type StudentCreateContactSectionProps = {
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
  onEmailEdited: () => void
}

export function StudentCreateContactSection({
  disabled = false,
  form,
  onEmailEdited,
}: StudentCreateContactSectionProps) {
  const t = useTranslations("adminStudents.create")

  return (
    <FormSectionCard title={t("contact.title")}>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="student-email">{t("contact.emailLabel")}</Label>
                <Input
                  id="student-email"
                  disabled={disabled}
                  placeholder={t("contact.emailPlaceholder")}
                  type="email"
                  value={field.value}
                  onChange={(event) => {
                    onEmailEdited()
                    field.onChange(event.target.value)
                  }}
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
            name="phone"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="mb-1 inline-block text-sm font-medium text-foreground">
                  {t("contact.phoneLabel")}
                </label>
                <ReUI.PhoneInput
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                  defaultCountry="UZ"
                  disabled={disabled}
                  international
                  value={field.value}
                  onChange={(value: string) => field.onChange(value)}
                />
                {fieldState.error?.message ? (
                  <p className="text-xs text-destructive">{fieldState.error.message}</p>
                ) : null}
              </div>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="student-address">{t("contact.addressLabel")}</Label>
              <Textarea
                id="student-address"
                disabled={disabled}
                placeholder={t("contact.addressPlaceholder")}
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
      </div>
    </FormSectionCard>
  )
}
