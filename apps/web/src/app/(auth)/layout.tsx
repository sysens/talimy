import type { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AuthShell } from "@/components/auth/auth-shell"
import { auth } from "@/lib/nextauth"
import { resolveDashboardDestination } from "@/lib/server/dashboard-destination"
import { resolveHostScopeFromHeaders } from "@/lib/server/request-host"
import { ToastProvider } from "@/providers/toast-provider"

type LayoutProps = {
  children: ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth()
  const requestHeaders = await headers()
  const currentScope = resolveHostScopeFromHeaders(requestHeaders)
  const roles = session?.user?.roles ?? []
  const tenantSlug = typeof session?.user?.tenantSlug === "string" ? session.user.tenantSlug : null

  if (roles.length > 0) {
    redirect(resolveDashboardDestination(roles, tenantSlug, requestHeaders))
  }

  const workspaceKind = currentScope.kind === "platform" ? "platform" : "school"

  return (
    <>
      <AuthShell workspaceKind={workspaceKind}>{children}</AuthShell>
      <ToastProvider />
    </>
  )
}
