"use client"

import { Avatar, AvatarFallback, Button } from "@talimy/ui"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

type SidebarUserProps = {
  email?: string | null
  name?: string | null
  roleLabel: string
}

export function SidebarUser({ email, name, roleLabel }: SidebarUserProps) {
  const initials = resolveInitials(name ?? email ?? "TL")

  return (
    <div className="space-y-3 rounded-3xl bg-white/76 p-4 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <Avatar className="size-11 border border-white bg-[color:var(--talimy-color-pink)]/30">
          <AvatarFallback className="bg-[color:var(--talimy-color-pink)]/30 text-sm font-semibold text-[color:var(--talimy-color-navy)]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[color:var(--talimy-color-navy)]">
            {name ?? "Workspace user"}
          </p>
          <p className="truncate text-xs text-slate-500">{roleLabel}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="h-10 w-full justify-start rounded-2xl px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[color:var(--talimy-color-navy)]"
        onClick={() => void signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}

function resolveInitials(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length === 0) {
    return "TL"
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
}
