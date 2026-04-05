"use client"

import type { ReactNode } from "react"

import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"

export type ProfileDetailsItem = {
  label: string
  value: string
}

type ProfileDetailsCardProps = {
  footer?: ReactNode
  items: readonly ProfileDetailsItem[]
}

export function ProfileDetailsCard({ footer, items }: ProfileDetailsCardProps) {
  return (
    <MutedPanelCard className="p-0">
      <div className="">
        {items.map((item) => (
          <div className="flex items-start" key={item.label}>
            <span className="min-w-[50px] text-sm font-medium text-slate-500">{item.label}</span>
            <span className="text-sm font-medium leading-6 text-slate-800">{item.value}</span>
          </div>
        ))}

        {footer ? <div className="pt-1">{footer}</div> : null}
      </div>
    </MutedPanelCard>
  )
}
