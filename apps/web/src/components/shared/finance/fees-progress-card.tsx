"use client"

import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, Progress } from "@talimy/ui"

type FeesProgressItem = {
  collectedLabel: string
  id: string
  label: string
  progressPercentage: number
  progressLabel: string
}

type FeesProgressCardProps = {
  actionLabel?: string
  className?: string
  items: readonly FeesProgressItem[]
  title: string
}

export function FeesProgressCard({ actionLabel, className, items, title }: FeesProgressCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-[18px] font-semibold text-talimy-navy">{title}</h3>
        {typeof actionLabel === "string" ? (
          <button
            aria-label={actionLabel}
            className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            type="button"
          >
            <MoreHorizontal className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article className="space-y-3 rounded-4xl bg-white px-4 py-3" key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-[14px] font-medium text-slate-700">{item.label}</p>
              <span className="text-[12px] font-semibold text-talimy-navy">
                {item.progressLabel}
              </span>
            </div>

            <div className="relative">
              <Progress
                className="h-2 bg-slate-200 [&>[data-slot=progress-indicator]]:bg-talimy-navy"
                value={item.progressPercentage}
              />
              <span className="pointer-events-none absolute right-0 top-0 h-2 w-4 rounded-full bg-[var(--talimy-color-pink)]" />
            </div>

            <p className="text-[13px] font-semibold text-talimy-navy">{item.collectedLabel}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
