"use client"

import { MoreHorizontal } from "lucide-react"
import { Button, Card, CardContent, ChartContainer } from "@talimy/ui"
import { Cell, Pie, PieChart } from "recharts"

export type ExpenseBreakdownDonutItem = {
  amount: number
  categoryId: string
  color: string
  label: string
  percentage: number
}

type ExpenseBreakdownDonutCardProps = {
  actionLabel: string
  amountFormatter?: (value: number) => string
  className?: string
  items: readonly ExpenseBreakdownDonutItem[]
  title: string
  totalAmountLabel: string
  totalAmountValue: string
}

export function ExpenseBreakdownDonutCard({
  actionLabel,
  amountFormatter = (value) => value.toLocaleString(),
  className,
  items,
  title,
  totalAmountLabel,
  totalAmountValue,
}: ExpenseBreakdownDonutCardProps) {
  return (
    <Card
      className={[
        "rounded-[28px] border border-slate-100 bg-white py-0 shadow-none",
        className ?? "",
      ].join(" ")}
    >
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-semibold text-talimy-navy">{title}</h3>
          <Button
            aria-label={actionLabel}
            className="size-8 rounded-full bg-transparent p-0 text-slate-400 shadow-none hover:bg-slate-50"
            type="button"
            variant="ghost"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center justify-center">
            <ChartContainer
              className="h-[156px] w-[156px]"
              config={Object.fromEntries(
                items.map((item) => [item.categoryId, { color: item.color, label: item.label }])
              )}
            >
              <PieChart>
                <Pie
                  cornerRadius={10}
                  data={items}
                  dataKey="amount"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                  stroke="white"
                  strokeWidth={3}
                >
                  {items.map((item) => (
                    <Cell fill={item.color} key={`expense-breakdown-${item.categoryId}`} />
                  ))}
                </Pie>
                <text textAnchor="middle" x="50%" y="46%">
                  <tspan className="fill-slate-400 text-[11px]" x="50%" y="46%">
                    {totalAmountLabel}
                  </tspan>
                  <tspan
                    className="fill-[var(--talimy-color-navy)] text-lg font-bold"
                    x="50%"
                    y="61%"
                  >
                    {totalAmountValue}
                  </tspan>
                </text>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                className="rounded-[14px] bg-[#f7f8fa] px-3 py-1.5"
                key={`expense-breakdown-tile-${item.categoryId}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 h-8 w-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-talimy-navy">{item.label}</div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-[12px] text-slate-500">
                      <span>{amountFormatter(item.amount)}</span>
                      <span className="font-semibold text-talimy-navy">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
