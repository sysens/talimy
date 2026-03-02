import { Search as SearchIcon } from "lucide-react"

import { Input } from "../ui/input"

type AppShellSearchProps = {
  placeholder: string
}

export function AppShellSearch({ placeholder }: AppShellSearchProps) {
  return (
    <div className="relative hidden w-full max-w-[20rem] md:block">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--app-shell-search-placeholder)] transition-colors duration-300" />
      <Input
        id="app-shell-search"
        type="search"
        placeholder={placeholder}
        className="h-10 rounded-2xl border-0 bg-[var(--app-shell-search-bg)] pl-9 pr-4 text-[var(--app-shell-control-fg)] shadow-none transition-colors duration-300 placeholder:text-[var(--app-shell-search-placeholder)]"
      />
    </div>
  )
}
