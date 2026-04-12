import type { FinanceExpenseCategory } from "@/components/finance/admin/finance-expenses-api.types"

type FinanceExpenseCategoryBadgeProps = {
  category: FinanceExpenseCategory
  label: string
}

const CATEGORY_CLASS_NAMES: Record<FinanceExpenseCategory, string> = {
  custom: "bg-slate-100 text-slate-600",
  events: "bg-[#dff1fb] text-[#5fa9d6]",
  maintenance: "bg-[#ffe6e6] text-[#ff5a5f]",
  others: "bg-slate-100 text-slate-600",
  salaries: "bg-[#dff8ef] text-[#39c7a5]",
  supplies: "bg-[var(--talimy-color-sky)]/25 text-[#2da4d3]",
}

export function FinanceExpenseCategoryBadge({ category, label }: FinanceExpenseCategoryBadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-[8px] px-2 text-[11px] font-medium whitespace-nowrap",
        CATEGORY_CLASS_NAMES[category],
      ].join(" ")}
    >
      {label}
    </span>
  )
}
