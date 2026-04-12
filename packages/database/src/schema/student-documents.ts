import { index, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { students } from "./students"
import { tenants } from "./tenants"

export const studentDocumentTypeEnum = pgEnum("student_document_type", [
  "report_card",
  "certificate",
  "id_card",
  "other",
])

export const studentDocuments = pgTable(
  "student_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    documentType: studentDocumentTypeEnum("document_type").notNull().default("other"),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("student_documents_tenant_id_idx").on(table.tenantId),
    studentIdx: index("student_documents_student_id_idx").on(table.studentId),
  })
)
