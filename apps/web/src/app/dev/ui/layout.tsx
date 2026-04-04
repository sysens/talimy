import type { ReactNode } from "react"

import { QueryProvider } from "@/providers/query-provider"

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <QueryProvider>{children}</QueryProvider>
}
