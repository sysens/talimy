import { buildPlatformWebOrigin, buildTenantWebOrigin, resolveRequestOrigin } from "@/config/site"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { resolveHostScopeFromHeaders } from "@/lib/server/request-host"

const ROLE_DASHBOARD_PATHS = {
  platform_admin: "/dashboard",
  school_admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent: "/parent/dashboard",
} as const

type DashboardRole = keyof typeof ROLE_DASHBOARD_PATHS

export function resolveRoleDashboardPath(roles: readonly string[]): string | null {
  for (const role of Object.keys(ROLE_DASHBOARD_PATHS) as DashboardRole[]) {
    if (roles.includes(role)) {
      return ROLE_DASHBOARD_PATHS[role]
    }
  }

  return null
}

export function resolveDashboardDestination(
  roles: readonly string[],
  tenantSlug: string | null,
  requestHeaders: Headers
): string {
  const targetPath = resolveRoleDashboardPath(roles)
  if (!targetPath) {
    return AUTH_ROUTE_PATHS.login
  }

  const currentOrigin = resolveRequestOrigin(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
    requestHeaders.get("x-forwarded-proto")
  )

  if (roles.includes("platform_admin")) {
    const targetOrigin = buildPlatformWebOrigin(currentOrigin)
    return buildAbsoluteOrRelativeDestination(currentOrigin, targetOrigin, targetPath)
  }

  if (!tenantSlug) {
    return targetPath
  }

  const targetOrigin = buildTenantWebOrigin(tenantSlug, currentOrigin)
  const currentScope = resolveHostScopeFromHeaders(requestHeaders)

  if (currentScope.kind === "school" && currentScope.tenantSlug !== tenantSlug) {
    return `${targetOrigin}${targetPath}`
  }

  return buildAbsoluteOrRelativeDestination(currentOrigin, targetOrigin, targetPath)
}

function buildAbsoluteOrRelativeDestination(
  currentOrigin: string,
  targetOrigin: string,
  pathname: string
): string {
  if (currentOrigin === targetOrigin) {
    return pathname
  }

  return `${targetOrigin}${pathname}`
}
