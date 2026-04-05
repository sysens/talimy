"use client"

import type { Key } from "@heroui/react"
import { ListBox, Select } from "@heroui/react"
import { cn } from "@talimy/ui"
import { useMemo } from "react"

import type { HeroSelectFieldOption } from "@/components/shared/forms/hero-select-field"

type HeroMultiSelectFieldProps = {
  className?: string
  disabled?: boolean
  errorMessage?: string
  label: string
  onChange: (value: string[]) => void
  options: readonly HeroSelectFieldOption[]
  placeholder: string
  value: readonly string[]
}

export function HeroMultiSelectField({
  className,
  disabled = false,
  errorMessage,
  label,
  onChange,
  options,
  placeholder,
  value,
}: HeroMultiSelectFieldProps) {
  const selectedLabels = useMemo(() => {
    return options
      .filter((option) => value.includes(option.value))
      .map((option) => option.label)
      .join(", ")
  }, [options, value])

  function handleChange(keys: Key[]) {
    onChange(keys.map((key) => String(key)))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="inline-block text-sm font-medium text-foreground">{label}</label>
      <Select
        isDisabled={disabled}
        selectionMode="multiple"
        value={value as Key[]}
        onChange={handleChange}
      >
        <Select.Trigger
          className={cn(
            "flex w-full min-w-0 py-0 items-center justify-between rounded-[10px] border-0 bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy shadow-none outline-none transition-colors",
            errorMessage ? "ring-2 ring-destructive/20" : ""
          )}
        >
          <Select.Value className="truncate text-left text-sm font-medium text-talimy-navy">
            {selectedLabels || placeholder}
          </Select.Value>
          <Select.Indicator className="size-4 text-talimy-navy/70" />
        </Select.Trigger>
        <Select.Popover className="rounded-xl border border-[var(--talimy-color-sky)]/35 bg-card/95 p-1 shadow-md backdrop-blur">
          <ListBox aria-label={label} className="outline-none" selectionMode="multiple">
            {options.map((option) => (
              <ListBox.Item
                key={option.value}
                id={option.value}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-talimy-navy transition data-[focused]:bg-[var(--talimy-color-sky)]/55 data-[selected]:bg-[var(--talimy-color-pink)]/70 data-[selected]:font-semibold data-[selected]:text-talimy-navy"
                textValue={option.label}
              >
                {option.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
    </div>
  )
}
