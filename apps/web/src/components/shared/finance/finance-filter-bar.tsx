"use client"

import type { ReactNode } from "react"
import type { ChartFilterOption } from "@talimy/ui"
import { ChartFilterSelect } from "@talimy/ui"

type FinanceFilterBarItem = {
  ariaLabel: string
  options: readonly ChartFilterOption[]
  triggerClassName?: string
  value: string
  onValueChange: (value: string) => void
}

type FinanceFilterBarProps = {
  action?: ReactNode
  className?: string
  items: readonly FinanceFilterBarItem[]
}

export function FinanceFilterBar({ action, className, items }: FinanceFilterBarProps) {
  return (
    <div className={["flex flex-wrap items-center justify-end gap-3", className ?? ""].join(" ")}>
      {items.map((item) => (
        <ChartFilterSelect
          ariaLabel={item.ariaLabel}
          className="shrink-0"
          key={item.ariaLabel}
          onValueChange={item.onValueChange}
          options={[...item.options]}
          triggerClassName={[
            "h-10 min-w-[124px] rounded-[16px] bg-[var(--talimy-color-sky)]/70 px-3 text-[13px] font-medium text-talimy-navy",
            item.triggerClassName ?? "",
          ].join(" ")}
          value={item.value}
        />
      ))}
      {action}
    </div>
  )
}
