import { date, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { students } from "./students"
import { tenants } from "./tenants"

export const studentBehaviorLogEntryTypeEnum = pgEnum("student_behavior_log_entry_type", [
  "positive_note",
  "minor_issue",
  "major_issue",
])

export const studentBehaviorLogActionStatusEnum = pgEnum("student_behavior_log_action_status", [
  "record_recognition",
  "recognition_recorded",
  "issue_warning",
  "parent_notified",
])

export const studentBehaviorLogs = pgTable(
  "student_behavior_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    recordDate: date("record_date").notNull(),
    entryType: studentBehaviorLogEntryTypeEnum("entry_type").notNull(),
    title: varchar("title", { length: 120 }).notNull(),
    details: varchar("details", { length: 500 }).notNull(),
    reportedByLabel: varchar("reported_by_label", { length: 150 }).notNull(),
    actionStatus: studentBehaviorLogActionStatusEnum("action_status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("student_behavior_logs_tenant_id_idx").on(table.tenantId),
    studentIdx: index("student_behavior_logs_student_id_idx").on(table.studentId),
  })
)
