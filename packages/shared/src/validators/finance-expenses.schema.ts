import { z } from "zod"

import { userTenantQuerySchema } from "./user.schema"

export const financeExpenseCategorySchema = z.enum([
  "custom",
  "events",
  "maintenance",
  "others",
  "salaries",
  "supplies",
])

export const financeReimbursementStatusSchema = z.enum(["approved", "declined", "pending"])

export const financeExpenseCategoryFilterSchema = z.union([
  z.literal("all"),
  financeExpenseCategorySchema,
])

export const financeExpenseMonthQuerySchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")

export const financeExpensesTrendQuerySchema = userTenantQuerySchema.extend({
  months: z.coerce.number().int().min(1).max(12).default(8),
})

export const financeExpensesBreakdownQuerySchema = userTenantQuerySchema

export const financeReimbursementsQuerySchema = userTenantQuerySchema.extend({
  week: z.enum(["current", "previous"]).default("current"),
})

export const financeReimbursementStatusUpdateSchema = z.object({
  status: financeReimbursementStatusSchema,
})

export const financeExpensesListQuerySchema = userTenantQuerySchema.extend({
  category: financeExpenseCategoryFilterSchema.default("all"),
  limit: z.coerce.number().int().min(1).max(20).default(8),
  month: financeExpenseMonthQuerySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
})

const financeExpenseFormFieldsSchema = z.object({
  amount: z.coerce.number().finite().positive(),
  category: financeExpenseCategorySchema,
  categoryLabel: z.string().trim().min(2).max(120).optional(),
  department: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(255),
  expenseDate: z.string().date().optional(),
  quantity: z.string().trim().max(80).optional(),
})

function validateCustomExpenseCategory(
  value: {
    amount: number
    category: FinanceExpenseCategory
    categoryLabel?: string
    department: string
    description: string
    expenseDate?: string
    quantity?: string
    tenantId?: string
  },
  ctx: z.RefinementCtx
): void {
  if (value.category === "custom" && (!value.categoryLabel || value.categoryLabel.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "categoryLabel is required when category is custom",
      path: ["categoryLabel"],
    })
  }
}

export const createFinanceExpenseFormSchema = financeExpenseFormFieldsSchema.superRefine(
  validateCustomExpenseCategory
)

export const createFinanceExpenseSchema = financeExpenseFormFieldsSchema
  .extend({
    tenantId: z.string().uuid(),
  })
  .superRefine(validateCustomExpenseCategory)

export type FinanceExpenseCategory = z.infer<typeof financeExpenseCategorySchema>
export type FinanceReimbursementStatus = z.infer<typeof financeReimbursementStatusSchema>
export type FinanceExpenseCategoryFilter = z.infer<typeof financeExpenseCategoryFilterSchema>
export type FinanceExpensesTrendQueryInput = z.infer<typeof financeExpensesTrendQuerySchema>
export type FinanceExpensesBreakdownQueryInput = z.infer<typeof financeExpensesBreakdownQuerySchema>
export type FinanceReimbursementsQueryInput = z.infer<typeof financeReimbursementsQuerySchema>
export type FinanceReimbursementStatusUpdateInput = z.infer<
  typeof financeReimbursementStatusUpdateSchema
>
export type FinanceExpensesListQueryInput = z.infer<typeof financeExpensesListQuerySchema>
export type CreateFinanceExpenseFormInput = z.infer<typeof createFinanceExpenseFormSchema>
export type CreateFinanceExpenseInput = z.infer<typeof createFinanceExpenseSchema>
