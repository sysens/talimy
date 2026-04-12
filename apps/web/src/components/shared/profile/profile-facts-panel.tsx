"use client"

import type { ReactNode } from "react"

import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"

export type ProfileFactsPanelItem = {
  icon: ReactNode
  label: string
  value: ReactNode
}

type ProfileFactsPanelProps = {
  className?: string
  items: readonly ProfileFactsPanelItem[]
}

export function ProfileFactsPanel({ className, items }: ProfileFactsPanelProps) {
  return (
    <MutedPanelCard className={className}>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-start gap-x-2"
            key={item.label}
          >
            <div className="pt-0.5 text-slate-400">{item.icon}</div>
            <p className="text-[11px] leading-5 text-slate-400">{item.label}</p>
            <div className="max-w-[160px] text-right text-[12px] font-medium leading-5 text-slate-700">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </MutedPanelCard>
  )
}
