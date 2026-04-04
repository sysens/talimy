import { request as httpRequest } from "node:http"
import { request as httpsRequest } from "node:https"
import { headers } from "next/headers"
import { loginSchema } from "@talimy/shared"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { getApiProxyOrigin } from "@/config/site"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import {
  resolveHostScopeFromHeaders,
  resolveRequestHostFromHeaders,
  type RequestHostScope,
} from "@/lib/server/request-host"

type GenderScope = "male" | "female" | "all"

type AuthIdentity = {
  sub: string
  email: string
  tenantId: string
  tenantSlug?: string | null
  roles: string[]
  genderScope: GenderScope
}

type AuthSession = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

type BackendEnvelope = {
  success?: boolean
  data?: AuthSession
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

type AuthUser = {
  id: string
  email: string
  tenantId: string
  tenantSlug?: string | null
  roles: string[]
  genderScope: GenderScope
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const ACCESS_TOKEN_REFRESH_SKEW_MS = 30_000

export const nextAuthConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: AUTH_ROUTE_PATHS.login,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          return null
        }

        const incomingHeaders = await headers()
        const hostScope = resolveLoginAttemptHostScope(incomingHeaders, credentials)
        if (hostScope.kind !== "platform" && hostScope.kind !== "school") {
          return null
        }

        const requestHeaders = await buildForwardHeaders(incomingHeaders, hostScope)
        const loginSession = await requestAuthSession(
          "/api/auth/login",
          parsed.data,
          requestHeaders
        )
        if (!loginSession) {
          return null
        }

        const identity = decodeAccessIdentity(loginSession.accessToken)
        if (!identity || !canIdentityAccessHost(identity, hostScope)) {
          return null
        }

        return {
          id: identity.sub,
          email: identity.email,
          tenantId: identity.tenantId,
          tenantSlug: identity.tenantSlug ?? null,
          roles: identity.roles,
          genderScope: identity.genderScope,
          accessToken: loginSession.accessToken,
          refreshToken: loginSession.refreshToken,
          expiresAt: toExpiresAt(loginSession.expiresIn),
        } satisfies AuthUser
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authUser = user as AuthUser
        token.sub = authUser.id
        token.email = authUser.email
        token.tenantId = authUser.tenantId
        token.tenantSlug = authUser.tenantSlug ?? null
        token.roles = authUser.roles
        token.genderScope = authUser.genderScope
        token.accessToken = authUser.accessToken
        token.refreshToken = authUser.refreshToken
        token.expiresAt = authUser.expiresAt
        return token
      }

      if (trigger === "update") {
        return applySessionUpdateToToken(token, session)
      }

      const expiresAt = typeof token.expiresAt === "number" ? token.expiresAt : 0
      if (expiresAt > Date.now() + ACCESS_TOKEN_REFRESH_SKEW_MS) {
        return token
      }

      if (typeof token.refreshToken !== "string" || token.refreshToken.length === 0) {
        return token
      }

      const refreshedSession = await requestAuthSession("/api/auth/refresh", {
        refreshToken: token.refreshToken,
      })
      if (!refreshedSession) {
        return markTokenAuthError(token, "refresh_failed")
      }

      const refreshedIdentity = decodeAccessIdentity(refreshedSession.accessToken)
      if (!refreshedIdentity) {
        return markTokenAuthError(token, "refresh_payload_invalid")
      }

      token.sub = refreshedIdentity.sub
      token.email = refreshedIdentity.email
      token.tenantId = refreshedIdentity.tenantId
      token.tenantSlug = refreshedIdentity.tenantSlug ?? null
      token.roles = refreshedIdentity.roles
      token.genderScope = refreshedIdentity.genderScope
      token.accessToken = refreshedSession.accessToken
      token.refreshToken = refreshedSession.refreshToken
      token.expiresAt = toExpiresAt(refreshedSession.expiresIn)
      delete token.authError
      return token
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }

      try {
        const targetUrl = new URL(url)
        if (isAllowedAuthRedirectOrigin(targetUrl.origin)) {
          return targetUrl.toString()
        }
      } catch {}

      return baseUrl
    },
    async session({ session, token }) {
      const existingUser = session.user ?? { name: null, email: null, image: null }
      const resolvedGenderScope = normalizeGenderScope(token.genderScope) ?? "all"
      session.user = {
        ...existingUser,
        id: typeof token.sub === "string" ? token.sub : "",
        email: typeof token.email === "string" ? token.email : existingUser.email,
        tenantId: typeof token.tenantId === "string" ? token.tenantId : "",
        tenantSlug: typeof token.tenantSlug === "string" ? token.tenantSlug : null,
        roles: normalizeStringArray(token.roles),
        genderScope: resolvedGenderScope,
      }

      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : null
      session.refreshToken = null
      session.expiresAt = typeof token.expiresAt === "number" ? token.expiresAt : null
      session.authError = typeof token.authError === "string" ? token.authError : null

      return session
    },
  },
  events: {
    async signOut(message) {
      const refreshToken =
        "token" in message && message.token && typeof message.token.refreshToken === "string"
          ? message.token.refreshToken
          : ""
      if (!refreshToken) {
        return
      }

      await requestAuthSession("/api/auth/logout", { refreshToken })
    },
  },
}

async function requestAuthSession(
  pathname: string,
  payload: Record<string, unknown>,
  extraHeaders?: Headers
): Promise<AuthSession | null> {
  const requestHeaders = new Headers({
    "content-type": "application/json",
  })
  if (extraHeaders) {
    for (const [key, value] of extraHeaders.entries()) {
      requestHeaders.set(key, value)
    }
  }

  const response = await postJsonToApi(pathname, payload, requestHeaders)
  if (response.status < 200 || response.status >= 300) {
    return null
  }

  let parsed = {}
  try {
    parsed = JSON.parse(response.body) as BackendEnvelope
  } catch {
    return null
  }

  return extractSession(parsed)
}

function postJsonToApi(
  pathname: string,
  payload: Record<string, unknown>,
  headers: Headers
): Promise<{ status: number; body: string }> {
  const targetUrls = buildApiTargetUrls(new URL(`${getApiProxyOrigin()}${pathname}`))

  return attemptPostJson(targetUrls, payload, headers)
}

function attemptPostJson(
  targetUrls: URL[],
  payload: Record<string, unknown>,
  headers: Headers
): Promise<{ status: number; body: string }> {
  const [targetUrl, ...fallbackUrls] = targetUrls
  if (!targetUrl) {
    return Promise.reject(new Error("No API target URL configured"))
  }

  const requestImpl = targetUrl.protocol === "https:" ? httpsRequest : httpRequest

  return new Promise((resolve, reject) => {
    const request = requestImpl(
      targetUrl,
      {
        method: "POST",
        headers: Object.fromEntries(headers.entries()),
      },
      (response) => {
        const chunks: Buffer[] = []
        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        })
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
          })
        })
        response.on("error", reject)
      }
    )

    request.on("error", (error) => {
      if (fallbackUrls.length > 0 && shouldRetryApiRequest(error)) {
        void attemptPostJson(fallbackUrls, payload, headers).then(resolve).catch(reject)
        return
      }

      reject(error)
    })
    request.write(JSON.stringify(payload))
    request.end()
  })
}

function buildApiTargetUrls(primaryUrl: URL): URL[] {
  const targets = [new URL(primaryUrl.toString())]

  if (primaryUrl.hostname === "localhost") {
    const ipv4LoopbackUrl = new URL(primaryUrl.toString())
    ipv4LoopbackUrl.hostname = "127.0.0.1"
    targets.push(ipv4LoopbackUrl)
  }

  return targets
}

function shouldRetryApiRequest(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false
  }

  const nodeError = error as NodeJS.ErrnoException & { errors?: unknown[] }
  if (nodeError.code === "ECONNREFUSED" || nodeError.code === "EHOSTUNREACH") {
    return true
  }

  if (Array.isArray(nodeError.errors)) {
    return nodeError.errors.some((entry) => {
      if (!entry || typeof entry !== "object") {
        return false
      }

      const nestedError = entry as NodeJS.ErrnoException
      return nestedError.code === "ECONNREFUSED" || nestedError.code === "EHOSTUNREACH"
    })
  }

  return false
}

async function buildForwardHeaders(
  incomingHeaders: Awaited<ReturnType<typeof headers>>,
  hostScope: RequestHostScope
): Promise<Headers> {
  const forwardedHeaders = new Headers()
  const forwardedHost = resolveRequestHostFromHeaders(incomingHeaders)
  const forwardedProto = incomingHeaders.get("x-forwarded-proto")
  const forwardedFor = incomingHeaders.get("x-forwarded-for")

  if (forwardedHost) {
    forwardedHeaders.set("x-forwarded-host", forwardedHost)
  }

  if (forwardedProto) {
    forwardedHeaders.set("x-forwarded-proto", forwardedProto)
  }

  if (forwardedFor) {
    forwardedHeaders.set("x-forwarded-for", forwardedFor)
  }

  if (hostScope.kind === "school") {
    forwardedHeaders.set("x-tenant-slug", hostScope.tenantSlug)
  }

  if (hostScope.kind === "platform" || hostScope.kind === "school") {
    forwardedHeaders.set("x-workspace-kind", hostScope.kind)
  }

  return forwardedHeaders
}

function extractSession(payload: BackendEnvelope): AuthSession | null {
  if (isAuthSession(payload.data)) {
    return payload.data
  }

  if (isAuthSession(payload)) {
    return {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresIn: payload.expiresIn,
    }
  }

  return null
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false
  }

  const session = value as Partial<AuthSession>
  return (
    typeof session.accessToken === "string" &&
    session.accessToken.length > 0 &&
    typeof session.refreshToken === "string" &&
    session.refreshToken.length > 0 &&
    typeof session.expiresIn === "number" &&
    Number.isFinite(session.expiresIn) &&
    session.expiresIn > 0
  )
}

function decodeAccessIdentity(accessToken: string): AuthIdentity | null {
  const parts = accessToken.split(".")
  if (parts.length !== 3 || !parts[1]) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as Partial<{
      sub: unknown
      email: unknown
      tenantId: unknown
      tenantSlug: unknown
      roles: unknown
      genderScope: unknown
    }>

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.tenantId !== "string"
    ) {
      return null
    }

    const roles = normalizeStringArray(payload.roles)
    const genderScope = normalizeGenderScope(payload.genderScope)
    if (!genderScope) {
      return null
    }

    return {
      sub: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      tenantSlug: typeof payload.tenantSlug === "string" ? payload.tenantSlug : null,
      roles,
      genderScope,
    }
  } catch {
    return null
  }
}

function resolveLoginAttemptHostScope(
  headers: Headers,
  credentials: Partial<Record<string, unknown>> | undefined
): ReturnType<typeof resolveHostScopeFromHeaders> {
  const hostScope = resolveHostScopeFromHeaders(headers)
  if (hostScope.kind !== "public" && hostScope.kind !== "api") {
    return hostScope
  }

  const callbackScope = resolveHostScopeFromCallbackUrl(credentials)
  if (callbackScope) {
    return callbackScope
  }

  return hostScope
}

function resolveHostScopeFromCallbackUrl(
  credentials: Partial<Record<string, unknown>> | undefined
): ReturnType<typeof resolveHostScopeFromHeaders> | null {
  const rawCallbackUrl =
    typeof credentials?.callbackUrl === "string" ? credentials.callbackUrl : null
  if (!rawCallbackUrl) {
    return null
  }

  try {
    const callbackUrl = new URL(rawCallbackUrl)
    const syntheticHeaders = new Headers({ host: callbackUrl.host })
    const scope = resolveHostScopeFromHeaders(syntheticHeaders)
    return scope.kind === "platform" || scope.kind === "school" ? scope : null
  } catch {
    return null
  }
}

function canIdentityAccessHost(
  identity: AuthIdentity,
  hostScope: ReturnType<typeof resolveHostScopeFromHeaders>
): boolean {
  if (hostScope.kind === "platform") {
    return identity.roles.includes("platform_admin")
  }

  if (hostScope.kind === "school") {
    return !identity.roles.includes("platform_admin")
  }

  return false
}

function isAllowedAuthRedirectOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin)
    const normalizedHostname = hostname.toLowerCase()
    return (
      normalizedHostname === "localhost" ||
      normalizedHostname === "127.0.0.1" ||
      normalizedHostname.endsWith(".localhost") ||
      normalizedHostname === "talimy.space" ||
      normalizedHostname.endsWith(".talimy.space")
    )
  } catch {
    return false
  }
}

function toExpiresAt(expiresInSeconds: number): number {
  const safeExpiresIn = Number.isFinite(expiresInSeconds) ? expiresInSeconds : 900
  return Date.now() + Math.max(safeExpiresIn, 1) * 1000
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

function normalizeGenderScope(value: unknown): GenderScope | null {
  if (value === "male" || value === "female" || value === "all") {
    return value
  }

  return null
}

function applySessionUpdateToToken(
  token: Record<string, unknown>,
  sessionUpdate: unknown
): Record<string, unknown> {
  if (!sessionUpdate || typeof sessionUpdate !== "object") {
    return token
  }

  const updateRecord = sessionUpdate as {
    accessToken?: unknown
    expiresAt?: unknown
    refreshToken?: unknown
    user?: {
      genderScope?: unknown
    }
  }

  if (typeof updateRecord.accessToken === "string" && updateRecord.accessToken.length > 0) {
    token.accessToken = updateRecord.accessToken
  }

  if (typeof updateRecord.refreshToken === "string" && updateRecord.refreshToken.length > 0) {
    token.refreshToken = updateRecord.refreshToken
  }

  if (typeof updateRecord.expiresAt === "number" && Number.isFinite(updateRecord.expiresAt)) {
    token.expiresAt = updateRecord.expiresAt
  }

  const genderScope = normalizeGenderScope(updateRecord.user?.genderScope)
  if (genderScope) {
    token.genderScope = genderScope
  }

  delete token.authError
  return token
}

function markTokenAuthError(
  token: Record<string, unknown>,
  authError: string
): Record<string, unknown> {
  delete token.accessToken
  delete token.expiresAt
  delete token.genderScope
  delete token.refreshToken
  delete token.roles
  delete token.tenantId
  delete token.tenantSlug
  token.authError = authError
  return token
}
