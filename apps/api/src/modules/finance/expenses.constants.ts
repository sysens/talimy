import type { FinanceExpenseCategory } from "@talimy/shared"

export const FINANCE_EXPENSE_CATEGORY_ORDER: readonly FinanceExpenseCategory[] = [
  "salaries",
  "supplies",
  "events",
  "maintenance",
  "others",
  "custom",
] as const

export const FINANCE_EXPENSE_BREAKDOWN_CATEGORY_ORDER: readonly FinanceExpenseCategory[] = [
  "salaries",
  "supplies",
  "events",
  "maintenance",
  "others",
] as const
