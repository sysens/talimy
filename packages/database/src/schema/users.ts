import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { tenants } from "./tenants"

export const userRoleEnum = pgEnum("user_role", [
  "platform_admin",
  "school_admin",
  "teacher",
  "student",
  "parent",
])
export const userGenderScopeEnum = pgEnum("user_gender_scope", ["male", "female", "all"])

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 30 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    middleName: varchar("middle_name", { length: 100 }),
    nationality: varchar("nationality", { length: 100 }),
    telegramUsername: varchar("telegram_username", { length: 255 }),
    address: varchar("address", { length: 500 }),
    role: userRoleEnum("role").notNull(),
    genderScope: userGenderScopeEnum("gender_scope").notNull().default("all"),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    avatar: varchar("avatar", { length: 500 }),
    avatarStorageKey: varchar("avatar_storage_key", { length: 500 }),
    isActive: boolean("is_active").notNull().default(true),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index("users_tenant_id_idx").on(table.tenantId),
    roleIdx: index("users_role_idx").on(table.role),
  })
)
