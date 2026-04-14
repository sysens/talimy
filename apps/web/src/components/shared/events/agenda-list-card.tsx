"use client"

import { Button, Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { cn } from "@/lib/utils"

export type AgendaListItem = {
  accentClassName: string
  dateLabel: string
  id: string
  subtitle: string
  tagLabel: string
  title: string
}

type AgendaListCardProps = {
  className?: string
  emptyLabel: string
  items: readonly AgendaListItem[]
  onViewAll?: () => void
  title: string
  viewAllLabel: string
}

export function AgendaListCard({
  className,
  emptyLabel,
  items,
  onViewAll,
  title,
  viewAllLabel,
}: AgendaListCardProps) {
  return (
    <Card
      className={cn("rounded-[28px] border border-slate-100 bg-white py-0 shadow-none", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-1">
        <CardTitle className="text-[18px] font-semibold text-talimy-navy">{title}</CardTitle>
        <Button
          className="h-auto p-0 text-[13px] font-medium text-slate-400 shadow-none hover:text-talimy-navy"
          onClick={onViewAll}
          type="button"
          variant="ghost"
        >
          {viewAllLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-1">
        {items.length > 0 ? (
          items.map((item) => (
            <article className="flex gap-3" key={item.id}>
              <span
                className={cn("mt-1 block w-0.5 shrink-0 rounded-full", item.accentClassName)}
              />
              <div className="min-w-0 space-y-1">
                <p className="text-[11px] text-slate-400">{item.dateLabel}</p>
                <h4 className="text-[14px] font-medium text-talimy-navy">{item.title}</h4>
                <p className="text-[12px] text-slate-500">{item.subtitle}</p>
                <span className="inline-flex rounded-full bg-[#f7f7f8] px-2.5 py-1 text-[11px] text-slate-400">
                  {item.tagLabel}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[18px] border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-400">
            {emptyLabel}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
