"use client"

import { X } from "lucide-react"

import { ScheduleDetailCard } from "@/components/shared/calendar-page/schedule-detail-card"
import type {
  CalendarPageCategory,
  CalendarPageEvent,
} from "@/components/shared/calendar-page/calendar-page.types"

type ScheduleDetailPanelProps = {
  categoryLabels: Record<CalendarPageCategory, string>
  events: readonly CalendarPageEvent[]
  labels: {
    empty: string
    notes: string
    title: string
  }
  locale: string
  onClose: () => void
}

export function ScheduleDetailPanel({
  categoryLabels,
  events,
  labels,
  locale,
  onClose,
}: ScheduleDetailPanelProps) {
  return (
    <aside className="rounded-[28px] border border-slate-100 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-talimy-navy">{labels.title}</h2>
        <button
          aria-label={labels.title}
          className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <ScheduleDetailCard
              categoryLabel={categoryLabels[event.category]}
              event={event}
              key={event.id}
              labels={{ notes: labels.notes }}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
          {labels.empty}
        </div>
      )}
    </aside>
  )
}
