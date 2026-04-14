"use client"

import type { LucideIcon } from "lucide-react"
import { Bell, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@talimy/ui"

import { cn } from "@/lib/utils"

export type LessonsOverviewItem = {
  id: string
  subtitle: string
  timeLabel: string
  title: string
}

export type LessonsOverviewSection = {
  id: string
  items: readonly LessonsOverviewItem[]
  label: string
}

type LessonsOverviewCardProps = {
  className?: string
  emptyLabel: string
  sections: readonly LessonsOverviewSection[]
  title: string
}

const SECTION_ICON_MAP: Record<string, LucideIcon> = {
  today: Bell,
  tomorrow: BookOpen,
}

function LessonRow({
  accentClassName,
  icon: Icon,
  item,
}: {
  accentClassName: string
  icon: LucideIcon
  item: LessonsOverviewItem
}) {
  return (
    <div className="flex items-start gap-3" key={item.id}>
      <span
        className={cn(
          "mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full",
          accentClassName
        )}
      >
        <Icon className="size-4 text-talimy-navy" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-6 font-medium text-talimy-navy">{item.title}</p>
        <p className="text-[12px] leading-5 text-slate-500">{item.subtitle}</p>
      </div>
      <span className="shrink-0 text-[12px] font-medium text-slate-400">{item.timeLabel}</span>
    </div>
  )
}

export function LessonsOverviewCard({
  className,
  emptyLabel,
  sections,
  title,
}: LessonsOverviewCardProps) {
  return (
    <Card className={cn("rounded-[28px] border border-slate-100 bg-white shadow-none", className)}>
      <CardHeader className="pb-1">
        <CardTitle className="text-[18px] font-semibold text-talimy-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-5 pt-1">
        {sections.map((section, index) => {
          const Icon = SECTION_ICON_MAP[section.id] ?? BookOpen
          const accentClassName =
            index % 2 === 0 ? "bg-[var(--talimy-color-sky)]/35" : "bg-[var(--talimy-color-pink)]/35"

          return (
            <div className="space-y-3" key={section.id}>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                {section.label}
              </p>

              {section.items.length > 0 ? (
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <LessonRow
                      accentClassName={accentClassName}
                      icon={Icon}
                      item={item}
                      key={item.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[18px] border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-400">
                  {emptyLabel}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
