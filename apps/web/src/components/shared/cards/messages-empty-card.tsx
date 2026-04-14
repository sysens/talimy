"use client"

import { MessageCircleMore } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { cn } from "@/lib/utils"

type MessagesEmptyCardProps = {
  className?: string
  emptyLabel: string
  title: string
}

export function MessagesEmptyCard({ className, emptyLabel, title }: MessagesEmptyCardProps) {
  return (
    <Card
      className={cn("rounded-[28px] border border-slate-100 bg-white py-0 shadow-none", className)}
    >
      <CardHeader className="pb-1">
        <CardTitle className="text-[18px] font-semibold text-talimy-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-1">
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-[#fafcff] px-4 text-center">
          <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-[var(--talimy-color-sky)]/25 text-talimy-navy">
            <MessageCircleMore className="size-5" />
          </span>
          <p className="text-sm font-medium text-slate-500">{emptyLabel}</p>
        </div>
      </CardContent>
    </Card>
  )
}
