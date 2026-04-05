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

import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherAttendanceStatusEnum = pgEnum("teacher_attendance_status", [
  "present",
  "late",
  "on_leave",
])

export const teacherAttendanceRecords = pgTable(
  "teacher_attendance_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: teacherAttendanceStatusEnum("status").notNull(),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_attendance_records_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_attendance_records_teacher_id_idx").on(table.teacherId),
    dateIdx: index("teacher_attendance_records_date_idx").on(table.date),
    teacherDateUq: uniqueIndex("teacher_attendance_records_teacher_date_uq").on(
      table.teacherId,
      table.date
    ),
  })
)
