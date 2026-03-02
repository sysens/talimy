import type { AppShellLinkProps } from "./types"

export function AppShellAnchorLink({ href, className, children }: AppShellLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
