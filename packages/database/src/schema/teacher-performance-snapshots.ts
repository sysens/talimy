import { index, integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherPerformancePeriodEnum = pgEnum("teacher_performance_period", [
  "last_month",
  "last_quarter",
])

export const teacherPerformanceSnapshots = pgTable(
  "teacher_performance_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    period: teacherPerformancePeriodEnum("period").notNull(),
    gradingTimelinessValue: integer("grading_timeliness_value").notNull(),
    gradingTimelinessTarget: integer("grading_timeliness_target").notNull(),
    studentAverageGradeValue: integer("student_average_grade_value").notNull(),
    studentAverageGradeTarget: integer("student_average_grade_target").notNull(),
    studentFeedbackValue: integer("student_feedback_value").notNull(),
    studentFeedbackTarget: integer("student_feedback_target").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_performance_snapshots_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_performance_snapshots_teacher_id_idx").on(table.teacherId),
    periodIdx: index("teacher_performance_snapshots_period_idx").on(table.period),
    teacherPeriodUq: uniqueIndex("teacher_performance_snapshots_teacher_period_uq").on(
      table.teacherId,
      table.period
    ),
  })
)
