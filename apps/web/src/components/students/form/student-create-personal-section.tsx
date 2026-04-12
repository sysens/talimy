"use client"

import { Input, Label } from "@talimy/ui"
import { format } from "date-fns"
import type { StudentCreateFormOptions } from "@talimy/shared"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import { ProfileImageUploadField } from "@/components/shared/forms/profile-image-upload-field"
import { TalimyDatePicker } from "@/components/shared/forms/talimy-date-picker"
import { buildStudentGenderOptions } from "@/components/students/form/student-form.constants"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"
import { stringToNativeDate } from "@/components/students/form/student-form.utils"

type StudentCreatePersonalSectionProps = {
  avatarFile: File | null
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
  formOptions: StudentCreateFormOptions
  onAvatarFileChange: (file: File | null) => void
}

export function StudentCreatePersonalSection({
  avatarFile,
  disabled = false,
  form,
  formOptions,
  onAvatarFileChange,
}: StudentCreatePersonalSectionProps) {
  const t = useTranslations("adminStudents.create")
  const genderOptions = useMemo(
    () =>
      buildStudentGenderOptions((value) =>
        value === "male" ? t("personal.genderOptions.male") : t("personal.genderOptions.female")
      ).filter((option) => formOptions.allowedGenders.includes(option.value as "female" | "male")),
    [formOptions.allowedGenders, t]
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
                <Label htmlFor="student-firstName">{t("personal.firstNameLabel")}</Label>
                <Input
                  id="student-firstName"
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
                <Label htmlFor="student-lastName">{t("personal.lastNameLabel")}</Label>
                <Input
                  id="student-lastName"
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
                <Label htmlFor="student-middleName">{t("personal.middleNameLabel")}</Label>
                <Input
                  id="student-middleName"
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
                name="student-dateOfBirth"
                value={stringToNativeDate(field.value)}
                onChange={(value) => field.onChange(value ? format(value, "yyyy-MM-dd") : "")}
              />
            )}
          />

          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <HeroSelectField
                disabled={disabled || formOptions.allowedGenders.length === 1}
                errorMessage={fieldState.error?.message}
                label={t("personal.genderLabel")}
                options={genderOptions}
                placeholder={t("personal.genderPlaceholder")}
                value={field.value}
                onChange={(value) => field.onChange(value as StudentCreateFormValues["gender"])}
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
      </div>
    </FormSectionCard>
  )
}
