import type { ReactNode } from "react"

import { ScrollArea } from "../ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"

import { AppShellLogo } from "./logo"
import { AppShellNavGroupView } from "./nav"
import type { AppShellLinkComponent } from "./types"
import type { AppShellSidebarData } from "./types"
import { AppShellUserMenu } from "./user-menu"

type AppShellSidebarProps = React.ComponentProps<typeof Sidebar> & {
  data: AppShellSidebarData
  userMenuSlot?: ReactNode
  linkComponent?: AppShellLinkComponent
}

export function AppShellSidebar({
  data,
  userMenuSlot,
  linkComponent,
  ...props
}: AppShellSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      className="text-[var(--app-shell-sidebar-fg)] transition-colors [&_[data-sidebar=sidebar-inner]]:bg-[var(--app-shell-sidebar-bg)] [&_[data-sidebar=sidebar-inner]]:text-[var(--app-shell-sidebar-fg)] [&_[data-sidebar=content]]:overflow-x-hidden [&_[data-sidebar=group-label]]:text-[var(--app-shell-sidebar-muted)] [&_[data-slot=sidebar-group-label]]:transition-none [&_[data-slot=sidebar-menu-button]]:transition-colors [&_[data-slot=sidebar-menu-sub-button]]:transition-colors [&_[data-slot=sidebar-menu-button]]:[&>span]:whitespace-nowrap [&_[data-slot=sidebar-menu-sub-button]]:[&>span]:whitespace-nowrap group-data-[collapsible=icon]:[&_[data-slot=app-shell-logo-copy]]:hidden group-data-[collapsible=icon]:[&_[data-slot=app-shell-user-copy]]:hidden group-data-[collapsible=icon]:[&_[data-slot=sidebar-group-label]]:hidden group-data-[collapsible=icon]:[&_[data-slot=sidebar-menu-button]>span:last-child]:hidden"
      {...props}
    >
      <SidebarHeader>
        <AppShellLogo logo={{ ...data.logo, href: data.homeHref }} linkComponent={linkComponent} />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          {data.navGroups.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <AppShellNavGroupView group={group} linkComponent={linkComponent} />
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          {data.footerGroup ? (
            <SidebarGroup>
              <SidebarGroupLabel>{data.footerGroup.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <AppShellNavGroupView group={data.footerGroup} linkComponent={linkComponent} />
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {userMenuSlot ?? (data.user ? <AppShellUserMenu user={data.user} labels={data.userMenuLabels} /> : null)}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
