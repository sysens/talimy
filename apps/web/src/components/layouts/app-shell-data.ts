import type { Session } from "next-auth"
import { getTranslations } from "next-intl/server"
import type { AppShellSidebarData } from "@talimy/ui"

import type { NavigationItem } from "@/config/navigation/types"

type BuildAppShellDataOptions = {
  navItems: NavigationItem[]
  homeHref: string
  accountHref: string
  breadcrumbRootLabelKey?: string
}

export async function buildAppShellData(
  session: Session,
  { navItems, homeHref, accountHref, breadcrumbRootLabelKey }: BuildAppShellDataOptions
): Promise<AppShellSidebarData> {
  const [navT, shellT] = await Promise.all([getTranslations("nav.admin"), getTranslations("shell")])

  const schoolName = resolveWorkspaceName(session.user.tenantSlug, session.user.roles)
  const email = session.user.email ?? "school-admin@talimy.space"

  return {
    logo: {
      title: "Talimy",
      description: shellT("workspace", { schoolName }),
    },
    homeHref,
    accountHref,
    breadcrumbRootLabel: breadcrumbRootLabelKey ? shellT(breadcrumbRootLabelKey) : undefined,
    navGroups: [
      {
        title: shellT("mainMenu"),
        defaultOpen: true,
        items: mapNavigationItems(
          navItems.filter((item) => item.section === "main"),
          navT
        ),
      },
      {
        title: shellT("updates"),
        defaultOpen: false,
        items: mapNavigationItems(
          navItems.filter((item) => item.section === "updates"),
          navT
        ),
      },
    ].filter((group) => group.items.length > 0),
    user: {
      name: resolveDisplayName(session),
      email,
    },
    userMenuLabels: {
      account: shellT("account"),
      logout: shellT("logout"),
    },
    headerLabels: {
      searchPlaceholder: shellT("searchPlaceholder"),
      settings: shellT("settings"),
      notifications: shellT("notifications"),
      theme: shellT("theme"),
    },
  }
}

type TranslateFn = Awaited<ReturnType<typeof getTranslations>>

function mapNavigationItems(items: NavigationItem[], t: TranslateFn) {
  return items.map((item) => ({
    label: resolveNavigationLabel(item, t),
    icon: item.icon,
    href: item.href,
    matchPrefixes: item.matchPrefixes,
    children: item.children?.map((child) => ({
      label: resolveNavigationLabel(child, t),
      icon: child.icon,
      href: child.href,
      matchPrefixes: child.matchPrefixes,
    })),
  }))
}

function resolveNavigationLabel(item: NavigationItem, t: TranslateFn): string {
  if (item.labelKey) {
    return t(item.labelKey)
  }

  return item.label ?? item.id
}

function resolveDisplayName(session: Session): string {
  const sessionName = typeof session.user.name === "string" ? session.user.name.trim() : ""
  if (sessionName.length > 0) {
    return sessionName
  }

  const email = session.user.email ?? ""
  if (!email.includes("@")) {
    return "School Admin"
  }

  const localPart = email.split("@")[0] ?? "school-admin"
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function resolveWorkspaceName(tenantSlug?: string | null, roles?: string[]): string {
  if (!tenantSlug) {
    return roles?.includes("platform_admin") ? "Platform" : "Workspace"
  }

  return tenantSlug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}
