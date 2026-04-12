import {
  boolean,
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { students } from "./students"
import { tenants } from "./tenants"

export const studentGrantTypeEnum = pgEnum("student_grant_type", ["zakat", "sponsor", "other"])

export const studentMealPlanEnum = pgEnum("student_meal_plan", ["none", "one_meal", "three_meals"])

export const studentResidencePermitStatusEnum = pgEnum("student_residence_permit_status", [
  "obtained",
  "pending_90_days",
  "none",
])

export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    admissionNumber: varchar("admission_number", { length: 50 }).notNull(),
    previousSchool: varchar("previous_school", { length: 255 }).notNull(),
    hobbiesInterests: varchar("hobbies_interests", { length: 500 }),
    specialNeedsSupport: boolean("special_needs_support").notNull().default(false),
    medicalConditionAlert: boolean("medical_condition_alert").notNull().default(false),
    medicalConditionDetails: varchar("medical_condition_details", { length: 1000 }),
    grantType: studentGrantTypeEnum("grant_type"),
    totalFee: numeric("total_fee", { precision: 12, scale: 2 }),
    paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }),
    dormitoryRoom: varchar("dormitory_room", { length: 50 }),
    mealsPerDay: studentMealPlanEnum("meals_per_day"),
    residencePermitStatus: studentResidencePermitStatusEnum("residence_permit_status"),
    contractNumber: varchar("contract_number", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("student_profiles_tenant_id_idx").on(table.tenantId),
    studentIdx: uniqueIndex("student_profiles_student_id_uidx").on(table.studentId),
    admissionNumberIdx: uniqueIndex("student_profiles_tenant_admission_number_uidx").on(
      table.tenantId,
      table.admissionNumber
    ),
  })
)
