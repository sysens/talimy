import { boolean, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

import { tenants } from "./tenants"

export const tenantStudentModuleSettings = pgTable(
  "tenant_student_module_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    financeEnabled: boolean("finance_enabled").notNull().default(true),
    grantEnabled: boolean("grant_enabled").notNull().default(true),
    dormitoryEnabled: boolean("dormitory_enabled").notNull().default(true),
    mealsEnabled: boolean("meals_enabled").notNull().default(true),
    residencePermitEnabled: boolean("residence_permit_enabled").notNull().default(true),
    contractNumberEnabled: boolean("contract_number_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: uniqueIndex("tenant_student_module_settings_tenant_id_uidx").on(table.tenantId),
  })
)
