"use client"

import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"

const PAGE_SIZE_OPTIONS = [
  { label: "8", value: "8" },
  { label: "12", value: "12" },
  { label: "16", value: "16" },
] as const

export function TeachersResultsSummaryShowcase() {
  return (
    <TeachersResultsSummary
      limit={8}
      limitOptions={PAGE_SIZE_OPTIONS}
      ofLabel="of"
      onLimitChange={() => undefined}
      resultsLabel="results"
      showLabel="Show"
      total={82}
    />
  )
}
