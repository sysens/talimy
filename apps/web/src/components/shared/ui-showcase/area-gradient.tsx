"use client"

import {
  AreaTrendChartCard,
  type AreaTrendChartPoint,
} from "@/components/shared/charts/area-trend-chart-card"

type FeesPeriod = "first6Months" | "second6Months"

const FEES_DATA_BY_PERIOD: Record<FeesPeriod, readonly AreaTrendChartPoint[]> = {
  first6Months: [
    { label: "January", shortLabel: "Jan", value: 60000 },
    { label: "February", shortLabel: "Feb", value: 100000 },
    { label: "March", shortLabel: "Mar", value: 76000 },
    { label: "April", shortLabel: "Apr", value: 22000 },
    { label: "May", shortLabel: "May", value: 68000 },
    { label: "June", shortLabel: "Jun", value: 69000 },
  ],
  second6Months: [
    { label: "July", shortLabel: "Jul", value: 64000 },
    { label: "August", shortLabel: "Aug", value: 84000 },
    { label: "September", shortLabel: "Sep", value: 71000 },
    { label: "October", shortLabel: "Oct", value: 46000 },
    { label: "November", shortLabel: "Nov", value: 90000 },
    { label: "December", shortLabel: "Dec", value: 96000 },
  ],
}

export function FeesCollectionTrendChartShowcase433() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/finance</h3>

      <div className="max-w-sm">
        <AreaTrendChartCard
          dataByPeriod={FEES_DATA_BY_PERIOD}
          filterAriaLabel="Fees trend period"
          filterOptions={[
            { label: "First 6 Months", value: "first6Months" },
            { label: "Second 6 Months", value: "second6Months" },
          ]}
          title="Fees Collection Trend"
          valueFormatter={(value) => `$${Math.round(value / 1000)}K`}
          yScaleValues={["$100K", "$75K", "$50K", "$25K", "$0K"]}
        />
      </div>
    </div>
  )
}
