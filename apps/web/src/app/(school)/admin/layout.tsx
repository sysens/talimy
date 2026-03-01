import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { adminNavItems } from "@/config/navigation/admin-nav"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { auth } from "@/lib/nextauth"
import { AppShell } from "@/components/layouts/app-shell"

type LayoutProps = {
  children: ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth()
  const roles = session?.user?.roles ?? []

  if (!session?.user) {
    redirect(AUTH_ROUTE_PATHS.login)
  }

  if (!roles.includes("school_admin")) {
    redirect(resolveRoleDashboard(roles))
  }

  return (
    <AppShell
      homeHref="/admin/dashboard"
      navigation={adminNavItems}
      promo={{
        title: "New Tools Available",
        description: "Smarter updates for easier school management.",
        actionLabel: "See updates",
      }}
      roleLabel="Admin"
      userEmail={session.user.email}
      userName={session.user.name ?? session.user.email}
    >
      {children}
    </AppShell>
  )
}

function resolveRoleDashboard(roles: string[]): string {
  if (roles.includes("teacher")) {
    return "/teacher/dashboard"
  }

  if (roles.includes("student")) {
    return "/student/dashboard"
  }

  if (roles.includes("parent")) {
    return "/parent/dashboard"
  }

  return AUTH_ROUTE_PATHS.login
}
