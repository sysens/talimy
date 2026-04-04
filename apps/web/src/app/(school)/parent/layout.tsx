import type { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { auth } from "@/lib/nextauth"
import { resolveDashboardDestination } from "@/lib/server/dashboard-destination"

type LayoutProps = {
  children: ReactNode
}

export const dynamic = "force-dynamic"

export default async function Layout({ children }: LayoutProps) {
  const session = await auth()
  const roles = session?.user?.roles ?? []
  const requestHeaders = await headers()
  const tenantSlug = typeof session?.user?.tenantSlug === "string" ? session.user.tenantSlug : null

  if (!session?.user) {
    redirect(AUTH_ROUTE_PATHS.login)
  }

  if (!roles.includes("parent")) {
    redirect(resolveDashboardDestination(roles, tenantSlug, requestHeaders))
  }

  return <>{children}</>
}
