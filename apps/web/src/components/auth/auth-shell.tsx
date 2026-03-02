"use client"

import type { ReactNode } from "react"

import { AuthSidePanel } from "@/components/auth/auth-side-panel"
import { AppLocaleSwitcher } from "@/components/shared/app-locale-switcher"

type AuthShellProps = {
  children: ReactNode
  workspaceKind: "platform" | "school"
}

export function AuthShell({ children, workspaceKind }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_48%]">
        <section className="relative flex items-center justify-center bg-white px-6 py-10 md:px-10 xl:px-16">
          <div className="absolute inset-x-6 top-6 flex justify-end md:inset-x-10 xl:inset-x-16">
            <AppLocaleSwitcher />
          </div>
          <div className="w-full max-w-[29rem] pt-12 lg:pt-0">{children}</div>
        </section>

        <section className="hidden border-l border-slate-200/70 bg-[#f5f5f7] p-5 lg:block">
          <AuthSidePanel workspaceKind={workspaceKind} />
        </section>
      </div>
    </main>
  )
}
