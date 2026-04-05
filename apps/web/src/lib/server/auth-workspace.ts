import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { buildPlatformWebOrigin, resolveRequestOrigin } from "@/config/site"
import { resolveHostScopeFromHeaders, type RequestHostScope } from "@/lib/server/request-host"

type AllowedAuthHostScope = "platform" | "public" | "school"

type AuthPageAccessOptions = {
  allowedScopes: AllowedAuthHostScope[]
  fallbackPath?: string
}

export async function enforceAuthPageWorkspaceAccess(
  options: AuthPageAccessOptions
): Promise<RequestHostScope> {
  const requestHeaders = await headers()
  const scope = resolveHostScopeFromHeaders(requestHeaders)

  if (scope.kind === "school" && options.allowedScopes.includes("school")) {
    return scope
  }

  if (scope.kind === "platform" && options.allowedScopes.includes("platform")) {
    return scope
  }

  if (scope.kind === "public" && options.allowedScopes.includes("public")) {
    return scope
  }

  const currentOrigin = resolveRequestOrigin(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
    requestHeaders.get("x-forwarded-proto")
  )
  const destination = buildPlatformRedirectDestination(
    currentOrigin,
    options.fallbackPath ?? AUTH_ROUTE_PATHS.login
  )

  redirect(destination)
}

function buildPlatformRedirectDestination(currentOrigin: string, pathname: string): string {
  const platformOrigin = buildPlatformWebOrigin(currentOrigin)
  if (platformOrigin === currentOrigin) {
    return pathname
  }

  return `${platformOrigin}${pathname}`
}
