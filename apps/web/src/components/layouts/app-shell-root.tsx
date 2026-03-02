"use client"

import type { ReactNode } from "react"
import Link from "next/link"

import { AppShell, type AppShellSidebarData } from "@talimy/ui"

type AppShellRootProps = {
  children?: ReactNode
  className?: string
  data: AppShellSidebarData
  headerActions?: ReactNode
  sidebarFooter?: ReactNode
}

export function AppShellRoot({
  children,
  className,
  data,
  headerActions,
  sidebarFooter,
}: AppShellRootProps) {
  return (
    <AppShell
      className={className}
      data={data}
      headerActions={headerActions}
      sidebarFooter={sidebarFooter}
      linkComponent={Link}
    >
      {children}
    </AppShell>
  )
}
