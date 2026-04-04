"use client"

import { StudentsByGenderChart } from "@/components/shared/charts/students-by-gender-chart"

export function GenderDistributionChartShowcase433() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-sm">
        <StudentsByGenderChart />
      </div>
    </div>
  )
}
