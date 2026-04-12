"use client"

import type { ReactNode } from "react"
import { Button, Card } from "@heroui/react"
import { MoreHorizontal } from "lucide-react"

import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"

export type RelationshipContactsCardItem = {
  label: string
  meta: string
  name: string
}

type RelationshipContactsCardProps = {
  actionLabel?: string
  items: readonly RelationshipContactsCardItem[]
  onActionPress?: () => void
  title: string
}

export function RelationshipContactsCard({
  actionLabel,
  items,
  onActionPress,
  title,
}: RelationshipContactsCardProps) {
  return (
    <Card className="rounded-[28px] rounded-t-none border border-slate-100 border-t-0 bg-white shadow-none">
      <Card.Content className="">
        <div className="flex items-center justify-between gap-3 mb-2">
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

        <MutedPanelCard className="bg-[#f8f8f6] p-0">
          <div className="divide-y divide-[#e7eaee]">
            {items.map((item) => (
              <div className="flex items-center justify-between gap-3 py-1" key={item.label}>
                <p className="text-[12px] leading-5 text-slate-500 w-fit">{item.label}</p>
                <div className="text-right">
                  <p className="text-[12px] font-medium leading-5 text-slate-700">{item.name}</p>
                  <p className="text-[12px] leading-5 text-slate-400">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </MutedPanelCard>
      </Card.Content>
    </Card>
  )
}
