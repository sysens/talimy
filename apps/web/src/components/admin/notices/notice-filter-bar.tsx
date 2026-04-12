"use client"

import type { ReactNode } from "react"
import { Search } from "lucide-react"
import { Input } from "@talimy/ui"

import type { ChartFilterOption } from "@talimy/ui"
import { ChartFilterSelect } from "@talimy/ui"

type NoticeFilterBarItem = {
  ariaLabel: string
  options: readonly ChartFilterOption[]
  triggerClassName?: string
  value: string
  onValueChange: (value: string) => void
}

type NoticeFilterBarProps = {
  action?: ReactNode
  filters: readonly NoticeFilterBarItem[]
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  searchValue: string
}

export function NoticeFilterBar({
  action,
  filters,
  onSearchChange,
  searchPlaceholder,
  searchValue,
}: NoticeFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Search left */}
      <div className="relative flex-1 min-w-[200px] max-w-[280px]">
        <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          aria-label={searchPlaceholder}
          className="h-10 rounded-[16px] border-slate-100 bg-white ps-9 text-[13px] shadow-none focus-visible:ring-1 focus-visible:ring-(--talimy-color-pink)/40"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          value={searchValue}
        />
      </div>

      {/* Filters + action right */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((item) => (
          <ChartFilterSelect
            ariaLabel={item.ariaLabel}
            className="shrink-0"
            key={item.ariaLabel}
            onValueChange={item.onValueChange}
            options={[...item.options]}
            triggerClassName={[
              "h-10 min-w-[130px] rounded-[16px] bg-(--talimy-color-sky)/70 px-3 text-[13px] font-medium text-talimy-navy",
              item.triggerClassName ?? "",
            ].join(" ")}
            value={item.value}
          />
        ))}
        {action}
      </div>
    </div>
  )
}
