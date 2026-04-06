import { spawn, type ChildProcess } from "node:child_process"
import { once } from "node:events"

import { runMigrations } from "../../../packages/database/src/migrate"

const STARTUP_MIGRATIONS_ENABLED = process.env.RUN_DB_MIGRATIONS_ON_BOOT !== "false"

async function main(): Promise<void> {
  if (STARTUP_MIGRATIONS_ENABLED) {
    await runMigrations()
  }

  const child = spawn(process.execPath, ["dist/main.js"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  })

  forwardSignals(child)

  const [code, signal] = (await once(child, "exit")) as [number | null, NodeJS.Signals | null]

  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
}

function forwardSignals(child: ChildProcess): void {
  const signals: readonly NodeJS.Signals[] = ["SIGINT", "SIGTERM"]

  for (const signal of signals) {
    process.on(signal, () => {
      if (!child.killed) {
        child.kill(signal)
      }
    })
  }
}

void main().catch((error: Error) => {
  console.error("[start:prod] fatal", error)
  process.exit(1)
})
