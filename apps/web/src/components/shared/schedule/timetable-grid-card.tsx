"use client"

import { Card, CardContent, ChartFilterSelect, cn } from "@talimy/ui"

import type {
  TimetableDay,
  TimetableFilterOption,
  TimetableGridEntry,
  TimetableTone,
} from "@/components/shared/schedule/timetable-grid-card.types"
import {
  buildTimeLabels,
  getEntriesForDay,
  getEntryLayout,
  TIMETABLE_DAYS,
  TIMETABLE_TONE_CLASS_NAMES,
} from "@/components/shared/schedule/timetable-grid-card.utils"

type TimetableGridCardProps = {
  bodyHeight?: number
  className?: string
  days?: readonly TimetableDay[]
  entries: readonly TimetableGridEntry[]
  endHour?: number
  filterAriaLabel?: string
  period: string
  periodOptions: readonly TimetableFilterOption[]
  startHour?: number
  title: string
  onPeriodChange?: (value: string) => void
}

const DEFAULT_BODY_HEIGHT = 280

function resolveToneClassName(tone: TimetableTone | undefined): string {
  return TIMETABLE_TONE_CLASS_NAMES[tone ?? "sky"]
}

export function TimetableGridCard({
  bodyHeight = DEFAULT_BODY_HEIGHT,
  className,
  days = TIMETABLE_DAYS,
  entries,
  endHour = 15,
  filterAriaLabel = "Schedule period filter",
  onPeriodChange,
  period,
  periodOptions,
  startHour = 8,
  title,
}: TimetableGridCardProps) {
  const timeLabels = buildTimeLabels(startHour, endHour)
  const guideLineCount = Math.max(timeLabels.length - 1, 1)

  return (
    <Card className={cn("rounded-[28px] border border-slate-100 bg-white shadow-none", className)}>
      <CardContent className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-none text-talimy-navy">{title}</h3>

          <ChartFilterSelect
            ariaLabel={filterAriaLabel}
            className="shrink-0"
            onValueChange={onPeriodChange}
            options={[...periodOptions]}
            triggerClassName="h-8 min-w-[106px] rounded-xl px-3 text-[12px] font-semibold"
            value={period}
          />
        </div>

        <div className="overflow-hidden rounded-[18px] border border-[#eef2f6]">
          <div
            className="grid bg-[#f9fbfd]"
            style={{ gridTemplateColumns: `72px repeat(${days.length}, minmax(0, 1fr))` }}
          >
            <div className="px-4 py-3 text-[11px] font-medium text-slate-400">Time</div>
            {days.map((day) => (
              <div
                className="border-l border-[#eef2f6] px-3 py-3 text-center text-[11px] font-medium text-slate-500"
                key={day.key}
              >
                {day.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[72px_1fr] bg-white">
            <div
              className="relative border-r border-[#eef2f6] px-2 py-0"
              style={{ height: `${bodyHeight}px` }}
            >
              <div className="flex h-full flex-col justify-between text-[11px] font-medium text-slate-400">
                {timeLabels.map((label) => (
                  <span className="-translate-y-1/2" key={label}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
            >
              {days.map((day) => {
                const dayEntries = getEntriesForDay(entries, day.key)

                return (
                  <div
                    className="relative border-l border-[#eef2f6] first:border-l-0"
                    key={day.key}
                    style={{ height: `${bodyHeight}px` }}
                  >
                    {Array.from({ length: guideLineCount }).map((_, index) => (
                      <div
                        className="absolute left-0 right-0 border-t border-[#eef2f6]"
                        key={`${day.key}-line-${index}`}
                        style={{ top: `${(index / guideLineCount) * bodyHeight}px` }}
                      />
                    ))}

                    {dayEntries.map((entry) => {
                      const layout = getEntryLayout(entry, startHour, endHour, bodyHeight)

                      return (
                        <div
                          className={cn(
                            "absolute left-1 right-1 flex items-center justify-center rounded-[6px] px-2 text-[12px] font-medium",
                            resolveToneClassName(entry.tone)
                          )}
                          key={entry.id}
                          style={{
                            height: `${Math.max(layout.height - 6, 40)}px`,
                            top: `${layout.top + 3}px`,
                          }}
                        >
                          <span className="truncate">{entry.title}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
