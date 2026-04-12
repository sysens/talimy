"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@talimy/ui"
import { createEventFormSchema } from "@talimy/shared"
import { Controller, useForm } from "react-hook-form"
import { sileo } from "sileo"
import type { z } from "zod"
import { parseDate, parseTime } from "@internationalized/date"

import { HeroDatePicker } from "@/components/shared/forms/hero-date-picker"
import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import { HeroTimeField } from "@/components/shared/forms/hero-time-field"

import { createAdminCalendarEvent } from "@/components/admin/calendar/admin-calendar-api"
import { adminCalendarQueryKeys } from "@/components/admin/calendar/admin-calendar-query-keys"
import type { CalendarPageCategory } from "@/components/shared/calendar-page/calendar-page.types"

type AddAgendaModalProps = {
  defaultDate: string
  labels: {
    actions: {
      cancel: string
      submit: string
      submitting: string
    }
    description: string
    fields: {
      category: string
      date: string
      endTime: string
      location: string
      notes: string
      startTime: string
      title: string
      visibility: string
    }
    title: string
    toasts: {
      errorDescription: string
      errorTitle: string
      successDescription: string
      successTitle: string
    }
  }
  onOpenChange: (open: boolean) => void
  open: boolean
  optionLabels: {
    categories: Record<CalendarPageCategory, string>
    visibility: Record<"admin" | "all" | "students" | "teachers", string>
  }
}

type AddAgendaFormValues = z.input<typeof createEventFormSchema>
type AddAgendaSubmitValues = z.output<typeof createEventFormSchema>

function toIsoDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString()
}

export function AddAgendaModal({
  defaultDate,
  labels,
  onOpenChange,
  open,
  optionLabels,
}: AddAgendaModalProps) {
  const queryClient = useQueryClient()
  const form = useForm<AddAgendaFormValues, undefined, AddAgendaSubmitValues>({
    defaultValues: {
      date: defaultDate,
      description: "",
      endTime: "11:00",
      location: "",
      startTime: "09:00",
      title: "",
      type: "academic",
      visibility: "all",
    },
    resolver: zodResolver(createEventFormSchema),
  })

  const createMutation = useMutation({
    mutationFn: (values: AddAgendaSubmitValues) =>
      createAdminCalendarEvent({
        description: values.description?.trim() ? values.description.trim() : undefined,
        endDate: toIsoDateTime(values.date, values.endTime),
        location: values.location?.trim() ? values.location.trim() : undefined,
        startDate: toIsoDateTime(values.date, values.startTime),
        title: values.title.trim(),
        type: values.type,
        visibility: values.visibility,
      }),
    onError: () => {
      sileo.error({
        description: labels.toasts.errorDescription,
        title: labels.toasts.errorTitle,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminCalendarQueryKeys.all })
      sileo.success({
        description: labels.toasts.successDescription,
        title: labels.toasts.successTitle,
      })
      form.reset({
        date: defaultDate,
        description: "",
        endTime: "11:00",
        location: "",
        startTime: "09:00",
        title: "",
        type: "academic",
        visibility: "all",
      })
      onOpenChange(false)
    },
  })

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[600px] rounded-[24px] border-slate-100 p-0">
        <form
          className="space-y-6 p-6"
          onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold text-talimy-navy">
              {labels.title}
            </DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </DialogHeader>

          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="agenda-title">{labels.fields.title}</Label>
                <Input
                  id="agenda-title"
                  onChange={(event) => field.onChange(event.target.value)}
                  value={field.value}
                />
                {fieldState.error?.message ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <HeroSelectField
                  label={labels.fields.category}
                  onChange={field.onChange}
                  options={[
                    { label: optionLabels.categories.academic, value: "academic" },
                    { label: optionLabels.categories.events, value: "events" },
                    { label: optionLabels.categories.finance, value: "finance" },
                    { label: optionLabels.categories.administration, value: "administration" },
                  ]}
                  placeholder={optionLabels.categories.academic}
                  value={field.value ?? ""}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="visibility"
              render={({ field, fieldState }) => (
                <HeroSelectField
                  label={labels.fields.visibility}
                  onChange={field.onChange}
                  options={[
                    { label: optionLabels.visibility.all, value: "all" },
                    { label: optionLabels.visibility.admin, value: "admin" },
                    { label: optionLabels.visibility.teachers, value: "teachers" },
                    { label: optionLabels.visibility.students, value: "students" },
                  ]}
                  placeholder={optionLabels.visibility.all}
                  value={field.value ?? ""}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <HeroDatePicker
                  label={labels.fields.date}
                  onChange={(val) => field.onChange(val ? val.toString() : "")}
                  value={field.value ? parseDate(field.value) : null}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <HeroTimeField
                  label={labels.fields.startTime}
                  onChange={(val) => field.onChange(val ? val.toString().substring(0, 5) : "")}
                  value={field.value ? parseTime(field.value) : null}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <HeroTimeField
                  label={labels.fields.endTime}
                  onChange={(val) => field.onChange(val ? val.toString().substring(0, 5) : "")}
                  value={field.value ? parseTime(field.value) : null}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="location"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="agenda-location">{labels.fields.location}</Label>
                <Input
                  id="agenda-location"
                  onChange={(event) => field.onChange(event.target.value)}
                  value={field.value ?? ""}
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
            name="description"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="agenda-notes">{labels.fields.notes}</Label>
                <Textarea
                  id="agenda-notes"
                  onChange={(event) => field.onChange(event.target.value)}
                  rows={4}
                  value={field.value ?? ""}
                />
                {fieldState.error?.message ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <DialogFooter className="gap-2 sm:justify-end">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              {labels.actions.cancel}
            </Button>
            <Button
              className="bg-talimy-pink text-talimy-navy hover:bg-talimy-pink/90"
              disabled={createMutation.isPending}
              type="submit"
            >
              {createMutation.isPending ? labels.actions.submitting : labels.actions.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
