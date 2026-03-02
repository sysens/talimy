import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { buildAppShellData } from "@/components/layouts/app-shell-data"
import { AppShellRoot } from "@/components/layouts/app-shell-root"
import { AppShellSessionUserMenu } from "@/components/layouts/app-shell-user-menu"
import { AppLocaleSwitcher } from "@/components/shared/app-locale-switcher"
import { AppThemeToggle } from "@/components/shared/app-theme-toggle"
import { adminNavItems } from "@/config/navigation/admin-nav"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { auth } from "@/lib/nextauth"

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

  const shellData = await buildAppShellData(session, {
    navItems: adminNavItems,
    homeHref: "/admin/dashboard",
    accountHref: "/admin/profile",
    breadcrumbRootLabelKey: "breadcrumbSchoolAdmin",
  })

  return (
    <AppShellRoot
      data={shellData}
      headerActions={
        <>
          <AppThemeToggle
            ariaLabel={shellData.headerLabels?.theme ?? "Theme"}
            className="size-10 rounded-2xl bg-[var(--app-shell-control-bg)] text-[var(--app-shell-control-fg)] shadow-none transition-colors duration-300 hover:bg-[var(--app-shell-control-bg-hover)] hover:text-[var(--app-shell-control-fg)]"
          />
          <AppLocaleSwitcher className="hidden md:inline-flex" />
        </>
      }
      sidebarFooter={
        shellData.user ? (
          <AppShellSessionUserMenu
            user={shellData.user}
            accountHref={shellData.accountHref ?? shellData.homeHref ?? "/"}
            labels={shellData.userMenuLabels ?? defaultUserMenuLabels}
          />
        ) : null
      }
    >
      {children}
    </AppShellRoot>
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

const defaultUserMenuLabels = {
  account: "Account",
  logout: "Log out",
}
