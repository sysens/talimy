"use client"

import { SidebarProvider } from "@talimy/ui"
import type { ReactNode } from "react"

import type { NavigationItem } from "@/config/navigation/types"
import { Header } from "@/components/layouts/header/header"
import { AppSidebar } from "@/components/layouts/sidebar/sidebar"
import { useSidebarStore } from "@/stores/sidebar-store"

type SidebarPromo = {
  actionLabel: string
  description: string
  title: string
}

type AppShellProps = {
  children: ReactNode
  homeHref: string
  navigation: NavigationItem[]
  promo?: SidebarPromo
  roleLabel: string
  userEmail?: string | null
  userName?: string | null
}

export function AppShell({
  children,
  homeHref,
  navigation,
  promo,
  roleLabel,
  userEmail,
  userName,
}: AppShellProps) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const setCollapsed = useSidebarStore((state) => state.setCollapsed)

  return (
    <SidebarProvider open={!isCollapsed} onOpenChange={(open) => setCollapsed(!open)}>
      <div className="min-h-screen bg-[#f5f6f8] md:flex">
        <AppSidebar
          homeHref={homeHref}
          items={navigation}
          promo={promo}
          roleLabel={roleLabel}
          userEmail={userEmail}
          userName={userName}
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header roleLabel={roleLabel} userName={userName} />
          <main className="flex-1 px-4 pb-6 pt-2 md:px-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
