"use client"

import { Input, Label, ReUI } from "@talimy/ui"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import { StudentCreateGuardianCard } from "@/components/students/form/student-create-guardian-card"
import { buildStudentGuardianRelationOptions } from "@/components/students/form/student-form.constants"
import type { StudentCreateFormValues } from "@/components/students/form/student-form.schema"

type StudentCreateGuardianSectionProps = {
  disabled?: boolean
  form: UseFormReturn<StudentCreateFormValues>
}

type StudentGuardianNameFieldPath =
  | "guardians.father.firstName"
  | "guardians.father.lastName"
  | "guardians.mother.firstName"
  | "guardians.mother.lastName"
  | "guardians.alternative.firstName"
  | "guardians.alternative.lastName"

type StudentGuardianPhoneFieldPath =
  | "guardians.father.phone"
  | "guardians.mother.phone"
  | "guardians.alternative.phone"

function StudentGuardianTextField({
  disabled,
  form,
  label,
  name,
  placeholder,
}: {
  disabled: boolean
  form: UseFormReturn<StudentCreateFormValues>
  label: string
  name: StudentGuardianNameFieldPath
  placeholder: string
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input
            disabled={disabled}
            placeholder={placeholder}
            value={field.value}
            onChange={(event) => field.onChange(event.target.value)}
          />
          {fieldState.error?.message ? (
            <p className="text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}

function StudentGuardianPhoneField({
  disabled,
  form,
  label,
  name,
}: {
  disabled: boolean
  form: UseFormReturn<StudentCreateFormValues>
  label: string
  name: StudentGuardianPhoneFieldPath
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <label className="mb-1 inline-block text-sm font-medium text-foreground">{label}</label>
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
  )
}

export function StudentCreateGuardianSection({
  disabled = false,
  form,
}: StudentCreateGuardianSectionProps) {
  const t = useTranslations("adminStudents.create")
  const relationOptions = useMemo(
    () => buildStudentGuardianRelationOptions((value) => t(`guardians.relationOptions.${value}`)),
    [t]
  )

  return (
    <FormSectionCard title={t("guardians.title")}>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <StudentCreateGuardianCard title={t("guardians.fatherTitle")}>
            <StudentGuardianTextField
              disabled={disabled}
              form={form}
              label={t("guardians.nameLabel")}
              name="guardians.father.firstName"
              placeholder={t("guardians.firstNamePlaceholder")}
            />
            <StudentGuardianTextField
              disabled={disabled}
              form={form}
              label={t("guardians.lastNameLabel")}
              name="guardians.father.lastName"
              placeholder={t("guardians.lastNamePlaceholder")}
            />
            <StudentGuardianPhoneField
              disabled={disabled}
              form={form}
              label={t("guardians.phoneLabel")}
              name="guardians.father.phone"
            />
          </StudentCreateGuardianCard>

          <StudentCreateGuardianCard title={t("guardians.motherTitle")}>
            <StudentGuardianTextField
              disabled={disabled}
              form={form}
              label={t("guardians.nameLabel")}
              name="guardians.mother.firstName"
              placeholder={t("guardians.firstNamePlaceholder")}
            />
            <StudentGuardianTextField
              disabled={disabled}
              form={form}
              label={t("guardians.lastNameLabel")}
              name="guardians.mother.lastName"
              placeholder={t("guardians.lastNamePlaceholder")}
            />
            <StudentGuardianPhoneField
              disabled={disabled}
              form={form}
              label={t("guardians.phoneLabel")}
              name="guardians.mother.phone"
            />
          </StudentCreateGuardianCard>
        </div>

        <StudentCreateGuardianCard title={t("guardians.alternativeTitle")}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(220px,0.9fr)]">
            <StudentGuardianTextField
              disabled={disabled}
              form={form}
              label={t("guardians.nameLabel")}
              name="guardians.alternative.firstName"
              placeholder={t("guardians.firstNamePlaceholder")}
            />
            <StudentGuardianTextField
              disabled={disabled}
              form={form}
              label={t("guardians.lastNameLabel")}
              name="guardians.alternative.lastName"
              placeholder={t("guardians.lastNamePlaceholder")}
            />
            <Controller
              control={form.control}
              name="guardians.alternative.relation"
              render={({ field, fieldState }) => (
                <HeroSelectField
                  disabled={disabled}
                  errorMessage={fieldState.error?.message}
                  label={t("guardians.relationLabel")}
                  options={relationOptions}
                  placeholder={t("guardians.relationPlaceholder")}
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(
                      value as StudentCreateFormValues["guardians"]["alternative"]["relation"]
                    )
                  }
                />
              )}
            />
          </div>
          <StudentGuardianPhoneField
            disabled={disabled}
            form={form}
            label={t("guardians.phoneLabel")}
            name="guardians.alternative.phone"
          />
        </StudentCreateGuardianCard>
      </div>
    </FormSectionCard>
  )
}
