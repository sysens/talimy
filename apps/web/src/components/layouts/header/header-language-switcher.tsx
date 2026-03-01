"use client"

import { Button } from "@talimy/ui"
import { Languages } from "lucide-react"

export function HeaderLanguageSwitcher() {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Language switcher"
      className="hidden rounded-full border-slate-200 bg-white text-slate-500 shadow-none lg:flex"
    >
      <Languages className="h-4 w-4" />
    </Button>
  )
}
