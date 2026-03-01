"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@talimy/ui"

import type { NavigationItem } from "@/config/navigation/types"
import { SidebarLogo } from "@/components/layouts/sidebar/sidebar-logo"
import { SidebarNav } from "@/components/layouts/sidebar/sidebar-nav"
import { SidebarUser } from "@/components/layouts/sidebar/sidebar-user"

type SidebarPromo = {
  actionLabel: string
  description: string
  title: string
}

type AppSidebarProps = {
  homeHref: string
  items: NavigationItem[]
  promo?: SidebarPromo
  roleLabel: string
  userEmail?: string | null
  userName?: string | null
}

export function AppSidebar({
  homeHref,
  items,
  promo,
  roleLabel,
  userEmail,
  userName,
}: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="border-none [&_[data-sidebar=sidebar-inner]]:rounded-[2rem] [&_[data-sidebar=sidebar-inner]]:border [&_[data-sidebar=sidebar-inner]]:border-slate-200/70 [&_[data-sidebar=sidebar-inner]]:bg-[#f7f2f8] [&_[data-sidebar=sidebar-inner]]:shadow-[0_22px_48px_rgba(15,23,42,0.08)]"
    >
      <SidebarHeader className="gap-4 px-3 pt-4">
        <SidebarLogo href={homeHref} />
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarNav items={items} />
        {promo ? (
          <div className="mx-3 mt-auto rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(205,234,240,0.82),rgba(205,234,240,0.6))] p-4 text-[color:var(--talimy-color-navy)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold">{promo.title}</p>
            <p className="mt-2 text-xs leading-6 text-slate-600">{promo.description}</p>
            <div className="mt-3 rounded-2xl bg-white/82 px-3 py-2 text-center text-xs font-semibold text-[color:var(--talimy-color-navy)]">
              {promo.actionLabel}
            </div>
          </div>
        ) : null}
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4 pt-3">
        <SidebarUser email={userEmail} name={userName} roleLabel={roleLabel} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
