"use client"

import * as React from "react"
import { MiniChart, MirroredComparisonChart, type MiniChartLegendItem } from "@talimy/ui"

type EarningsExpensesRow = {
  earnings: number
  expenses: number
  month: string
}

const LAST_YEAR_DATA: EarningsExpensesRow[] = [
  { month: "Jan", earnings: 3500, expenses: 2800 },
  { month: "Feb", earnings: 2900, expenses: 2200 },
  { month: "Mar", earnings: 2200, expenses: 1200 },
  { month: "Apr", earnings: 2700, expenses: 1600 },
  { month: "May", earnings: 3500, expenses: 2500 },
  { month: "Jun", earnings: 4500, expenses: 3200 },
  { month: "Jul", earnings: 5785, expenses: 4020 },
  { month: "Aug", earnings: 4800, expenses: 4500 },
  { month: "Sep", earnings: 3200, expenses: 3500 },
  { month: "Oct", earnings: 2500, expenses: 2900 },
  { month: "Nov", earnings: 3100, expenses: 2000 },
  { month: "Dec", earnings: 3900, expenses: 1500 },
]

const THIS_YEAR_DATA: EarningsExpensesRow[] = [
  { month: "Jan", earnings: 4100, expenses: 2600 },
  { month: "Feb", earnings: 3600, expenses: 2100 },
  { month: "Mar", earnings: 3000, expenses: 1800 },
  { month: "Apr", earnings: 3400, expenses: 1900 },
  { month: "May", earnings: 4200, expenses: 2400 },
  { month: "Jun", earnings: 5100, expenses: 2900 },
  { month: "Jul", earnings: 6020, expenses: 3880 },
  { month: "Aug", earnings: 5600, expenses: 4200 },
  { month: "Sep", earnings: 4300, expenses: 3000 },
  { month: "Oct", earnings: 3900, expenses: 2550 },
  { month: "Nov", earnings: 4400, expenses: 2150 },
  { month: "Dec", earnings: 5200, expenses: 1700 },
]

const EARNINGS_EXPENSES_LEGEND: MiniChartLegendItem[] = [
  { color: "var(--talimy-color-navy)", id: "earnings", label: "Earnings", marker: "line" },
  { color: "var(--talimy-color-pink)", id: "expenses", label: "Expenses", marker: "line" },
]

export function EarningsExpensesChartShowcase433() {
  const [period, setPeriod] = React.useState<"lastYear" | "thisYear">("lastYear")
  const [visibleData, setVisibleData] = React.useState<EarningsExpensesRow[]>(LAST_YEAR_DATA)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    setIsTransitioning(true)

    const swapTimer = window.setTimeout(() => {
      setVisibleData(period === "lastYear" ? LAST_YEAR_DATA : THIS_YEAR_DATA)
    }, 90)

    const endTimer = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 240)

    return () => {
      window.clearTimeout(swapTimer)
      window.clearTimeout(endTimer)
    }
  }, [period])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-2xl">
        <MiniChart
          chartClassName="min-h-[236px]"
          filter={{
            ariaLabel: "Earnings period",
            onValueChange: (value) => setPeriod(value as "lastYear" | "thisYear"),
            options: [
              { label: "Last Year", value: "lastYear" },
              { label: "This Year", value: "thisYear" },
            ],
            value: period,
          }}
          legend={EARNINGS_EXPENSES_LEGEND}
          title="Earnings"
          yScale={{
            values: ["$6K", "$3K", "$0", "$3K", "$6K"],
          }}
        >
          <div
            className="h-[236px] transition-all duration-200 ease-out"
            style={{
              opacity: isTransitioning ? 0.58 : 1,
              transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
            }}
          >
            <MirroredComparisonChart
              className="h-[236px]"
              data={visibleData}
              formatTooltipLabel={(month) => `${month} 2034`}
              formatValue={(value) => `$${value.toLocaleString()}`}
              labelKey="month"
              negativeKey="expenses"
              negativeLabel="Expenses"
              positiveKey="earnings"
              positiveLabel="Earnings"
            />
          </div>
        </MiniChart>
      </div>
    </div>
  )
}
