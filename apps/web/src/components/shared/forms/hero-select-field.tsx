"use client"

import { ListBox, Select } from "@heroui/react"
import { cn } from "@talimy/ui"

export type HeroSelectFieldOption = {
  label: string
  value: string
}

type HeroSelectFieldProps = {
  className?: string
  disabled?: boolean
  errorMessage?: string
  label: string
  onChange: (value: string) => void
  options: readonly HeroSelectFieldOption[]
  placeholder: string
  value: string
}

export function HeroSelectField({
  className,
  disabled = false,
  errorMessage,
  label,
  onChange,
  options,
  placeholder,
  value,
}: HeroSelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="inline-block text-sm font-medium text-foreground">{label}</label>
      <Select
        isDisabled={disabled}
        selectedKey={value || null}
        onSelectionChange={(key) => onChange(String(key))}
      >
        <Select.Trigger
          className={cn(
            "flex w-full py-0 min-w-0 items-center justify-between rounded-[10px] border-0 bg-[var(--talimy-color-sky)]/70 px-4 text-sm font-medium text-talimy-navy shadow-none outline-none transition-colors",
            errorMessage ? "ring-2 ring-destructive/20" : ""
          )}
        >
          <Select.Value className="truncate text-left text-sm font-medium text-talimy-navy">
            {options.find((option) => option.value === value)?.label ?? placeholder}
          </Select.Value>
          <Select.Indicator className="size-4 text-talimy-navy/70" />
        </Select.Trigger>
        <Select.Popover className="rounded-xl border border-[var(--talimy-color-sky)]/35 bg-card/95 p-1 shadow-md backdrop-blur">
          <ListBox aria-label={label} className="outline-none">
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
