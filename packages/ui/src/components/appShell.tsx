"use client"

import type { CSSProperties, ReactNode } from "react"

import { cn } from "../lib/utils"
import { SidebarInset, SidebarProvider } from "./ui/sidebar"

import { APP_SHELL_SIDEBAR_DATA } from "./app-shell/data"
import { AppShellHeader } from "./app-shell/header"
import { AppShellSidebar } from "./app-shell/sidebar"
import type { AppShellLinkComponent } from "./app-shell/types"
import type { AppShellSidebarData } from "./app-shell/types"

export type AppShellProps = {
  children?: ReactNode
  className?: string
  data?: AppShellSidebarData
  headerActions?: ReactNode
  sidebarFooter?: ReactNode
  linkComponent?: AppShellLinkComponent
}

const APP_SHELL_SIDEBAR_STYLE = {
  "--sidebar-width": "12rem",
  "--sidebar-width-icon": "3.5rem",
} as CSSProperties

export function AppShell({
  children,
  className,
  data = APP_SHELL_SIDEBAR_DATA,
  headerActions,
  sidebarFooter,
  linkComponent,
}: AppShellProps) {
  return (
    <SidebarProvider
      dir="ltr"
      className={cn(
        "bg-[var(--app-shell-sidebar-bg)] transition-colors duration-300 [&_[data-slot=sidebar-gap]]:bg-[var(--app-shell-sidebar-bg)] [&_[data-slot=sidebar-gap]]:transition-[width,background-color] [&_[data-slot=sidebar-gap]]:duration-400 [&_[data-slot=sidebar-gap]]:ease-[cubic-bezier(0.7,-0.15,0.25,1.15)] [&_[data-slot=sidebar-container]]:transition-[left,right,width] [&_[data-slot=sidebar-container]]:duration-400 [&_[data-slot=sidebar-container]]:ease-[cubic-bezier(0.75,0,0.25,1)] [&_[data-slot=sidebar-menu-button]]:transition-[width,height,padding,gap,background-color,color] [&_[data-slot=sidebar-menu-button]]:duration-300 [&_[data-slot=sidebar-menu-button]]:ease-out [&_[data-slot=sidebar-menu-sub-button]]:transition-[padding,background-color,color] [&_[data-slot=sidebar-menu-sub-button]]:duration-300 [&_[data-slot=sidebar-menu-sub-button]]:ease-out",
        className
      )}
      style={APP_SHELL_SIDEBAR_STYLE}
    >
      <AppShellSidebar data={data} userMenuSlot={sidebarFooter} linkComponent={linkComponent} />
      <SidebarInset className="min-w-0 bg-[var(--app-shell-surface)] transition-colors duration-300">
        <AppShellHeader data={data} actions={headerActions} linkComponent={linkComponent} />
        <div className="flex min-w-0 flex-1 flex-col gap-4 bg-[var(--app-shell-surface)] px-4 pb-4 text-foreground transition-colors duration-300">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
