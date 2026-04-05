"use client"

import type { ReactNode } from "react"
import { Button, Card } from "@heroui/react"
import { MoreHorizontal } from "lucide-react"

export type PersonalInfoCardItem = {
  icon: ReactNode
  label: string
  value: ReactNode
}

type PersonalInfoCardProps = {
  actionLabel?: string
  items: readonly PersonalInfoCardItem[]
  onActionPress?: () => void
  title: string
}

export function PersonalInfoCard({
  actionLabel,
  items,
  onActionPress,
  title,
}: PersonalInfoCardProps) {
  return (
    <Card className="rounded-[28px] border border-slate-100 bg-white shadow-none">
      <Card.Content className="gap-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-none text-talimy-navy">{title}</h3>

          {actionLabel ? (
            <Button
              isIconOnly
              aria-label={actionLabel}
              className="size-8 min-w-8 rounded-full bg-transparent text-slate-400 shadow-none hover:bg-slate-50"
              onPress={onActionPress}
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div className="flex items-start gap-3" key={item.label}>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#d9f1f7] text-talimy-navy">
                {item.icon}
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-[11px] leading-none text-slate-400">{item.label}</p>
                <div className="text-[14px] font-medium leading-6 text-slate-700 truncate">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
