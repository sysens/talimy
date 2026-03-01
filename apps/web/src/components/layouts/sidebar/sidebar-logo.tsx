import Link from "next/link"

type SidebarLogoProps = {
  compact?: boolean
  href: string
}

export function SidebarLogo({ compact = false, href }: SidebarLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl px-2 py-1.5">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--talimy-color-pink),var(--talimy-color-sky))] text-[color:var(--talimy-color-navy)] shadow-[0_16px_28px_rgba(21,68,110,0.12)]">
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          viewBox="0 0 34 34"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 7.5V26.5M7.5 17H26.5M10.25 10.25L23.75 23.75M23.75 10.25L10.25 23.75"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.2"
          />
        </svg>
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight text-[color:var(--talimy-color-navy)]">
            Talimy
          </p>
          <p className="truncate text-xs text-slate-500">School workspace</p>
        </div>
      ) : null}
    </Link>
  )
}
