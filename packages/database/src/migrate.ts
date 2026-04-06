import { sql } from "drizzle-orm"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { resolve } from "node:path"
import { db } from "./index"
import { pool } from "./client"

const MIGRATION_ADVISORY_LOCK_ID = 844095126341234321n
const MIGRATIONS_FOLDER = resolve(import.meta.dir, "..", "drizzle")

export async function runMigrations(): Promise<void> {
  await db.execute(sql`SELECT pg_advisory_lock(${MIGRATION_ADVISORY_LOCK_ID})`)

  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
  } finally {
    await db.execute(sql`SELECT pg_advisory_unlock(${MIGRATION_ADVISORY_LOCK_ID})`)
    await pool.end()
  }
}

if (import.meta.main) {
  await runMigrations()
}
