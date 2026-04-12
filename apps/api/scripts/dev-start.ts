import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs"
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
const NEST_CORE_ENTRYPOINT_CONTENT = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestFactory = exports.APP_PIPE = exports.APP_INTERCEPTOR = exports.APP_GUARD = exports.APP_FILTER = void 0;
const tslib_1 = require("tslib");
/*
 * Nest @core
 * Copyright(c) 2017 - 2025 Kamil Mysliwiec
 * https://nestjs.com
 * MIT Licensed
 */
require("reflect-metadata");
tslib_1.__exportStar(require("./adapters"), exports);
tslib_1.__exportStar(require("./application-config"), exports);
var constants_1 = require("./constants");
Object.defineProperty(exports, "APP_FILTER", { enumerable: true, get: function () { return constants_1.APP_FILTER; } });
Object.defineProperty(exports, "APP_GUARD", { enumerable: true, get: function () { return constants_1.APP_GUARD; } });
Object.defineProperty(exports, "APP_INTERCEPTOR", { enumerable: true, get: function () { return constants_1.APP_INTERCEPTOR; } });
Object.defineProperty(exports, "APP_PIPE", { enumerable: true, get: function () { return constants_1.APP_PIPE; } });
tslib_1.__exportStar(require("./discovery"), exports);
tslib_1.__exportStar(require("./exceptions"), exports);
tslib_1.__exportStar(require("./helpers"), exports);
tslib_1.__exportStar(require("./injector"), exports);
tslib_1.__exportStar(require("./inspector"), exports);
tslib_1.__exportStar(require("./metadata-scanner"), exports);
tslib_1.__exportStar(require("./middleware"), exports);
tslib_1.__exportStar(require("./nest-application"), exports);
tslib_1.__exportStar(require("./nest-application-context"), exports);
var nest_factory_1 = require("./nest-factory");
Object.defineProperty(exports, "NestFactory", { enumerable: true, get: function () { return nest_factory_1.NestFactory; } });
tslib_1.__exportStar(require("./repl"), exports);
tslib_1.__exportStar(require("./router"), exports);
tslib_1.__exportStar(require("./services"), exports);
`

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

function ensureNestCoreEntrypoint(): void {
  const packageEntrypointPath = resolve(projectRoot, "node_modules", "@nestjs", "core", "index.js")

  if (!existsSync(packageEntrypointPath)) {
    return
  }

  const candidatePaths = [packageEntrypointPath]

  try {
    const resolvedEntrypointPath = realpathSync(packageEntrypointPath)
    if (!candidatePaths.includes(resolvedEntrypointPath)) {
      candidatePaths.push(resolvedEntrypointPath)
    }
  } catch {
    // ignore realpath failures and continue with the direct path
  }

  for (const filePath of candidatePaths) {
    const fileContent = readFileSync(filePath, "utf8")

    if (!fileContent.includes("build-hook-start") && fileContent.includes("NestFactory")) {
      continue
    }

    writeFileSync(filePath, NEST_CORE_ENTRYPOINT_CONTENT, "utf8")
    console.warn(`[api:dev] @nestjs/core index.js restore qilindi: ${filePath}`)
  }
}

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
  runCommand(["run", "--cwd", "../../packages/shared", "build"])
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
      return
    }

    if ((code ?? 0) !== 0 || signal) {
      const configuredPort = process.env.PORT ?? "4000"
      console.error(
        `[api:dev] runtime process to'xtadi (code=${code ?? "null"}, signal=${signal ?? "null"}). PORT=${configuredPort} band bo'lishi yoki startup xatosi bo'lishi mumkin.`
      )
    }
  })

  child.on("error", (error) => {
    const configuredPort = process.env.PORT ?? "4000"
    console.error(
      `[api:dev] runtime process ishga tushmadi. PORT=${configuredPort}, sabab: ${error.message}`
    )
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
ensureNestCoreEntrypoint()
wireSignals()
compilerWatchProcess = startCompilerWatchProcess()
