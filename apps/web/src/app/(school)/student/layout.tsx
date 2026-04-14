import type { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { buildAppShellData } from "@/components/layouts/app-shell-data"
import { AppShellRoot } from "@/components/layouts/app-shell-root"
import { AppShellSessionUserMenu } from "@/components/layouts/app-shell-user-menu"
import { AppLocaleSwitcher } from "@/components/shared/app-locale-switcher"
import { AppThemeToggle } from "@/components/shared/app-theme-toggle"
import { studentNavItems } from "@/config/navigation/student-nav"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { resolveDashboardDestination } from "@/lib/server/dashboard-destination"
import { getOptionalSession } from "@/lib/server/get-optional-session"

type LayoutProps = {
  children: ReactNode
}

export const dynamic = "force-dynamic"

export default async function Layout({ children }: LayoutProps) {
  const session = await getOptionalSession()
  const roles = session?.user?.roles ?? []
  const requestHeaders = await headers()
  const tenantSlug = typeof session?.user?.tenantSlug === "string" ? session.user.tenantSlug : null

  if (!session?.user) {
    redirect(AUTH_ROUTE_PATHS.login)
  }

  if (!roles.includes("student")) {
    redirect(resolveDashboardDestination(roles, tenantSlug, requestHeaders))
  }

  const shellData = await buildAppShellData(session, {
    navItems: studentNavItems,
    homeHref: "/student/dashboard",
    accountHref: "/student/profile",
    breadcrumbRootLabelKey: "breadcrumbSchoolStudent",
    navTranslationsNamespace: "nav.student",
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

const defaultUserMenuLabels = {
  account: "Account",
  logout: "Log out",
}
