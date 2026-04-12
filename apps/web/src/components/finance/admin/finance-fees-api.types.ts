export type FinanceFeeStatus = "overdue" | "paid" | "partially_paid" | "pending"
export type FinanceFeeCategory = "activities" | "books_supplies" | "miscellaneous" | "tuition_fee"

export type FinanceFeesSummaryResponse = {
  amounts: {
    collected: number
    overdue: number
    pending: number
  }
  month: string
}

export type FinanceFeesTrendResponse = {
  months: number
  points: ReadonlyArray<{
    amount: number
    month: string
  }>
}

export type FinanceFeesProgressResponse = {
  categories: ReadonlyArray<{
    categoryId: FinanceFeeCategory
    collectedAmount: number
    progressPercentage: number
    targetAmount: number
  }>
  month: string
}

export type FinanceFeesListResponse = {
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
  rows: ReadonlyArray<{
    classId: string | null
    classLabel: string
    studentCode: string
    studentId: string
    studentName: string
    items: ReadonlyArray<{
      categoryId: FinanceFeeCategory
      dueDate: string
      status: FinanceFeeStatus
      totalAmount: number
    }>
  }>
}

export type FinanceFeesListParams = {
  classId?: string
  limit: number
  month?: string
  page: number
  status: "all" | FinanceFeeStatus
}

export type FinanceFeesTrendMonths = "last6Months" | "last8Months"
