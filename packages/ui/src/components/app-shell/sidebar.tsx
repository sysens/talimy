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
      className="text-[var(--app-shell-sidebar-fg)] transition-colors [&_[data-sidebar=sidebar-inner]]:bg-[var(--app-shell-sidebar-bg)] [&_[data-sidebar=sidebar-inner]]:text-[var(--app-shell-sidebar-fg)] [&_[data-sidebar=content]]:overflow-x-hidden [&_[data-sidebar=group-label]]:text-[var(--app-shell-sidebar-muted)] [&_[data-slot=sidebar-group-label]]:duration-300 [&_[data-slot=sidebar-group-label]]:ease-out [&_[data-slot=sidebar-menu-button]]:transition-colors [&_[data-slot=sidebar-menu-sub-button]]:transition-colors [&_[data-slot=sidebar-menu-button]]:[&>span]:whitespace-nowrap [&_[data-slot=sidebar-menu-sub-button]]:[&>span]:whitespace-nowrap [&_[data-slot=app-shell-logo-copy]]:transition-[width] [&_[data-slot=app-shell-logo-copy]]:duration-300 [&_[data-slot=app-shell-logo-copy]]:ease-out [&_[data-slot=app-shell-user-copy]]:transition-[width] [&_[data-slot=app-shell-user-copy]]:duration-300 [&_[data-slot=app-shell-user-copy]]:ease-out [&_[data-slot=app-shell-nav-copy]]:transition-[width] [&_[data-slot=app-shell-nav-copy]]:duration-300 [&_[data-slot=app-shell-nav-copy]]:ease-out [&_[data-slot=app-shell-nav-sub-copy]]:transition-[width] [&_[data-slot=app-shell-nav-sub-copy]]:duration-300 [&_[data-slot=app-shell-nav-sub-copy]]:ease-out group-data-[collapsible=icon]:[&_[data-slot=sidebar-menu-button]]:gap-0 group-data-[collapsible=icon]:[&_[data-slot=app-shell-logo-copy]]:w-0 group-data-[collapsible=icon]:[&_[data-slot=app-shell-logo-copy]]:overflow-hidden group-data-[collapsible=icon]:[&_[data-slot=app-shell-user-copy]]:w-0 group-data-[collapsible=icon]:[&_[data-slot=app-shell-user-copy]]:overflow-hidden group-data-[collapsible=icon]:[&_[data-slot=app-shell-nav-copy]]:w-0 group-data-[collapsible=icon]:[&_[data-slot=app-shell-nav-copy]]:overflow-hidden group-data-[collapsible=icon]:[&_[data-slot=app-shell-nav-sub-copy]]:w-0 group-data-[collapsible=icon]:[&_[data-slot=app-shell-nav-sub-copy]]:overflow-hidden"
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
        {userMenuSlot ??
          (data.user ? <AppShellUserMenu user={data.user} labels={data.userMenuLabels} /> : null)}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
