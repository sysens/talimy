import type { ReactNode } from "react"
import { Bell, SlidersHorizontal } from "lucide-react"

import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"
import { AppShellAnchorLink } from "./link"
import type { AppShellSidebarData } from "./types"
import type { AppShellLinkComponent } from "./types"
import { resolveHeaderTrail } from "./navigation"
import { AppShellSearch } from "./search"
import { useCurrentPathname } from "./use-current-pathname"

type AppShellHeaderProps = {
  data: AppShellSidebarData
  actions?: ReactNode
  linkComponent?: AppShellLinkComponent
}

export function AppShellHeader({
  data,
  actions,
  linkComponent: LinkComponent = AppShellAnchorLink,
}: AppShellHeaderProps) {
  const pathname = useCurrentPathname()
  const trail = resolveHeaderTrail(data, pathname)
  const headerLabels = data.headerLabels ?? {
    searchPlaceholder: "Search anything",
    settings: "Settings",
    notifications: "Notifications",
  }

  return (
    <header className="my-5 flex shrink-0 items-center gap-3 bg-[var(--app-shell-surface)] px-4 text-[var(--app-shell-control-fg)] transitio
        n-colors duration-300">
      <SidebarTrigger className="-ml-1" />
      <LinkComponent href={data.homeHref ?? "/"} className="flex items-center gap-2 md:hidden">
        <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-[var(--app-shell-control-fg)]">
          {data.logo.src ? (
            <img
              src={data.logo.src}
              alt={data.logo.alt ?? data.logo.title}
              className="size-6 text-primary-foreground invert dark:invert-0"
            />
          ) : (
            <span className="text-sm font-semibold text-primary-foreground">{data.logo.title.slice(0, 1)}</span>
          )}
        </div>
        <span className="font-semibold text-[var(--app-shell-control-fg)]">{data.logo.title}</span>
      </LinkComponent>
      <p className="hidden text-xl font-semibold tracking-tight text-[var(--app-shell-control-fg)] md:block">
        {trail.pageLabel}
      </p>
      <div className="ml-auto flex items-center gap-2">
        <AppShellSearch placeholder={headerLabels.searchPlaceholder} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={headerLabels.settings}
          className="size-10 rounded-2xl bg-[var(--app-shell-control-bg)] text-[var(--app-shell-control-fg)] shadow-none transition-colors duration-300 hover:bg-[var(--app-shell-control-bg-hover)] hover:text-[var(--app-shell-control-fg)]"
        >
          <SlidersHorizontal className="size-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={headerLabels.notifications}
          className="relative size-10 rounded-2xl bg-[var(--app-shell-control-bg)] text-[var(--app-shell-control-fg)] shadow-none transition-colors duration-300 hover:bg-[var(--app-shell-control-bg-hover)] hover:text-[var(--app-shell-control-fg)]"
        >
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[color:var(--talimy-color-pink)]" />
        </Button>
        {actions}
      </div>
    </header>
  )
}
