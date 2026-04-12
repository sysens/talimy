import type { FinanceFeeCategory, FinanceFeeStatus } from "@talimy/shared"

export type FinanceFeesSummaryView = {
  amounts: {
    collected: number
    overdue: number
    pending: number
  }
  month: string
}

export type FinanceFeesTrendView = {
  months: number
  points: ReadonlyArray<{
    amount: number
    month: string
  }>
}

export type FinanceFeesProgressView = {
  categories: ReadonlyArray<{
    categoryId: FinanceFeeCategory
    collectedAmount: number
    progressPercentage: number
    targetAmount: number
  }>
  month: string
}

export type FinanceFeesStudentItemView = {
  categoryId: FinanceFeeCategory
  dueDate: string
  status: FinanceFeeStatus
  totalAmount: number
}

export type FinanceFeesStudentGroupView = {
  classId: string | null
  classLabel: string
  studentCode: string
  studentId: string
  studentName: string
  items: ReadonlyArray<FinanceFeesStudentItemView>
}

export type FinanceFeesListView = {
  classOptions: ReadonlyArray<{
    id: string
    label: string
  }>
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
  month: string
  rows: ReadonlyArray<FinanceFeesStudentGroupView>
}
