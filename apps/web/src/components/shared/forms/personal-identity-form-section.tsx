"use client"

import type { FieldValues, Path, UseFormReturn } from "react-hook-form"

import { Controller } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@talimy/ui"

import { FormDatePickerField } from "@/components/shared/forms/form-date-picker-field"
import { RadioCardGroup, type RadioCardOption } from "@/components/shared/forms/radio-card-group"

type SelectOption = {
  label: string
  value: string
}

type PersonalIdentityFormSectionProps<TFieldValues extends FieldValues> = {
  birthDateLabel: string
  birthDateName: Path<TFieldValues>
  birthDatePlaceholder: string
  className?: string
  description?: string
  firstNameLabel: string
  firstNameName: Path<TFieldValues>
  firstNamePlaceholder: string
  form: UseFormReturn<TFieldValues>
  genderLabel: string
  genderName: Path<TFieldValues>
  genderOptions: readonly RadioCardOption[]
  lastNameLabel: string
  lastNameName: Path<TFieldValues>
  lastNamePlaceholder: string
  locale: string
  nationalityLabel?: string
  nationalityName?: Path<TFieldValues>
  nationalityOptions?: readonly SelectOption[]
  nationalityPlaceholder?: string
  recordIdLabel: string
  recordIdValue: string
  statusLabel?: string
  statusName?: Path<TFieldValues>
  statusOptions?: readonly RadioCardOption[]
  title: string
}

export function PersonalIdentityFormSection<TFieldValues extends FieldValues>({
  birthDateLabel,
  birthDateName,
  birthDatePlaceholder,
  className,
  description,
  firstNameLabel,
  firstNameName,
  firstNamePlaceholder,
  form,
  genderLabel,
  genderName,
  genderOptions,
  lastNameLabel,
  lastNameName,
  lastNamePlaceholder,
  locale,
  nationalityLabel,
  nationalityName,
  nationalityOptions,
  nationalityPlaceholder,
  recordIdLabel,
  recordIdValue,
  statusLabel,
  statusName,
  statusOptions,
  title,
}: PersonalIdentityFormSectionProps<TFieldValues>) {
  const firstNameState = form.getFieldState(firstNameName, form.formState)
  const lastNameState = form.getFieldState(lastNameName, form.formState)
  const birthDateState = form.getFieldState(birthDateName, form.formState)
  const nationalityState = nationalityName
    ? form.getFieldState(nationalityName, form.formState)
    : null
  const genderState = form.getFieldState(genderName, form.formState)
  const statusState = statusName ? form.getFieldState(statusName, form.formState) : null

  return (
    <Card className={className}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg text-[var(--talimy-color-navy)]">{title}</CardTitle>
        {description ? (
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        <FieldSet className="space-y-5">
          <Field className="max-w-[220px]">
            <FieldLabel>{recordIdLabel}</FieldLabel>
            <Input
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-500"
              disabled
              value={recordIdValue}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>{firstNameLabel}</FieldLabel>
              <Input
                {...form.register(firstNameName)}
                className="h-11 rounded-2xl border-slate-200 px-4"
                placeholder={firstNamePlaceholder}
              />
              <FieldError errors={[firstNameState.error]} />
            </Field>

            <Field>
              <FieldLabel>{lastNameLabel}</FieldLabel>
              <Input
                {...form.register(lastNameName)}
                className="h-11 rounded-2xl border-slate-200 px-4"
                placeholder={lastNamePlaceholder}
              />
              <FieldError errors={[lastNameState.error]} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>{birthDateLabel}</FieldLabel>
              <Controller
                control={form.control}
                name={birthDateName}
                render={({ field }) => (
                  <FormDatePickerField
                    locale={locale}
                    onChange={field.onChange}
                    placeholder={birthDatePlaceholder}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
              />
              <FieldError errors={[birthDateState.error]} />
            </Field>

            {nationalityLabel && nationalityName && nationalityOptions && nationalityPlaceholder ? (
              <Field>
                <FieldLabel>{nationalityLabel}</FieldLabel>
                <Controller
                  control={form.control}
                  name={nationalityName}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={
                        typeof field.value === "string" && field.value ? field.value : undefined
                      }
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 px-4">
                        <SelectValue placeholder={nationalityPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={nationalityState ? [nationalityState.error] : []} />
              </Field>
            ) : null}
          </div>

          <Field>
            <FieldLabel>{genderLabel}</FieldLabel>
            <Controller
              control={form.control}
              name={genderName}
              render={({ field }) => (
                <RadioCardGroup
                  onValueChange={field.onChange}
                  options={genderOptions}
                  value={typeof field.value === "string" ? field.value : ""}
                />
              )}
            />
            <FieldError errors={[genderState.error]} />
          </Field>

          {statusLabel && statusName && statusOptions ? (
            <Field>
              <FieldLabel>{statusLabel}</FieldLabel>
              <Controller
                control={form.control}
                name={statusName}
                render={({ field }) => (
                  <RadioCardGroup
                    onValueChange={field.onChange}
                    options={statusOptions}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
              />
              <FieldError errors={statusState ? [statusState.error] : []} />
            </Field>
          ) : null}
        </FieldSet>
      </CardContent>
    </Card>
  )
}
