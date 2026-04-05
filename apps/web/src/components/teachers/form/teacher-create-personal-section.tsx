"use client"

import { Input, Label } from "@talimy/ui"
import { parseDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { TalimyDatePicker } from "@/components/shared/forms/talimy-date-picker"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import { ProfileImageUploadField } from "@/components/shared/forms/profile-image-upload-field"
import {
  buildTeacherGenderOptions,
  buildTeacherNationalityOptions,
} from "@/components/teachers/form/teacher-form.constants"
import type { TeacherCreateFormValues } from "@/components/teachers/form/teacher-form.schema"

type TeacherCreatePersonalSectionProps = {
  allowedGenders: readonly ("female" | "male")[]
  avatarFile: File | null
  disabled?: boolean
  form: UseFormReturn<TeacherCreateFormValues>
  onAvatarFileChange: (file: File | null) => void
}

import { format } from "date-fns"

function stringToNativeDate(value: string): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

export function TeacherCreatePersonalSection({
  allowedGenders,
  avatarFile,
  disabled = false,
  form,
  onAvatarFileChange,
}: TeacherCreatePersonalSectionProps) {
  const t = useTranslations("adminTeachers.create")
  const statusOptions = useMemo(
    () => [
      { value: "active", label: t("personal.statusOptions.active") },
      { value: "inactive", label: t("personal.statusOptions.inactive") },
    ],
    [t]
  )
  const genderOptions = useMemo(
    () =>
      buildTeacherGenderOptions((value) =>
        value === "male" ? t("personal.genderOptions.male") : t("personal.genderOptions.female")
      ).filter((option) => allowedGenders.includes(option.value as "female" | "male")),
    [allowedGenders, t]
  )
  const nationalityOptions = useMemo(
    () => buildTeacherNationalityOptions((value) => t(`personal.nationalityOptions.${value}`)),
    [t]
  )

  return (
    <FormSectionCard title={t("personal.title")}>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="teacher-firstName">{t("personal.firstNameLabel")}</Label>
                <Input
                  id="teacher-firstName"
                  disabled={disabled}
                  placeholder={t("personal.firstNamePlaceholder")}
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
            name="lastName"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="teacher-lastName">{t("personal.lastNameLabel")}</Label>
                <Input
                  id="teacher-lastName"
                  disabled={disabled}
                  placeholder={t("personal.lastNamePlaceholder")}
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
            name="middleName"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="teacher-middleName">{t("personal.middleNameLabel")}</Label>
                <Input
                  id="teacher-middleName"
                  disabled={disabled}
                  placeholder={t("personal.middleNamePlaceholder")}
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,220px)_minmax(0,260px)]">
          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <TalimyDatePicker
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("personal.dateOfBirthLabel")}
                name="dateOfBirth"
                value={stringToNativeDate(field.value)}
                onChange={(val) => field.onChange(val ? format(val, "yyyy-MM-dd") : "")}
              />
            )}
          />

          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("personal.genderLabel")}
                options={genderOptions}
                placeholder={t("personal.genderPlaceholder")}
                value={field.value}
                onChange={(value) => field.onChange(value as TeacherCreateFormValues["gender"])}
              />
            )}
          />

          <ProfileImageUploadField
            changeLabel={t("personal.avatar.changeLabel")}
            disabled={disabled}
            emptyLabel={t("personal.avatar.previewLabel")}
            label={t("personal.avatar.label")}
            noImageLabel={avatarFile?.name ?? t("personal.avatar.emptyLabel")}
            onFileChange={onAvatarFileChange}
            removeLabel={t("personal.avatar.removeLabel")}
            uploadErrorTitle={t("personal.avatar.uploadErrorTitle")}
            uploadLabel={t("personal.avatar.uploadLabel")}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Controller
            control={form.control}
            name="nationality"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("personal.nationalityLabel")}
                options={nationalityOptions}
                placeholder={t("personal.nationalityPlaceholder")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled}
                errorMessage={fieldState.error?.message}
                label={t("personal.statusLabel")}
                options={statusOptions}
                placeholder={t("personal.statusPlaceholder")}
                value={field.value}
                onChange={(value) => field.onChange(value as TeacherCreateFormValues["status"])}
              />
            )}
          />
        </div>
      </div>
    </FormSectionCard>
  )
}
