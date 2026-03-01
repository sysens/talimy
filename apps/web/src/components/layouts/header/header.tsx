"use client"

import { BreadcrumbNav } from "@/components/layouts/breadcrumb-nav"
import { HeaderLanguageSwitcher } from "@/components/layouts/header/header-language-switcher"
import { HeaderActions } from "@/components/layouts/header/header-notifications"
import { HeaderSearch } from "@/components/layouts/header/header-search"
import { HeaderUserMenu } from "@/components/layouts/header/header-user-menu"
import { SidebarMobileToggle } from "@/components/layouts/sidebar/sidebar-mobile"

type HeaderProps = {
  roleLabel: string
  userName?: string | null
}

export function Header({ roleLabel, userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f5f6f8]/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(15,23,42,0.05)] md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarMobileToggle />
          <BreadcrumbNav />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <HeaderSearch />
          <HeaderLanguageSwitcher />
          <HeaderActions />
          <HeaderUserMenu name={userName} roleLabel={roleLabel} />
        </div>
      </div>
    </header>
  )
}
