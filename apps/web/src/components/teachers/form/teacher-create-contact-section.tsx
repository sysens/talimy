"use client"

import { Input, Label, Textarea } from "@talimy/ui"
import { ReUI } from "@talimy/ui"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import type { TeacherCreateFormValues } from "@/components/teachers/form/teacher-form.schema"

type TeacherCreateContactSectionProps = {
  disabled?: boolean
  form: UseFormReturn<TeacherCreateFormValues>
}

export function TeacherCreateContactSection({
  disabled = false,
  form,
}: TeacherCreateContactSectionProps) {
  const t = useTranslations("adminTeachers.create")

  return (
    <FormSectionCard title={t("contact.title")}>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="teacher-email">{t("contact.emailLabel")}</Label>
                <Input
                  id="teacher-email"
                  disabled={disabled}
                  placeholder={t("contact.emailPlaceholder")}
                  type="email"
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
            name="phone"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="text-sm mb-1 inline-block font-medium text-foreground">
                  {t("contact.phoneLabel")}
                </label>
                <ReUI.PhoneInput
                  className="w-full"
                  defaultCountry="UZ"
                  disabled={disabled}
                  international
                  aria-invalid={fieldState.invalid}
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <Controller
            control={form.control}
            name="telegramUsername"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="teacher-telegramUsername">{t("contact.telegramLabel")}</Label>
                <Input
                  id="teacher-telegramUsername"
                  disabled={disabled}
                  placeholder={t("contact.telegramPlaceholder")}
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
            name="address"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="teacher-address">{t("contact.addressLabel")}</Label>
                <Textarea
                  id="teacher-address"
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
      </div>
    </FormSectionCard>
  )
}
