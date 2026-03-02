import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"

import { AppShellAnchorLink } from "./link"
import type { AppShellNavGroup, AppShellNavItem } from "./types"
import type { AppShellLinkComponent } from "./types"
import { resolveAppShellIcon } from "./icon-map"
import { isItemActive } from "./navigation"
import { useCurrentPathname } from "./use-current-pathname"

type AppShellNavItemProps = {
  item: AppShellNavItem
  linkComponent?: AppShellLinkComponent
}

export function AppShellNavItemView({
  item,
  linkComponent: LinkComponent = AppShellAnchorLink,
}: AppShellNavItemProps) {
  const pathname = useCurrentPathname()
  const Icon = resolveAppShellIcon(item.icon)
  const hasChildren = Boolean(item.children && item.children.length > 0)
  const active = isItemActive(item, pathname)

  if (!hasChildren) {
    return (
      <SidebarMenuItem className="mb-1 last:mb-0">
        <SidebarMenuButton
          asChild
          isActive={active}
          className="h-auto py-1.5 text-[var(--app-shell-sidebar-fg)] transition-colors duration-300 hover:bg-[var(--app-shell-hover-bg)] hover:text-[var(--app-shell-sidebar-fg)] data-[active=true]:bg-[var(--app-shell-active-bg)] data-[active=true]:text-[var(--app-shell-active-fg)]"
        >
          <LinkComponent href={item.href}>
            <Icon className="size-4" />
            <span>{item.label}</span>
          </LinkComponent>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={active} className="group/collapsible">
      <SidebarMenuItem className="mb-1.5 last:mb-0">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={active}
            className="h-auto py-1.5 text-[var(--app-shell-sidebar-fg)] transition-colors duration-300 hover:bg-[var(--app-shell-hover-bg)] hover:text-[var(--app-shell-sidebar-fg)] data-[active=true]:bg-[var(--app-shell-active-bg)] data-[active=true]:text-[var(--app-shell-active-fg)]"
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-300 ease-out group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden [--radix-accordion-content-height:var(--radix-collapsible-content-height)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.href} className="mb-1 last:mb-0">
                <SidebarMenuSubButton
                  asChild
                  isActive={isItemActive(child, pathname)}
                  className="h-auto py-1.5 text-[var(--app-shell-sidebar-fg)] transition-colors duration-300 hover:bg-[var(--app-shell-hover-bg)] hover:text-[var(--app-shell-sidebar-fg)] data-[active=true]:bg-[var(--app-shell-active-bg)] data-[active=true]:text-[var(--app-shell-active-fg)]"
                >
                  <LinkComponent href={child.href}>{child.label}</LinkComponent>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

type AppShellNavGroupProps = {
  group: AppShellNavGroup
  linkComponent?: AppShellLinkComponent
}

export function AppShellNavGroupView({
  group,
  linkComponent,
}: AppShellNavGroupProps) {
  return (
    <>
      <SidebarMenu>
        {group.items.map((item) => (
          <AppShellNavItemView key={item.href} item={item} linkComponent={linkComponent} />
        ))}
      </SidebarMenu>
    </>
  )
}
