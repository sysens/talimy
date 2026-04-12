"use client"

import { ExpenseBreakdownDonutCard } from "@/components/shared/finance/expense-breakdown-donut-card"

const ITEMS = [
  {
    amount: 68750,
    categoryId: "salaries",
    color: "var(--talimy-color-navy)",
    label: "Salaries",
    percentage: 55,
  },
  { amount: 12500, categoryId: "events", color: "#ececec", label: "Events", percentage: 10 },
  {
    amount: 18750,
    categoryId: "supplies",
    color: "var(--talimy-color-pink)",
    label: "Supplies",
    percentage: 15,
  },
  { amount: 10000, categoryId: "others", color: "#dff2fb", label: "Others", percentage: 8 },
  {
    amount: 15000,
    categoryId: "maintenance",
    color: "#cfeef8",
    label: "Maintenance",
    percentage: 12,
  },
] as const

export function ExpenseBreakdownDonutCardShowcase() {
  return (
    <div className="max-w-xl">
      <ExpenseBreakdownDonutCard
        actionLabel="More actions"
        items={ITEMS}
        title="Expense Breakdown"
        totalAmountLabel="Total Expense"
        totalAmountValue="$125,000"
      />
    </div>
  )
}
