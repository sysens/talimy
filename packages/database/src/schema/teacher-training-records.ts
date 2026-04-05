import { date, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherTrainingSemesterEnum = pgEnum("teacher_training_semester", [
  "current",
  "previous",
])
export const teacherTrainingStatusEnum = pgEnum("teacher_training_status", [
  "upcoming",
  "completed",
  "cancelled",
])

export const teacherTrainingRecords = pgTable(
  "teacher_training_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    semester: teacherTrainingSemesterEnum("semester").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 100 }).notNull(),
    eventDate: date("event_date").notNull(),
    locationLabel: varchar("location_label", { length: 255 }).notNull(),
    status: teacherTrainingStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_training_records_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_training_records_teacher_id_idx").on(table.teacherId),
    semesterIdx: index("teacher_training_records_semester_idx").on(table.semester),
  })
)
