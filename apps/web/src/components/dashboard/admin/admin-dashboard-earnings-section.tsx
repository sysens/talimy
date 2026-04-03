"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartFilterSelect,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@talimy/ui"

type EarningsPeriod = "lastYear" | "thisYear"

type EarningsRow = {
  earnings: number
  expenses: number
  month: string
}

const LAST_YEAR_DATA: EarningsRow[] = [
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

const THIS_YEAR_DATA: EarningsRow[] = [
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

const CHART_CONFIG = {
  earnings: { color: "var(--talimy-color-navy)", label: "Earnings" },
  expenses: { color: "var(--talimy-color-pink)", label: "Expenses" },
} satisfies ChartConfig

const EARNINGS_LEGEND = [
  { color: "var(--talimy-color-navy)", id: "earnings", label: "Earnings" },
  { color: "var(--talimy-color-pink)", id: "expenses", label: "Expenses" },
] as const

export function AdminDashboardEarningsSection() {
  const [period, setPeriod] = React.useState<EarningsPeriod>("lastYear")

  const data = period === "lastYear" ? LAST_YEAR_DATA : THIS_YEAR_DATA

  return (
    <Card className="rounded-[32px] border-0 bg-card shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="space-y-3">
          <CardTitle className="text-base font-semibold text-talimy-color-navy dark:text-sky-200">
            Earnings
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            {EARNINGS_LEGEND.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ChartFilterSelect
          ariaLabel="Earnings period"
          onValueChange={(value) => setPeriod(value as EarningsPeriod)}
          options={[
            { label: "Last Year", value: "lastYear" },
            { label: "This Year", value: "thisYear" },
          ]}
          value={period}
        />
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <ChartContainer className="h-[220px] w-full aspect-auto!" config={CHART_CONFIG}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 8, right: 0, bottom: 0, left: -12 }}
          >
            <CartesianGrid
              stroke="color-mix(in oklab, var(--border) 75%, white 25%)"
              strokeDasharray="6 6"
              vertical={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 6500]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(value: number) =>
                value === 0 ? "$0" : `$${Math.round(value / 1000)}K`
              }
              tickLine={false}
              tickMargin={10}
              width={32}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-44 gap-2.5"
                  indicator="line"
                  labelFormatter={(label) => (
                    <div className="border-border/50 mb-0.5 border-b pb-2">
                      <span className="text-xs font-medium">{label} 2034</span>
                    </div>
                  )}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span
                          className="h-0.5 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              name === "earnings"
                                ? "var(--talimy-color-navy)"
                                : "var(--talimy-color-pink)",
                          }}
                        />
                        <span>
                          {CHART_CONFIG[name as keyof typeof CHART_CONFIG]?.label ?? String(name)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        ${Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
              cursor={false}
            />
            <Line
              activeDot={{
                fill: "var(--talimy-color-navy)",
                r: 5,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              dataKey="earnings"
              dot={{ fill: "var(--talimy-color-navy)", r: 0 }}
              stroke="var(--talimy-color-navy)"
              strokeLinecap="round"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              activeDot={{
                fill: "var(--talimy-color-pink)",
                r: 4,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              dataKey="expenses"
              dot={{ fill: "var(--talimy-color-pink)", r: 0 }}
              stroke="var(--talimy-color-pink)"
              strokeDasharray="7 5"
              strokeLinecap="round"
              strokeWidth={2.5}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
