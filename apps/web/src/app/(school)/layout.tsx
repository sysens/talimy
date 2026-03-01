import type { ReactNode } from "react"

import { AppClientProviders } from "@/providers/app-client-providers"

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <AppClientProviders>{children}</AppClientProviders>
}
