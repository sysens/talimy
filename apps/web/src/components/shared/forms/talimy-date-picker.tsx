"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button, Calendar, Label, Popover, PopoverContent, PopoverTrigger } from "@talimy/ui"
import { cn } from "@talimy/ui"

type TalimyDatePickerProps = {
  className?: string
  disabled?: boolean
  errorMessage?: string
  label: string
  name?: string
  onChange: (value: Date | undefined) => void
  value: Date | undefined
}

export function TalimyDatePicker({
  className,
  disabled = false,
  errorMessage,
  label,
  name,
  onChange,
  value,
}: TalimyDatePickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full flex justify-start text-left font-normal border-input rounded-[10px]",
              !value && "text-muted-foreground",
              errorMessage ? "border-destructive ring-1 ring-destructive/20" : ""
            )}
            id={name}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{value ? format(value, "dd.MM.yyyy") : "Sana tanlang"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-100" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      {errorMessage ? (
        <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}
