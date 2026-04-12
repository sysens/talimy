"use client"

import type { ReactNode } from "react"
import { Button, ChartFilterSelect, Tabs, TabsList, TabsTrigger } from "@talimy/ui"

import type {
  CalendarMonthOption,
  CalendarPageView,
} from "@/components/shared/calendar-page/calendar-page.types"

type CalendarHeaderProps = {
  addAction?: ReactNode
  labels: {
    addAgenda: string
    day: string
    month: string
    monthAriaLabel: string
    week: string
  }
  monthOptions: readonly CalendarMonthOption[]
  monthValue: string
  onMonthChange: (value: string) => void
  onViewChange: (value: CalendarPageView) => void
  view: CalendarPageView
}

export function CalendarHeader({
  addAction,
  labels,
  monthOptions,
  monthValue,
  onMonthChange,
  onViewChange,
  view,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <ChartFilterSelect
        ariaLabel={labels.monthAriaLabel}
        onValueChange={onMonthChange}
        options={[...monthOptions]}
        triggerClassName="h-11 min-w-[184px] rounded-[18px] border-0 bg-white px-4 text-[15px] font-semibold text-talimy-navy shadow-none"
        value={monthValue}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={view} onValueChange={(value) => onViewChange(value as CalendarPageView)}>
          <TabsList className="h-10 rounded-[16px] bg-[#f6f7fb] p-1">
            <TabsTrigger className="rounded-[12px] px-4 text-[13px] font-medium" value="day">
              {labels.day}
            </TabsTrigger>
            <TabsTrigger className="rounded-[12px] px-4 text-[13px] font-medium" value="week">
              {labels.week}
            </TabsTrigger>
            <TabsTrigger className="rounded-[12px] px-4 text-[13px] font-medium" value="month">
              {labels.month}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {addAction ?? (
          <Button
            className="h-10 rounded-[16px] bg-[var(--talimy-color-pink)] px-4 text-[13px] font-medium text-talimy-navy shadow-none hover:bg-[var(--talimy-color-pink)]/90"
            type="button"
          >
            {labels.addAgenda}
          </Button>
        )}
      </div>
    </div>
  )
}
