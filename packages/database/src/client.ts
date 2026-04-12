import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { config } from "dotenv"
import { Pool } from "pg"
import { resolveDatabaseSsl } from "./ssl"

const packageRoot = resolve(__dirname, "..")
const repoRoot = resolve(packageRoot, "..", "..")
const envCandidates = [
  resolve(process.cwd(), ".env"),
  resolve(repoRoot, "apps", "api", ".env"),
  resolve(repoRoot, ".env"),
] as const

for (const path of envCandidates) {
  if (!existsSync(path)) {
    continue
  }

  config({ override: false, path })
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set for @talimy/database.")
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: resolveDatabaseSsl(databaseUrl),
})
