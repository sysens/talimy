import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherWorkloadDatasetEnum = pgEnum("teacher_workload_dataset", [
  "last_8_months",
  "this_semester",
])

export const teacherWorkloadSnapshots = pgTable(
  "teacher_workload_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    dataset: teacherWorkloadDatasetEnum("dataset").notNull(),
    periodDate: date("period_date").notNull(),
    label: varchar("label", { length: 24 }).notNull(),
    sortOrder: integer("sort_order").notNull(),
    totalClasses: integer("total_classes").notNull(),
    teachingHours: integer("teaching_hours").notNull(),
    extraDuties: integer("extra_duties").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_workload_snapshots_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_workload_snapshots_teacher_id_idx").on(table.teacherId),
    datasetIdx: index("teacher_workload_snapshots_dataset_idx").on(table.dataset),
  })
)
