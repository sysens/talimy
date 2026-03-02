import type { ComponentType, ReactNode } from "react"

export type AppShellLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

export type AppShellLinkComponent = ComponentType<AppShellLinkProps>

export type AppShellNavItem = {
  label: string
  icon: string
  href: string
  matchPrefixes?: string[]
  children?: AppShellNavItem[]
}

export type AppShellNavGroup = {
  title: string
  items: AppShellNavItem[]
  defaultOpen?: boolean
}

export type AppShellUserData = {
  name: string
  email: string
  avatar?: string
}

export type AppShellUserMenuLabels = {
  account: string
  logout: string
}

export type AppShellHeaderLabels = {
  searchPlaceholder: string
  settings: string
  notifications: string
  theme?: string
}

export type AppShellSidebarData = {
  logo: {
    src?: string
    alt?: string
    title: string
    description: string
  }
  homeHref?: string
  accountHref?: string
  breadcrumbRootLabel?: string
  navGroups: AppShellNavGroup[]
  footerGroup?: AppShellNavGroup
  user?: AppShellUserData
  userMenuLabels?: AppShellUserMenuLabels
  headerLabels?: AppShellHeaderLabels
}
