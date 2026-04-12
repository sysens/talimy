import { z } from "zod"

import { userTenantQuerySchema } from "./user.schema"

export const financeFeeStatusSchema = z.enum([
  "all",
  "overdue",
  "paid",
  "partially_paid",
  "pending",
])

export const financeFeeCategorySchema = z.enum([
  "activities",
  "books_supplies",
  "miscellaneous",
  "tuition_fee",
])

export const financeMonthQuerySchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")

export const financeFeesSummaryQuerySchema = userTenantQuerySchema.extend({
  month: financeMonthQuerySchema.optional(),
})

export const financeFeesProgressQuerySchema = userTenantQuerySchema.extend({
  month: financeMonthQuerySchema.optional(),
})

export const financeFeesTrendQuerySchema = userTenantQuerySchema.extend({
  months: z.coerce.number().int().min(1).max(12).default(8),
})

export const financeFeesListQuerySchema = userTenantQuerySchema.extend({
  classId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(5),
  month: financeMonthQuerySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  status: financeFeeStatusSchema.default("all"),
})

export type FinanceFeeCategory = z.infer<typeof financeFeeCategorySchema>
export type FinanceFeeStatus = Exclude<z.infer<typeof financeFeeStatusSchema>, "all">
export type FinanceFeesSummaryQueryInput = z.infer<typeof financeFeesSummaryQuerySchema>
export type FinanceFeesProgressQueryInput = z.infer<typeof financeFeesProgressQuerySchema>
export type FinanceFeesTrendQueryInput = z.infer<typeof financeFeesTrendQuerySchema>
export type FinanceFeesListQueryInput = z.infer<typeof financeFeesListQuerySchema>
