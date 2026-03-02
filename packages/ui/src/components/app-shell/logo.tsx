import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

import { AppShellAnchorLink } from "./link"
import type { AppShellSidebarData } from "./types"
import type { AppShellLinkComponent } from "./types"

type AppShellLogoProps = {
  logo: AppShellSidebarData["logo"] & { href?: string }
  linkComponent?: AppShellLinkComponent
}

export function AppShellLogo({ logo, linkComponent: LinkComponent = AppShellAnchorLink }: AppShellLogoProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg">
          <LinkComponent href={logo.href ?? "/"}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-[var(--app-shell-control-fg)] transition-colors duration-300">
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.alt ?? logo.title}
                  className="size-6 text-primary-foreground invert dark:invert-0"
                />
              ) : (
                <span className="text-sm font-semibold text-primary-foreground">{logo.title.slice(0, 1)}</span>
              )}
            </div>
            <div data-slot="app-shell-logo-copy" className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium text-[var(--app-shell-sidebar-fg)] transition-colors duration-300">{logo.title}</span>
              <span className="text-xs text-[var(--app-shell-sidebar-muted)] transition-colors duration-300">{logo.description}</span>
            </div>
          </LinkComponent>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
