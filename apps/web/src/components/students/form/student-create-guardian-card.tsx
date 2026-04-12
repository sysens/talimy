import type { ReactNode } from "react"
import { cn } from "@talimy/ui"

type StudentCreateGuardianCardProps = {
  children: ReactNode
  className?: string
  title: string
}

export function StudentCreateGuardianCard({
  children,
  className,
  title,
}: StudentCreateGuardianCardProps) {
  return (
    <div className={cn("space-y-4 rounded-xl bg-slate-50 p-4", className)}>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  )
}
