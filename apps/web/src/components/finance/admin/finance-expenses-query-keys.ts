import type { FinanceExpenseCategoryFilter } from "@/components/finance/admin/finance-expenses-api.types"

export const financeExpensesQueryKeys = {
  all: () => ["finance-expenses"] as const,
  breakdown: () => [...financeExpensesQueryKeys.all(), "breakdown"] as const,
  list: (params: {
    category: FinanceExpenseCategoryFilter
    limit: number
    month?: string
    page: number
  }) => [...financeExpensesQueryKeys.all(), "list", params] as const,
  reimbursements: (week: "current" | "previous") =>
    [...financeExpensesQueryKeys.all(), "reimbursements", week] as const,
  trend: (months: number) => [...financeExpensesQueryKeys.all(), "trend", months] as const,
}
