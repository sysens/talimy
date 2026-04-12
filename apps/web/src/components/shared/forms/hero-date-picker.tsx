"use client"

import { Calendar, DateField, DatePicker, Label } from "@heroui/react"
import type { DateValue } from "@internationalized/date"
import { cn } from "@talimy/ui"

type HeroDatePickerProps = {
  className?: string
  disabled?: boolean
  errorMessage?: string
  label: string
  name?: string
  onChange: (value: DateValue | null) => void
  value: DateValue | null
}

export function HeroDatePicker({
  className,
  disabled = false,
  errorMessage,
  label,
  name,
  onChange,
  value,
}: HeroDatePickerProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <DatePicker
        isDisabled={disabled}
        isInvalid={!!errorMessage}
        name={name}
        value={value}
        onChange={onChange}
        aria-label={label}
      >
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <DateField.Group
          fullWidth
          className={cn(
            "flex min-h-[38px] w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none md:text-sm max-w-full",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            errorMessage ? "border-destructive ring-3 ring-destructive/20" : "",
            disabled ? "cursor-not-allowed opacity-50 bg-input/50" : ""
          )}
        >
          <DateField.Input className="flex-1">
            {(segment) => (
              <DateField.Segment
                segment={segment}
                className="data-[focused]:bg-slate-200 data-[focused]:text-slate-900 focus:bg-slate-200 focus:text-slate-900 outline-none"
              />
            )}
          </DateField.Input>
          <DateField.Suffix>
            <DatePicker.Trigger>
              <DatePicker.TriggerIndicator />
            </DatePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
        <DatePicker.Popover className="z-[100]">
          <Calendar aria-label={label}>
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
            </Calendar.Grid>
            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
      </DatePicker>
      {errorMessage ? (
        <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}
