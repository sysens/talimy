import type { AppShellNavGroup, AppShellNavItem, AppShellSidebarData } from "./types"

export function findActiveNavItem(
  navGroups: AppShellNavGroup[],
  pathname: string
): AppShellNavItem | null {
  for (const group of navGroups) {
    for (const item of group.items) {
      const activeItem = findMatchingItem(item, pathname)
      if (activeItem) {
        return activeItem
      }
    }
  }

  return null
}

function findMatchingItem(item: AppShellNavItem, pathname: string): AppShellNavItem | null {
  if (isItemActive(item, pathname)) {
    return item
  }

  for (const child of item.children ?? []) {
    const activeChild = findMatchingItem(child, pathname)
    if (activeChild) {
      return activeChild
    }
  }

  return null
}

export function isItemActive(item: AppShellNavItem, pathname: string): boolean {
  if (pathname === item.href) {
    return true
  }

  if (item.matchPrefixes?.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }

  return (item.children ?? []).some((child) => isItemActive(child, pathname))
}

export function resolveHeaderTrail(
  data: AppShellSidebarData,
  pathname: string
): { rootLabel: string; pageLabel: string } {
  const activeItem = findActiveNavItem(data.navGroups, pathname)

  return {
    rootLabel: data.breadcrumbRootLabel ?? data.logo.title,
    pageLabel: activeItem?.label ?? "Dashboard",
  }
}
