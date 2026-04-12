import { webApiFetch } from "@/lib/api"

import type {
  CreateFinanceExpensePayload,
  FinanceExpenseBreakdownResponse,
  FinanceExpensesListParams,
  FinanceExpensesListResponse,
  FinanceExpenseTrendResponse,
  FinanceReimbursementsResponse,
  FinanceReimbursementsWeek,
  FinanceReimbursementStatus,
} from "@/components/finance/admin/finance-expenses-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

function buildSearch(params: Record<string, number | string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      searchParams.set(key, String(value))
    }
  }

  const serialized = searchParams.toString()
  return serialized.length > 0 ? `?${serialized}` : ""
}

export function getFinanceExpensesTrend(months: number) {
  return webApiFetch<SuccessEnvelope<FinanceExpenseTrendResponse>>(
    `/finance/expenses/trend${buildSearch({ months })}`
  ).then((response) => response.data)
}

export function getFinanceExpensesBreakdown() {
  return webApiFetch<SuccessEnvelope<FinanceExpenseBreakdownResponse>>(
    "/finance/expenses/breakdown"
  ).then((response) => response.data)
}

export function getFinanceReimbursements(week: FinanceReimbursementsWeek) {
  return webApiFetch<SuccessEnvelope<FinanceReimbursementsResponse>>(
    `/finance/reimbursements${buildSearch({ week })}`
  ).then((response) => response.data)
}

export function updateFinanceReimbursementStatus(
  reimbursementId: string,
  status: FinanceReimbursementStatus
) {
  return webApiFetch<SuccessEnvelope<{ success: true }>>(
    `/finance/reimbursements/${reimbursementId}/status`,
    {
      body: JSON.stringify({ status }),
      method: "PATCH",
    }
  ).then((response) => response.data)
}

export function getFinanceExpensesList(params: FinanceExpensesListParams) {
  return webApiFetch<SuccessEnvelope<FinanceExpensesListResponse>>(
    `/finance/expenses${buildSearch(params)}`
  ).then((response) => response.data)
}

export function createFinanceExpense(payload: CreateFinanceExpensePayload) {
  return webApiFetch<SuccessEnvelope<FinanceExpensesListResponse["rows"][number]>>(
    "/finance/expenses",
    {
      body: JSON.stringify(payload),
      method: "POST",
    }
  ).then((response) => response.data)
}
