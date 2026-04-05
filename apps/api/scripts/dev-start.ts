import { existsSync } from "node:fs"
import { spawn, spawnSync, type ChildProcess } from "node:child_process"
import { resolve } from "node:path"

type DevTarget = "main" | "worker"

type DevTargetConfig = {
  distFile: string
}

const DEV_TARGETS: Record<DevTarget, DevTargetConfig> = {
  main: {
    distFile: "main.js",
  },
  worker: {
    distFile: "worker.main.js",
  },
}

const projectRoot = resolve(import.meta.dir, "..")
const envFilePath = resolve(projectRoot, ".env")
const requestedTarget = process.argv[2]
const devTarget: DevTarget = requestedTarget === "worker" ? "worker" : "main"
const targetConfig = DEV_TARGETS[devTarget]
const distEntryPath = resolve(projectRoot, "dist", targetConfig.distFile)

function runCommand(args: string[]): void {
  const result = spawnSync("bun", args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function runInitialBuild(): void {
  runCommand(["x", "nest", "build"])
  runCommand(["x", "tsc-alias", "-p", "tsconfig.build.json"])
}

function ensureBuiltEntry(): void {
  if (existsSync(distEntryPath)) {
    return
  }

  console.log(`[api:dev] ${targetConfig.distFile} topilmadi, initial build bajarilmoqda...`)
  runInitialBuild()

  if (!existsSync(distEntryPath)) {
    console.error(`[api:dev] build tugadi, lekin ${targetConfig.distFile} hali ham topilmadi.`)
    process.exit(1)
  }
}

function startCompilerWatchProcess(): ChildProcess {
  return spawn("bun", ["x", "nest", "build", "--watch"], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  })
}

function startRuntimeWatchProcess(): ChildProcess {
  const args = existsSync(envFilePath)
    ? ["--env-file", envFilePath, "--watch", distEntryPath]
    : ["--watch", distEntryPath]

  return spawn("node", args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  })
}

function stopChild(child: ChildProcess, signal: NodeJS.Signals): void {
  if (!child.killed) {
    child.kill(signal)
  }
}

function wireSignals(children: ChildProcess[]): void {
  const forwardSignal = (signal: NodeJS.Signals): void => {
    for (const child of children) {
      stopChild(child, signal)
    }
  }

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => forwardSignal(signal))
  }
}

ensureBuiltEntry()

const compilerWatchProcess = startCompilerWatchProcess()
const runtimeWatchProcess = startRuntimeWatchProcess()

wireSignals([compilerWatchProcess, runtimeWatchProcess])

compilerWatchProcess.on("exit", (code, signal) => {
  stopChild(runtimeWatchProcess, "SIGTERM")

  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

runtimeWatchProcess.on("exit", (code, signal) => {
  stopChild(compilerWatchProcess, "SIGTERM")

  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
