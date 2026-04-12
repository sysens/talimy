import {
  date,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { tenants } from "./tenants"
import { users } from "./users"

export const staffAttendanceStatusEnum = pgEnum("staff_attendance_status", [
  "present",
  "late",
  "absent",
])

export const staffAttendanceRecords = pgTable(
  "staff_attendance_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: staffAttendanceStatusEnum("status").notNull(),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("staff_attendance_records_tenant_id_idx").on(table.tenantId),
    userIdx: index("staff_attendance_records_user_id_idx").on(table.userId),
    dateIdx: index("staff_attendance_records_date_idx").on(table.date),
    userDateUq: uniqueIndex("staff_attendance_records_user_date_uq").on(table.userId, table.date),
  })
)
