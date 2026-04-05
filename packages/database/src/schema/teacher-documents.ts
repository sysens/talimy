import { index, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { teachers } from "./teachers"
import { tenants } from "./tenants"

export const teacherDocumentTypeEnum = pgEnum("teacher_document_type", [
  "diploma",
  "certificate",
  "id_card",
  "other",
])

export const teacherDocuments = pgTable(
  "teacher_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    documentType: teacherDocumentTypeEnum("document_type").notNull().default("other"),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("teacher_documents_tenant_id_idx").on(table.tenantId),
    teacherIdx: index("teacher_documents_teacher_id_idx").on(table.teacherId),
  })
)
