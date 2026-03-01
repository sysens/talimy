"use client"

import { Input } from "@talimy/ui"
import { Search } from "lucide-react"

type HeaderSearchProps = {
  placeholder?: string
}

export function HeaderSearch({ placeholder = "Search anything" }: HeaderSearchProps) {
  return (
    <div className="relative hidden min-w-[15rem] max-w-sm flex-1 md:block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        readOnly
        aria-label={placeholder}
        className="h-11 rounded-full border-slate-200 bg-slate-50 pl-11 text-sm shadow-none"
        placeholder={placeholder}
      />
    </div>
  )
}
