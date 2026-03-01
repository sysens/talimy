"use client"

import { Button, SidebarTrigger } from "@talimy/ui"
import { PanelLeft } from "lucide-react"

export function SidebarMobileToggle() {
  return (
    <SidebarTrigger asChild>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="rounded-full border-slate-200 bg-white text-[color:var(--talimy-color-navy)] shadow-none md:hidden"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
    </SidebarTrigger>
  )
}
