import type { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  buildPlatformWebOrigin,
  buildTenantWebOrigin,
  resolveRequestOrigin,
} from "@/config/site"
import { AuthShell } from "@/components/auth/auth-shell"
import { auth } from "@/lib/nextauth"
import { resolveHostScopeFromHeaders } from "@/lib/server/request-host"
import { ToastProvider } from "@/providers/toast-provider"

type LayoutProps = {
  children: ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth()
  const requestHeaders = await headers()
  const currentScope = resolveHostScopeFromHeaders(requestHeaders)
  const destination = resolveDashboardDestination(
    session?.user?.roles ?? [],
    typeof session?.user?.tenantSlug === "string" ? session.user.tenantSlug : null,
    requestHeaders
  )

  if (destination) {
    redirect(destination)
  }

  const workspaceKind = currentScope.kind === "platform" ? "platform" : "school"

  return (
    <>
      <AuthShell workspaceKind={workspaceKind}>{children}</AuthShell>
      <ToastProvider />
    </>
  )
}

function resolveDashboardDestination(
  roles: string[],
  tenantSlug: string | null,
  requestHeaders: Headers
): string | null {
  if (roles.length === 0) {
    return null
  }

  const currentOrigin = resolveRequestOrigin(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
    requestHeaders.get("x-forwarded-proto")
  )
  const currentScope = resolveHostScopeFromHeaders(requestHeaders)

  if (roles.includes("platform_admin")) {
    const targetOrigin = buildPlatformWebOrigin(currentOrigin)
    return buildAbsoluteOrRelativeDestination(currentOrigin, targetOrigin, "/dashboard")
  }

  const targetPath = resolveSchoolDashboardPath(roles)
  if (!targetPath) {
    return null
  }

  if (!tenantSlug) {
    return targetPath
  }

  const targetOrigin = buildTenantWebOrigin(tenantSlug, currentOrigin)
  if (currentScope.kind === "school" && currentScope.tenantSlug !== tenantSlug) {
    return `${targetOrigin}${targetPath}`
  }

  return buildAbsoluteOrRelativeDestination(currentOrigin, targetOrigin, targetPath)
}

function resolveSchoolDashboardPath(roles: string[]): string | null {
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

  return null
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
