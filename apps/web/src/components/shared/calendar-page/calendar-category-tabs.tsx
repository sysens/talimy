"use client"

import { StatCard } from "@talimy/ui"

import type {
  CalendarCategoryTabItem,
  CalendarPageCategoryFilter,
} from "@/components/shared/calendar-page/calendar-page.types"

type CalendarCategoryTabsProps = {
  activeValue: CalendarPageCategoryFilter
  items: readonly CalendarCategoryTabItem[]
  labels: Record<CalendarPageCategoryFilter, string>
  onValueChange: (value: CalendarPageCategoryFilter) => void
}

export function CalendarCategoryTabs({
  activeValue,
  items,
  labels,
  onValueChange,
}: CalendarCategoryTabsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <button key={item.value} onClick={() => onValueChange(item.value)} type="button">
          <StatCard
            active={activeValue === item.value}
            className="w-full text-left"
            icon={item.icon}
            title={labels[item.value]}
            tone={item.tone}
            value={item.count}
            variant="pill"
          />
        </button>
      ))}
    </div>
  )
}
