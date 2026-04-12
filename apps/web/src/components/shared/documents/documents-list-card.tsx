"use client"

import { Button, Card } from "@heroui/react"
import { FileText, MoreHorizontal } from "lucide-react"

export type DocumentsListCardItem = {
  fileName: string
  formatLabel: string
  sizeLabel: string
}

type DocumentsListCardProps = {
  actionLabel?: string
  items: readonly DocumentsListCardItem[]
  onActionPress?: () => void
  title: string
}

export function DocumentsListCard({
  actionLabel,
  items,
  onActionPress,
  title,
}: DocumentsListCardProps) {
  return (
    <Card className="bg-transparent shadow-none px-0">
      <Card.Content>
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

        <div className="space-y-3 rounded-4xl bg-white p-4">
          {items.map((item) => (
            <div
              className="flex items-start gap-3 py-5 border-b border-b-gray-100 mb-0 last:border-b-0 last:pb-0 first:pt-0"
              key={item.fileName}
            >
              <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#f6c9f8] text-[#353535]">
                <FileText className="size-4" />
                <span className="text-[8px] font-semibold leading-none tracking-[0.08em]">PDF</span>
              </div>

              <div className="min-w-0 space-y-1 pt-0.5">
                <p className="truncate text-[14px] font-medium leading-5 text-slate-700">
                  {item.fileName}
                </p>
                <p className="text-[12px] leading-none text-slate-400">
                  {item.formatLabel}
                  <span className="px-1.5">&bull;</span>
                  {item.sizeLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
