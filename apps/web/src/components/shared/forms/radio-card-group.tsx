"use client"

import { RadioGroup, RadioGroupItem, cn } from "@talimy/ui"

export type RadioCardOption = {
  description?: string
  label: string
  value: string
}

type RadioCardGroupProps = {
  className?: string
  optionClassName?: string
  options: readonly RadioCardOption[]
  value: string
  onValueChange: (value: string) => void
}

export function RadioCardGroup({
  className,
  onValueChange,
  optionClassName,
  options,
  value,
}: RadioCardGroupProps) {
  return (
    <RadioGroup
      className={cn("grid gap-3 sm:grid-cols-2", className)}
      onValueChange={onValueChange}
      value={value}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300",
            optionClassName
          )}
          htmlFor={`radio-card-${option.value}`}
        >
          <RadioGroupItem className="mt-1" id={`radio-card-${option.value}`} value={option.value} />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-950">{option.label}</p>
            {option.description ? (
              <p className="text-xs leading-5 text-slate-500">{option.description}</p>
            ) : null}
          </div>
        </label>
      ))}
    </RadioGroup>
  )
}
