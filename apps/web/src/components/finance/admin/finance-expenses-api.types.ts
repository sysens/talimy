export type FinanceExpenseCategory =
  | "custom"
  | "events"
  | "maintenance"
  | "others"
  | "salaries"
  | "supplies"

export type FinanceExpenseCategoryFilter = "all" | FinanceExpenseCategory
export type FinanceReimbursementStatus = "approved" | "declined" | "pending"

export type FinanceExpenseTrendResponse = {
  months: number
  points: ReadonlyArray<{
    amount: number
    month: string
  }>
}

export type FinanceExpenseBreakdownResponse = {
  items: ReadonlyArray<{
    amount: number
    categoryId: FinanceExpenseCategory
    percentage: number
  }>
  totalAmount: number
}

export type FinanceReimbursementsResponse = {
  rows: ReadonlyArray<{
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
  }>
  week: "current" | "previous"
}

export type FinanceExpensesListResponse = {
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  month: string
  rows: ReadonlyArray<{
    amount: number
    categoryId: FinanceExpenseCategory
    categoryLabel: string | null
    department: string
    description: string
    expenseCode: string
    expenseDate: string
    id: string
    quantity: string | null
  }>
}

export type FinanceExpensesListParams = {
  category: FinanceExpenseCategoryFilter
  limit: number
  month?: string
  page: number
}

export type CreateFinanceExpensePayload = {
  amount: number
  category: FinanceExpenseCategory
  categoryLabel?: string
  department: string
  description: string
  expenseDate?: string
  quantity?: string
}

export type FinanceReimbursementsWeek = "current" | "previous"
