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

export const financeReimbursementStatusEnum = pgEnum("finance_reimbursement_status", [
  "approved",
  "declined",
  "pending",
])

export const financeReimbursements = pgTable(
  "finance_reimbursements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    requestCode: varchar("request_code", { length: 32 }).notNull(),
    staffName: varchar("staff_name", { length: 160 }).notNull(),
    department: varchar("department", { length: 120 }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    purpose: varchar("purpose", { length: 160 }).notNull(),
    submittedDate: date("submitted_date").notNull(),
    proofLabel: varchar("proof_label", { length: 80 }).notNull().default("View File"),
    proofUrl: varchar("proof_url", { length: 500 }),
    status: financeReimbursementStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("finance_reimbursements_tenant_id_idx").on(table.tenantId),
    dateIdx: index("finance_reimbursements_submitted_date_idx").on(table.submittedDate),
    statusIdx: index("finance_reimbursements_status_idx").on(table.status),
    codeIdx: index("finance_reimbursements_request_code_idx").on(table.requestCode),
  })
)
