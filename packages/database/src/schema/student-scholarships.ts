import { index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { students } from "./students"
import { tenants } from "./tenants"

export const studentScholarshipTypeEnum = pgEnum("student_scholarship_type", [
  "finance",
  "enrichment",
])

export const studentScholarships = pgTable(
  "student_scholarships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    scholarshipType: studentScholarshipTypeEnum("scholarship_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("student_scholarships_tenant_id_idx").on(table.tenantId),
    studentIdx: index("student_scholarships_student_id_idx").on(table.studentId),
  })
)
