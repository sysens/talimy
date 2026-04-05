"use client"

import { CalendarIcon } from "lucide-react"
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger, cn } from "@talimy/ui"

type FormDatePickerFieldProps = {
  className?: string
  disabled?: boolean
  locale: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}

export function FormDatePickerField({
  className,
  disabled = false,
  locale,
  onChange,
  placeholder,
  value,
}: FormDatePickerFieldProps) {
  const selectedDate = parseIsoDate(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-11 w-full justify-between rounded-2xl border-slate-200 px-4 text-left text-sm font-medium shadow-none",
            selectedDate ? "text-slate-700" : "text-slate-400",
            className
          )}
          disabled={disabled}
          type="button"
          variant="outline"
        >
          <span>{selectedDate ? formatDisplayDate(selectedDate, locale) : placeholder}</span>
          <CalendarIcon className="size-4 text-slate-400" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto rounded-2xl border-slate-200 p-0">
        <Calendar
          disabled={(date) => date > new Date()}
          mode="single"
          onSelect={(date) => {
            if (!date) {
              return
            }

            onChange(formatIsoDate(date))
          }}
          selected={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}

function parseIsoDate(value: string): Date | undefined {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split("-").map((segment) => Number(segment))
  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function formatIsoDate(value: Date): string {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, "0")
  const day = `${value.getDate()}`.padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDisplayDate(value: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value)
}
