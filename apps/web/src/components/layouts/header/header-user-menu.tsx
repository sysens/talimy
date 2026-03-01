"use client"

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@talimy/ui"
import { ChevronDown, LogOut, User } from "lucide-react"
import { signOut } from "next-auth/react"

type HeaderUserMenuProps = {
  name?: string | null
  roleLabel: string
}

export function HeaderUserMenu({ name, roleLabel }: HeaderUserMenuProps) {
  const initials = resolveInitials(name ?? roleLabel)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-3 rounded-full px-2 py-1.5 hover:bg-slate-100"
        >
          <Avatar className="size-10 border border-[color:var(--talimy-color-pink)]/70 bg-[color:var(--talimy-color-pink)]/25">
            <AvatarFallback className="bg-[color:var(--talimy-color-pink)]/25 text-sm font-semibold text-[color:var(--talimy-color-navy)]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-[color:var(--talimy-color-navy)]">
              {name ?? "Workspace user"}
            </p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-sm font-semibold text-[color:var(--talimy-color-navy)]">{name ?? "Workspace user"}</p>
          <p className="text-xs font-normal text-slate-500">{roleLabel}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600" onClick={() => void signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
