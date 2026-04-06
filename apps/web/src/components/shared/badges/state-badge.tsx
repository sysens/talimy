"use client"

import type { LucideIcon } from "lucide-react"
import { AlertTriangle, CheckCircle2, Clock3, Loader2, Plus, XCircle } from "lucide-react"
import { cn } from "@heroui/react"

type StateBadgeTone = "add" | "approved" | "cancelled" | "pending" | "progress" | "review"

type StateBadgeProps = {
  className?: string
  label: string
  tone: StateBadgeTone
}

const STATE_BADGE_STYLES: Record<
  StateBadgeTone,
  {
    icon: LucideIcon
    className: string
  }
> = {
  pending: {
    icon: AlertTriangle,
    className: "border-[#f2b37d] bg-[#fff1e5] text-[#dd6b20]",
  },
  review: {
    icon: Clock3,
    className: "border-[#8db0f3] bg-[#eaf2ff] text-[#2f5fbf]",
  },
  progress: {
    icon: Loader2,
    className: "border-[#c89cf4] bg-[#f7efff] text-[#7c3aed]",
  },
  approved: {
    icon: CheckCircle2,
    className: "border-[#8ed8b2] bg-[#e6fbef] text-[#18794e]",
  },
  cancelled: {
    icon: XCircle,
    className: "border-[#f1a3a3] bg-[#fff0f0] text-[#dc2626]",
  },
  add: {
    icon: Plus,
    className: "border-[#d5d7db] bg-[#f4f4f5] text-[#7a7a7a]",
  },
}

export function StateBadge({ className, label, tone }: StateBadgeProps) {
  const config = STATE_BADGE_STYLES[tone]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-2xl border px-3.5 text-[13px] font-medium shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
        config.className,
        className
      )}
    >
      <Icon
        className={cn("size-4 shrink-0", tone === "progress" ? "animate-spin" : "")}
        strokeWidth={1.8}
      />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  )
}
