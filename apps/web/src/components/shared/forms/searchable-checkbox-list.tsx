"use client"

import { useMemo, useState } from "react"
import { Input } from "@heroui/react"
import { Checkbox, cn } from "@talimy/ui"
import { Search } from "lucide-react"

export type SearchableCheckboxListOption = {
  description?: string
  label: string
  value: string
}

type SearchableCheckboxListProps = {
  className?: string
  disabled?: boolean
  emptyStateLabel: string
  errorMessage?: string
  label: string
  onChange: (values: string[]) => void
  options: readonly SearchableCheckboxListOption[]
  searchPlaceholder?: string
  value: readonly string[]
}

export function SearchableCheckboxList({
  className,
  disabled = false,
  emptyStateLabel,
  errorMessage,
  label,
  onChange,
  options,
  searchPlaceholder,
  value,
}: SearchableCheckboxListProps) {
  const [search, setSearch] = useState("")
  const selectedValues = useMemo(() => new Set(value), [value])
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (query.length === 0) {
      return options
    }

    return options.filter((option) => option.label.toLowerCase().includes(query))
  }, [options, search])

  function toggleValue(optionValue: string, checked: boolean | "indeterminate") {
    if (checked !== true) {
      onChange(value.filter((item) => item !== optionValue))
      return
    }

    onChange([...new Set([...value, optionValue])])
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {searchPlaceholder ? (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-10 rounded-2xl border-slate-200 pl-9 text-sm text-slate-900"
              disabled={disabled}
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2",
          errorMessage ? "border-red-300" : ""
        )}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 rounded-2xl border border-white bg-white px-3 py-3 shadow-sm"
            >
              <Checkbox
                checked={selectedValues.has(option.value)}
                disabled={disabled}
                onCheckedChange={(checked) => toggleValue(option.value, checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900">{option.label}</p>
                {option.description ? (
                  <p className="text-xs text-slate-500">{option.description}</p>
                ) : null}
              </div>
            </label>
          ))
        ) : (
          <p className="col-span-full text-sm text-slate-500">{emptyStateLabel}</p>
        )}
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </div>
  )
}
