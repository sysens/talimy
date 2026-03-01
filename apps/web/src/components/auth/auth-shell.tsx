"use client"

import type { ReactNode } from "react"

import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel"

type AuthShellProps = {
  children: ReactNode
  workspaceKind: "platform" | "school"
}

export function AuthShell({ children, workspaceKind }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f8fa_0%,#f3f3f6_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_48%]">
        <section className="flex items-center justify-center bg-white px-6 py-12 md:px-10 xl:px-16">
          <div className="w-full max-w-[29rem]">{children}</div>
        </section>

        <section className="hidden border-l border-slate-200/70 bg-[#f7f4f8] p-5 lg:block">
          <AuthMarketingPanel workspaceKind={workspaceKind} />
        </section>
      </div>
    </main>
  )
}
