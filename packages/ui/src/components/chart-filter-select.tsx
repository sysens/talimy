"use client"

import * as React from "react"

import { cn } from "../lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export type ChartFilterOption = {
  label: React.ReactNode
  value: string
}

export type ChartFilterSelectProps = {
  ariaLabel?: string
  className?: string
  contentClassName?: string
  defaultValue?: string
  itemClassName?: string
  onValueChange?: (value: string) => void
  options: ChartFilterOption[]
  placeholder?: string
  triggerClassName?: string
  value?: string
}

export function ChartFilterSelect({
  ariaLabel = "Chart filter",
  className,
  contentClassName,
  defaultValue,
  itemClassName,
  onValueChange,
  options,
  placeholder = "Select",
  triggerClassName,
  value,
}: ChartFilterSelectProps) {
  return (
    <div className={cn("shrink-0", className)}>
      <Select defaultValue={defaultValue} onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-label={ariaLabel}
          className={cn(
            "h-8 min-w-32 rounded-lg border-0 bg-[var(--talimy-color-sky)]/70 text-xs font-medium text-[var(--talimy-color-navy)] shadow-none dark:bg-sky-900/30 dark:text-sky-100",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "rounded-xl border border-[var(--talimy-color-sky)]/35 bg-card/95 p-1 text-[var(--talimy-color-navy)] shadow-md backdrop-blur dark:border-sky-700/45 dark:bg-slate-900/95 dark:text-sky-100",
            contentClassName
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              className={cn(
                "data-[state=checked]:bg-[var(--talimy-color-pink)]/70 data-[state=checked]:font-semibold data-[state=checked]:text-[var(--talimy-color-navy)] focus:bg-[var(--talimy-color-sky)]/55 focus:text-[var(--talimy-color-navy)] dark:data-[state=checked]:bg-pink-300/25 dark:data-[state=checked]:text-sky-50 dark:focus:bg-sky-800/45 dark:focus:text-sky-50",
                itemClassName
              )}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
