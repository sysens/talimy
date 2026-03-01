"use client"

import { Button } from "@talimy/ui"
import { Bell, Settings2, SlidersHorizontal } from "lucide-react"

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <HeaderIconButton icon={SlidersHorizontal} label="Filters" />
      <HeaderIconButton icon={Settings2} label="Settings" />
      <HeaderIconButton icon={Bell} label="Notifications" />
    </div>
  )
}

type HeaderIconButtonProps = {
  icon: typeof Bell
  label: string
}

function HeaderIconButton({ icon: Icon, label }: HeaderIconButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={label}
      className="rounded-full border-slate-200 bg-white text-slate-500 shadow-none hover:text-[color:var(--talimy-color-navy)]"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
