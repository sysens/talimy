import type { ReactNode } from "react"

import { AuthBrand } from "@/components/auth/auth-brand"

type AuthPanelHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  footer?: ReactNode
}

export function AuthPanelHeader({
  eyebrow = "Talimy Access",
  title,
  description,
  footer,
}: AuthPanelHeaderProps) {
  return (
    <div className="mb-8 space-y-5">
      <AuthBrand compact />
      <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--talimy-color-navy)]/58 uppercase">
        {eyebrow}
      </p>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--talimy-color-navy)] sm:text-[2rem]">
          {title}
        </h1>
        <p className="max-w-md text-sm leading-7 text-slate-600">{description}</p>
      </div>
      {footer}
    </div>
  )
}
