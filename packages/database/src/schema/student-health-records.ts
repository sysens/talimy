import { index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { students } from "./students"
import { tenants } from "./tenants"

export const studentHealthRecordToneEnum = pgEnum("student_health_record_tone", [
  "info",
  "warning",
  "danger",
])

export const studentHealthRecords = pgTable(
  "student_health_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    tone: studentHealthRecordToneEnum("tone").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("student_health_records_tenant_id_idx").on(table.tenantId),
    studentIdx: index("student_health_records_student_id_idx").on(table.studentId),
  })
)
