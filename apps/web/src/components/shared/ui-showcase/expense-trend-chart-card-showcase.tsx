"use client"

import { ExpenseTrendChartCard } from "@/components/shared/finance/expense-trend-chart-card"

const DATA = {
  last8Months: [
    { label: "January 2035", shortLabel: "Jan", value: 65000 },
    { label: "February 2035", shortLabel: "Feb", value: 78250 },
    { label: "March 2035", shortLabel: "Mar", value: 69300 },
    { label: "April 2035", shortLabel: "Apr", value: 73150 },
    { label: "May 2035", shortLabel: "May", value: 95000 },
    { label: "June 2035", shortLabel: "Jun", value: 88000 },
    { label: "July 2035", shortLabel: "Jul", value: 76000 },
    { isCurrent: true, label: "August 2035", shortLabel: "Aug", value: 87350 },
  ],
} as const

export function ExpenseTrendChartCardShowcase() {
  return (
    <div className="max-w-sm">
      <ExpenseTrendChartCard
        dataByPeriod={DATA}
        filterAriaLabel="Expense trend period"
        filterOptions={[{ label: "Last 8 Months", value: "last8Months" }]}
        title="Expense Trend"
        valueFormatter={(value) => `$${value.toLocaleString()}`}
        yScaleValues={["$100K", "$75K", "$50K", "$25K", "$0K"]}
      />
    </div>
  )
}
