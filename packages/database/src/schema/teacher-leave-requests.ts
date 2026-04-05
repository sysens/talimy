import { date, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { teachers } from "./teachers"
import { tenants } from "./tenants"
import { users } from "./users"

export const teacherLeaveRequestTypeEnum = pgEnum("teacher_leave_request_type", [
  "annual_leave",
  "personal_leave",
  "sick_leave",
  "unpaid_leave",
])
export const teacherLeaveRequestStatusEnum = pgEnum("teacher_leave_request_status", [
  "pending",
  "approved",
  "declined",
])

export const teacherLeaveRequests = pgTable(
  "teacher_leave_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    requestType: teacherLeaveRequestTypeEnum("request_type").notNull(),
    reason: varchar("reason", { length: 500 }).notNull(),
    status: teacherLeaveRequestStatusEnum("status").notNull().default("pending"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decidedByUserId: uuid("decided_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_leave_requests_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_leave_requests_teacher_id_idx").on(table.teacherId),
    statusIdx: index("teacher_leave_requests_status_idx").on(table.status),
  })
)
