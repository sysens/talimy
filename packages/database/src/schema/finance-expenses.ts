import {
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { tenants } from "./tenants"

export const financeExpenseCategoryEnum = pgEnum("finance_expense_category", [
  "custom",
  "events",
  "maintenance",
  "others",
  "salaries",
  "supplies",
])

export const financeExpenses = pgTable(
  "finance_expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    expenseCode: varchar("expense_code", { length: 32 }).notNull(),
    expenseDate: date("expense_date").notNull(),
    department: varchar("department", { length: 120 }).notNull(),
    category: financeExpenseCategoryEnum("category").notNull(),
    categoryLabel: varchar("category_label", { length: 120 }),
    description: varchar("description", { length: 255 }).notNull(),
    quantity: varchar("quantity", { length: 80 }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("finance_expenses_tenant_id_idx").on(table.tenantId),
    dateIdx: index("finance_expenses_expense_date_idx").on(table.expenseDate),
    categoryIdx: index("finance_expenses_category_idx").on(table.category),
    codeIdx: index("finance_expenses_expense_code_idx").on(table.expenseCode),
  })
)
