"use client"

import * as React from "react"

import { MiniChart, MirroredComparisonChart, type MiniChartLegendItem } from "@talimy/ui"

import type { DashboardEarningsPeriod } from "@/components/dashboard/admin/dashboard.types"

export type EarningsExpensesRow = {
  earnings: number
  expenses: number
  month: string
}

type EarningsExpensesMiniChartProps = {
  className?: string
  dataByPeriod?: Record<DashboardEarningsPeriod, EarningsExpensesRow[]>
  filterAriaLabel?: string
  filterOptions?: ReadonlyArray<{ label: string; value: DashboardEarningsPeriod }>
  legend?: MiniChartLegendItem[]
  onPeriodChange?: (value: DashboardEarningsPeriod) => void
  period?: DashboardEarningsPeriod
  title?: string
}

const DEFAULT_DATA_BY_PERIOD: Record<DashboardEarningsPeriod, EarningsExpensesRow[]> = {
  lastYear: [
    { month: "Jan", earnings: 2800, expenses: 2200 },
    { month: "Feb", earnings: 3000, expenses: 2400 },
    { month: "Mar", earnings: 2600, expenses: 1800 },
    { month: "Apr", earnings: 3200, expenses: 2100 },
    { month: "May", earnings: 3400, expenses: 2500 },
    { month: "Jun", earnings: 3900, expenses: 2900 },
    { month: "Jul", earnings: 4200, expenses: 3100 },
    { month: "Aug", earnings: 4100, expenses: 2950 },
    { month: "Sep", earnings: 3600, expenses: 2500 },
    { month: "Oct", earnings: 3800, expenses: 2600 },
    { month: "Nov", earnings: 4300, expenses: 3000 },
    { month: "Dec", earnings: 4700, expenses: 3400 },
  ],
  thisYear: [
    { month: "Jan", earnings: 3500, expenses: 2800 },
    { month: "Feb", earnings: 2900, expenses: 2200 },
    { month: "Mar", earnings: 2200, expenses: 1200 },
    { month: "Apr", earnings: 2700, expenses: 1600 },
    { month: "May", earnings: 3500, expenses: 2500 },
    { month: "Jun", earnings: 4500, expenses: 3200 },
    { month: "Jul", earnings: 6020, expenses: 3880 },
    { month: "Aug", earnings: 5600, expenses: 4200 },
    { month: "Sep", earnings: 4300, expenses: 3000 },
    { month: "Oct", earnings: 3900, expenses: 2550 },
    { month: "Nov", earnings: 4400, expenses: 2150 },
    { month: "Dec", earnings: 5200, expenses: 1700 },
  ],
}

const DEFAULT_LEGEND: MiniChartLegendItem[] = [
  { color: "var(--talimy-color-navy)", id: "earnings", label: "Earnings", marker: "line" },
  { color: "var(--talimy-color-pink)", id: "expenses", label: "Expenses", marker: "line" },
]

const DEFAULT_FILTER_OPTIONS: ReadonlyArray<{ label: string; value: DashboardEarningsPeriod }> = [
  { label: "Last year", value: "lastYear" },
  { label: "This year", value: "thisYear" },
]

const CHART_HEIGHT = 220

function isDashboardEarningsPeriod(value: string): value is DashboardEarningsPeriod {
  return value === "lastYear" || value === "thisYear"
}

export function EarningsExpensesMiniChart({
  className,
  dataByPeriod = DEFAULT_DATA_BY_PERIOD,
  filterAriaLabel = "Earnings period",
  filterOptions = DEFAULT_FILTER_OPTIONS,
  legend = DEFAULT_LEGEND,
  onPeriodChange,
  period,
  title = "Earnings",
}: EarningsExpensesMiniChartProps) {
  const [internalPeriod, setInternalPeriod] = React.useState<DashboardEarningsPeriod>("lastYear")
  const [visibleData, setVisibleData] = React.useState<EarningsExpensesRow[]>(dataByPeriod.lastYear)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const activePeriod = period ?? internalPeriod
  const activeYearLabel = activePeriod === "lastYear" ? "2034" : "2035"
  const bottomLabels = React.useMemo(
    () =>
      visibleData.map((entry) => (
        <span key={entry.month} className="text-[13px] font-medium text-[var(--talimy-color-gray)]">
          {entry.month}
        </span>
      )),
    [visibleData]
  )

  React.useEffect(() => {
    setIsTransitioning(true)

    const swapTimer = window.setTimeout(() => {
      setVisibleData(dataByPeriod[activePeriod])
    }, 90)

    const endTimer = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 240)

    return () => {
      window.clearTimeout(swapTimer)
      window.clearTimeout(endTimer)
    }
  }, [activePeriod, dataByPeriod])

  return (
    <MiniChart
      className={className}
      chartClassName="min-h-55"
      bottomLabels={{
        className: "mt-2",
        values: bottomLabels,
      }}
      filter={{
        ariaLabel: filterAriaLabel,
        onValueChange: (value) => {
          if (!isDashboardEarningsPeriod(value)) {
            return
          }

          if (onPeriodChange) {
            onPeriodChange(value)
            return
          }

          setInternalPeriod(value)
        },
        options: [...filterOptions],
        value: activePeriod,
      }}
      legend={legend}
      title={title}
      yScale={{
        values: ["$6K", "$3K", "$0", "$3K", "$6K"],
      }}
    >
      <div
        className="h-55 transition-all duration-200 ease-out"
        style={{
          opacity: isTransitioning ? 0.58 : 1,
          transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
        }}
      >
        <MirroredComparisonChart
          className="h-55"
          data={visibleData}
          formatTooltipLabel={(month) => `${month} ${activeYearLabel}`}
          formatValue={(value) => `$${value.toLocaleString()}`}
          height={CHART_HEIGHT}
          hideXAxisLabels
          labelKey="month"
          negativeKey="expenses"
          negativeLabel={legend[1]?.label ?? "Expenses"}
          positiveKey="earnings"
          positiveLabel={legend[0]?.label ?? "Earnings"}
        />
      </div>
    </MiniChart>
  )
}
