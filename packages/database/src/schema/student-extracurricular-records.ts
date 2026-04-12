import { date, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { students } from "./students"
import { tenants } from "./tenants"

export const studentExtracurricularIconEnum = pgEnum("student_extracurricular_icon", [
  "swimming",
  "dance",
  "robotics",
  "general",
])

export const studentExtracurricularRecords = pgTable(
  "student_extracurricular_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    clubName: varchar("club_name", { length: 150 }).notNull(),
    roleLabel: varchar("role_label", { length: 120 }).notNull(),
    achievement: varchar("achievement", { length: 255 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    advisorName: varchar("advisor_name", { length: 150 }).notNull(),
    iconKey: studentExtracurricularIconEnum("icon_key").notNull().default("general"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("student_extracurricular_records_tenant_id_idx").on(table.tenantId),
    studentIdx: index("student_extracurricular_records_student_id_idx").on(table.studentId),
  })
)
