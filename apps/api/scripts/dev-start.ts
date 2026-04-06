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

const COMPILER_READY_MARKER = "Found 0 errors. Watching for file changes."

const projectRoot = resolve(import.meta.dir, "..")
const envFilePath = resolve(projectRoot, ".env")
const requestedTarget = process.argv[2]
const devTarget: DevTarget = requestedTarget === "worker" ? "worker" : "main"
const targetConfig = DEV_TARGETS[devTarget]
const distEntryPath = resolve(projectRoot, "dist", targetConfig.distFile)
const appModuleDistPath = resolve(projectRoot, "dist", "app.module.js")

let shuttingDown = false
let compilerWatchProcess: ChildProcess | null = null
let runtimeProcess: ChildProcess | null = null
let refreshInFlight = false
let pendingRefresh = false
let compilerStdoutBuffer = ""

function runCommand(args: readonly string[]): void {
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

function isRuntimeBundleReady(): boolean {
  return existsSync(distEntryPath) && existsSync(appModuleDistPath)
}

function ensureBuiltEntry(): void {
  if (isRuntimeBundleReady()) {
    return
  }

  console.log(
    `[api:dev] ${targetConfig.distFile} yoki app.module.js topilmadi, initial build bajarilmoqda...`
  )
  runInitialBuild()

  if (!isRuntimeBundleReady()) {
    console.error(`[api:dev] build tugadi, lekin runtime bundle hali ham tayyor emas.`)
    process.exit(1)
  }
}

function buildRuntimeArgs(): string[] {
  return existsSync(envFilePath) ? ["--env-file", envFilePath, distEntryPath] : [distEntryPath]
}

function stopChild(child: ChildProcess | null, signal: NodeJS.Signals): void {
  if (!child || child.killed) {
    return
  }

  child.kill(signal)
}

function shutdownAll(signal: NodeJS.Signals): void {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  stopChild(runtimeProcess, signal)
  stopChild(compilerWatchProcess, signal)
}

function wireSignals(): void {
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => shutdownAll(signal))
  }
}

function startRuntimeProcess(): void {
  const child = spawn("node", buildRuntimeArgs(), {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  })

  runtimeProcess = child

  child.on("exit", (code, signal) => {
    if (runtimeProcess !== child) {
      return
    }

    runtimeProcess = null

    if (shuttingDown) {
      if (signal) {
        process.kill(process.pid, signal)
        return
      }

      process.exit(code ?? 0)
    }
  })
}

function restartRuntimeProcess(): void {
  if (runtimeProcess) {
    stopChild(runtimeProcess, "SIGTERM")
  }

  startRuntimeProcess()
}

function refreshRuntimeFromCompiler(): void {
  if (refreshInFlight) {
    pendingRefresh = true
    return
  }

  refreshInFlight = true

  try {
    runCommand(["x", "tsc-alias", "-p", "tsconfig.build.json"])
    restartRuntimeProcess()
  } finally {
    refreshInFlight = false

    if (pendingRefresh) {
      pendingRefresh = false
      refreshRuntimeFromCompiler()
    }
  }
}

function handleCompilerStdoutChunk(chunk: Buffer): void {
  const text = chunk.toString("utf8")
  process.stdout.write(text)
  compilerStdoutBuffer += text

  if (!compilerStdoutBuffer.includes(COMPILER_READY_MARKER)) {
    if (compilerStdoutBuffer.length > 4096) {
      compilerStdoutBuffer = compilerStdoutBuffer.slice(-2048)
    }
    return
  }

  compilerStdoutBuffer = ""

  if (!shuttingDown) {
    refreshRuntimeFromCompiler()
  }
}

function handleCompilerStderrChunk(chunk: Buffer): void {
  process.stderr.write(chunk.toString("utf8"))
}

function startCompilerWatchProcess(): ChildProcess {
  const child = spawn("bun", ["x", "nest", "build", "--watch", "--preserveWatchOutput"], {
    cwd: projectRoot,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  })

  child.stdout?.on("data", handleCompilerStdoutChunk)
  child.stderr?.on("data", handleCompilerStderrChunk)

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return
    }

    console.error(
      `[api:dev] nest build --watch to'xtadi (code=${code ?? "null"}, signal=${signal ?? "null"})`
    )
    shutdownAll("SIGTERM")
    process.exit(code ?? 1)
  })

  return child
}

ensureBuiltEntry()
wireSignals()
compilerWatchProcess = startCompilerWatchProcess()
