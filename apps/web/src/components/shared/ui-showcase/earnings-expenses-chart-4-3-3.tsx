"use client"

import { EarningsExpensesMiniChart } from "@/components/shared/charts/earnings-expenses-mini-chart"

export function EarningsExpensesChartShowcase433() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-2xl">
        <EarningsExpensesMiniChart />
      </div>
    </div>
  )
}
