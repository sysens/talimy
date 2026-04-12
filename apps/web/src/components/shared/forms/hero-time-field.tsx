"use client"

import { TimeField, Label } from "@heroui/react"
import type { TimeValue } from "@heroui/react"
import { cn } from "@talimy/ui"

type HeroTimeFieldProps = {
  className?: string
  disabled?: boolean
  errorMessage?: string
  label: string
  name?: string
  onChange: (value: TimeValue | null) => void
  value: TimeValue | null
}

export function HeroTimeField({
  className,
  disabled = false,
  errorMessage,
  label,
  name,
  onChange,
  value,
}: HeroTimeFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <TimeField
        isDisabled={disabled}
        isInvalid={!!errorMessage}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full"
        aria-label={label}
      >
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <TimeField.Group
          className={cn(
            "flex min-h-[38px] w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none md:text-sm",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            errorMessage ? "border-destructive ring-3 ring-destructive/20" : "",
            disabled ? "cursor-not-allowed opacity-50 bg-input/50" : ""
          )}
        >
          <TimeField.Input className="flex-1">
            {(segment) => (
              <TimeField.Segment
                segment={segment}
                className="data-focused:bg-slate-200 data-focused:text-slate-900 focus:bg-slate-200 focus:text-slate-900 outline-none"
              />
            )}
          </TimeField.Input>
        </TimeField.Group>
      </TimeField>
      {errorMessage ? (
        <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}
