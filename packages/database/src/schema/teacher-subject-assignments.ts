import { boolean, index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

import { subjects } from "./subjects"
import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherSubjectAssignments = pgTable(
  "teacher_subject_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_subject_assignments_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_subject_assignments_teacher_id_idx").on(table.teacherId),
    subjectIdx: index("teacher_subject_assignments_subject_id_idx").on(table.subjectId),
  })
)
