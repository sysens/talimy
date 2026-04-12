import type { FinanceExpenseCategory, FinanceReimbursementStatus } from "@talimy/shared"

export type FinanceExpenseTrendView = {
  months: number
  points: ReadonlyArray<{
    amount: number
    month: string
  }>
}

export type FinanceExpenseBreakdownView = {
  items: ReadonlyArray<{
    amount: number
    categoryId: FinanceExpenseCategory
    percentage: number
  }>
  totalAmount: number
}

export type FinanceReimbursementRowView = {
  amount: number
  department: string
  id: string
  proofLabel: string
  proofUrl: string | null
  purpose: string
  requestCode: string
  staffName: string
  status: FinanceReimbursementStatus
  submittedDate: string
}

export type FinanceReimbursementsView = {
  rows: ReadonlyArray<FinanceReimbursementRowView>
  week: "current" | "previous"
}

export type FinanceExpenseRowView = {
  amount: number
  categoryId: FinanceExpenseCategory
  categoryLabel: string | null
  department: string
  description: string
  expenseCode: string
  expenseDate: string
  id: string
  quantity: string | null
}

export type FinanceExpensesListView = {
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  month: string
  rows: ReadonlyArray<FinanceExpenseRowView>
}
