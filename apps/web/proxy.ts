import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

import {
  APP_LOCALE_COOKIE,
  DEFAULT_LOCALE,
  PANEL_PREFIXES,
  resolveLocaleFromAcceptLanguage,
} from "./src/config/site"
import { resolveHostScopeFromHeaders } from "./src/lib/server/request-host"

type HostScope =
  | { kind: "api" }
  | { kind: "platform" }
  | { kind: "public" }
  | { kind: "school"; tenantSlug: string }

type ProxyToken = {
  authError?: unknown
  roles?: unknown
}

const ROLE_PATH_PREFIXES = [
  ...PANEL_PREFIXES.admin,
  ...PANEL_PREFIXES.teacher,
  ...PANEL_PREFIXES.student,
  ...PANEL_PREFIXES.parent,
] as const
const PLATFORM_PATH_PREFIXES = [...PANEL_PREFIXES.platform] as const
const AUTH_PUBLIC_PATHS = new Set(["/login", "/forgot-password", "/reset-password", "/verify-email"])

export async function proxy(request: NextRequest) {
  const scope = resolveHostScope(request)
  const pathname = request.nextUrl.pathname
  const locale = resolveRequestLocale(request)
  const isApiOrAssetPath = shouldBypassLocaleHandling(pathname)

  if (pathname === "/register") {
    return finalizeResponse(request, scope, locale, redirect(request, "/login"))
  }

  if (
    scope.kind === "public" &&
    (isAnyPlatformPath(pathname) || isSchoolPanelPath(pathname))
  ) {
    return finalizeResponse(request, scope, locale, redirect(request, "/login"))
  }

  if (scope.kind === "platform") {
    const canonicalPlatformPath = resolveCanonicalPlatformPath(pathname)
    if (canonicalPlatformPath !== null && canonicalPlatformPath !== pathname) {
      return finalizeResponse(request, scope, locale, rewrite(request, canonicalPlatformPath))
    }

    if (isSchoolPanelPath(pathname)) {
      return finalizeResponse(request, scope, locale, rewrite(request, "/dashboard"))
    }
  }

  const isSchoolDashboardAlias = scope.kind === "school" && pathname === "/dashboard"
  const requiresAuth = !isApiOrAssetPath && (requiresAuthGate(scope, pathname) || isSchoolDashboardAlias)
  const sessionToken = requiresAuth ? await resolveSessionToken(request) : null

  if (isSchoolDashboardAlias) {
    if (!sessionToken) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.searchParams.set("next", "/dashboard")
      return finalizeResponse(request, scope, locale, NextResponse.redirect(loginUrl))
    }

    return finalizeResponse(
      request,
      scope,
      locale,
      redirect(request, resolveSchoolDashboardPath(sessionToken))
    )
  }

  if (requiresAuth && !sessionToken) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
    loginUrl.searchParams.set("next", nextPath)
    return finalizeResponse(request, scope, locale, NextResponse.redirect(loginUrl))
  }

  if (requiresAuth && sessionToken && !hasRequiredRole(scope, pathname, sessionToken)) {
    return finalizeResponse(
      request,
      scope,
      locale,
      new NextResponse("Forbidden", { status: 403 })
    )
  }

  const forwardedHeaders = new Headers(request.headers)
  forwardedHeaders.set("x-locale", locale)
  forwardedHeaders.set("x-host-scope", scope.kind)
  forwardedHeaders.set("x-panel-scope", resolvePanelScope(pathname))

  if (scope.kind === "school") {
    if (pathname === "/") {
      return finalizeResponse(request, scope, locale, redirect(request, "/login"))
    }
    if (isAnyPlatformPath(pathname)) {
      return finalizeResponse(request, scope, locale, redirect(request, "/login"))
    }

    forwardedHeaders.set("x-tenant-slug", scope.tenantSlug)
  }

  const response = NextResponse.next({
    request: {
      headers: forwardedHeaders,
    },
  })

  return finalizeResponse(request, scope, locale, response)
}

function resolveHostScope(request: NextRequest): HostScope {
  return resolveHostScopeFromHeaders(request.headers) as HostScope
}

function isSchoolPanelPath(pathname: string): boolean {
  return ROLE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function isPlatformPanelPath(pathname: string): boolean {
  return PLATFORM_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function isLegacyPlatformPath(pathname: string): boolean {
  return pathname === "/platform" || pathname.startsWith("/platform/")
}

function isAnyPlatformPath(pathname: string): boolean {
  return isPlatformPanelPath(pathname) || isLegacyPlatformPath(pathname)
}

function requiresAuthGate(scope: HostScope, pathname: string): boolean {
  if (AUTH_PUBLIC_PATHS.has(pathname)) {
    return false
  }

  if (scope.kind === "platform") {
    return pathname === "/" || isAnyPlatformPath(pathname)
  }

  if (scope.kind === "school") {
    return isSchoolPanelPath(pathname)
  }

  return false
}

function hasRequiredRole(scope: HostScope, pathname: string, token: ProxyToken): boolean {
  const roles = Array.isArray(token.roles)
    ? token.roles.filter((role): role is string => typeof role === "string")
    : []

  if (scope.kind === "platform" && isAnyPlatformPath(pathname)) {
    return roles.includes("platform_admin")
  }

  if (scope.kind !== "school") {
    return true
  }

  if (pathname.startsWith("/admin")) {
    return roles.includes("school_admin")
  }

  if (pathname.startsWith("/teacher")) {
    return roles.includes("teacher")
  }

  if (pathname.startsWith("/student")) {
    return roles.includes("student")
  }

  if (pathname.startsWith("/parent")) {
    return roles.includes("parent")
  }

  return true
}

function resolvePanelScope(pathname: string): string {
  if (isAnyPlatformPath(pathname)) return "platform"
  if (pathname.startsWith("/admin")) return "admin"
  if (pathname.startsWith("/teacher")) return "teacher"
  if (pathname.startsWith("/student")) return "student"
  if (pathname.startsWith("/parent")) return "parent"
  return "public"
}

function resolveCanonicalPlatformPath(pathname: string): string | null {
  if (pathname === "/") {
    return "/dashboard"
  }

  if (pathname === "/platform") {
    return "/dashboard"
  }

  if (!pathname.startsWith("/platform/")) {
    return null
  }

  const rewrittenPath = pathname.slice("/platform".length)
  if (isPlatformPanelPath(rewrittenPath)) {
    return rewrittenPath
  }

  return "/dashboard"
}

function shouldBypassLocaleHandling(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  )
}

function resolveRequestLocale(request: NextRequest): string {
  const fromQuery = request.nextUrl.searchParams.get("lang")?.trim().toLowerCase()
  if (fromQuery === "uz" || fromQuery === "tr" || fromQuery === "en" || fromQuery === "ar") {
    return fromQuery
  }

  const fromCookie = request.cookies.get(APP_LOCALE_COOKIE)?.value?.trim().toLowerCase()
  if (
    fromCookie === "uz" ||
    fromCookie === "tr" ||
    fromCookie === "en" ||
    fromCookie === "ar"
  ) {
    return fromCookie
  }

  return resolveLocaleFromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LOCALE
}

function finalizeResponse(
  request: NextRequest,
  scope: HostScope,
  locale: string,
  response: NextResponse
): NextResponse {
  if (!shouldBypassLocaleHandling(request.nextUrl.pathname)) {
    response.cookies.set(APP_LOCALE_COOKIE, locale, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  response.headers.set("x-locale", locale)
  response.headers.set("x-host-scope", scope.kind)
  response.headers.set("x-panel-scope", resolvePanelScope(request.nextUrl.pathname))

  return response
}

function redirect(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  return NextResponse.redirect(url)
}

function rewrite(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  return NextResponse.rewrite(url)
}

async function resolveSessionToken(request: NextRequest): Promise<ProxyToken | null> {
  const secret = process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim()
  if (!secret) {
    return null
  }

  try {
    const token = (await getToken({
      req: request,
      secret,
      secureCookie: request.nextUrl.protocol === "https:",
    })) as ProxyToken | null

    if (token?.authError) {
      return null
    }

    return token
  } catch {
    return null
  }
}

function resolveSchoolDashboardPath(token: ProxyToken): string {
  const roles = Array.isArray(token.roles)
    ? token.roles.filter((role): role is string => typeof role === "string")
    : []

  if (roles.includes("school_admin")) {
    return "/admin/dashboard"
  }

  if (roles.includes("teacher")) {
    return "/teacher/dashboard"
  }

  if (roles.includes("student")) {
    return "/student/dashboard"
  }

  if (roles.includes("parent")) {
    return "/parent/dashboard"
  }

  return "/login"
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}

export default proxy
