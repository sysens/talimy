import type { FinanceFeesListParams } from "@/components/finance/admin/finance-fees-api.types"

export const financeFeesQueryKeys = {
  all: () => ["finance-fees"] as const,
  list: (params: FinanceFeesListParams) => [...financeFeesQueryKeys.all(), "list", params] as const,
  progress: (month?: string) =>
    [...financeFeesQueryKeys.all(), "progress", month ?? "current"] as const,
  summary: (month?: string) =>
    [...financeFeesQueryKeys.all(), "summary", month ?? "current"] as const,
  trend: (months: number) => [...financeFeesQueryKeys.all(), "trend", months] as const,
}
