import { index, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

import { classes } from "./classes"
import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherClassAssignments = pgTable(
  "teacher_class_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_class_assignments_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_class_assignments_teacher_id_idx").on(table.teacherId),
    classIdx: index("teacher_class_assignments_class_id_idx").on(table.classId),
  })
)
