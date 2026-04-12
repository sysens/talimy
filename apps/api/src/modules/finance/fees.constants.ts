import type { FinanceFeeCategory } from "@talimy/shared"

export const DEFAULT_MONTHLY_FEE_TOTAL = 1900

export const FEE_CATEGORY_CONFIG: readonly {
  categoryId: FinanceFeeCategory
  dueDay: number
  share: number
}[] = [
  {
    categoryId: "tuition_fee",
    dueDay: 15,
    share: 1200 / 1900,
  },
  {
    categoryId: "books_supplies",
    dueDay: 20,
    share: 250 / 1900,
  },
  {
    categoryId: "activities",
    dueDay: 25,
    share: 300 / 1900,
  },
  {
    categoryId: "miscellaneous",
    dueDay: 30,
    share: 150 / 1900,
  },
] as const
