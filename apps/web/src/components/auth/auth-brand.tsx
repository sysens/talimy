"use client"

import { cn } from "@talimy/ui"
import { useTranslations } from "next-intl"

type AuthBrandProps = {
  className?: string
  compact?: boolean
}

export function AuthBrand({ className, compact = false }: AuthBrandProps) {
  const t = useTranslations("authPage")

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--talimy-color-pink)] text-[color:var(--talimy-color-navy)] shadow-[0_16px_36px_rgba(21,68,110,0.15)]">
        <svg
          aria-hidden="true"
          className="size-6"
          fill="none"
          viewBox="0 0 34 34"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 7.5V26.5M7.5 17H26.5M10.25 10.25L23.75 23.75M23.75 10.25L10.25 23.75"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
        </svg>
      </div>
      <div className="space-y-0.5">
        <p
          className={cn(
            "font-semibold tracking-tight text-[color:var(--talimy-color-navy)]",
            compact ? "text-lg" : "text-xl"
          )}
        >
          Talimy
        </p>
        <p className="text-sm text-slate-500">{t("brandSubtitle")}</p>
      </div>
    </div>
  )
}
