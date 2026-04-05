"use client"

import { ChartFilterSelect } from "@talimy/ui"

import type { TeachersFilterOption } from "@/components/teachers/list/teachers-filter-bar.types"

type TeachersResultsSummaryProps = {
  limit: number
  limitOptions: readonly TeachersFilterOption[]
  ofLabel: string
  onLimitChange: (value: string) => void
  resultsLabel: string
  showLabel: string
  total: number
}

export function TeachersResultsSummary({
  limit,
  limitOptions,
  ofLabel,
  onLimitChange,
  resultsLabel,
  showLabel,
  total,
}: TeachersResultsSummaryProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span>{showLabel}</span>
      <ChartFilterSelect
        ariaLabel={showLabel}
        onValueChange={onLimitChange}
        options={[...limitOptions]}
        triggerClassName="h-8 min-w-[72px] rounded-2xl border border-slate-100 bg-white px-3 text-sm font-medium text-slate-700"
        value={String(limit)}
      />
      <span>
        {ofLabel} <span className="font-medium text-slate-500">{total}</span> {resultsLabel}
      </span>
    </div>
  )
}
