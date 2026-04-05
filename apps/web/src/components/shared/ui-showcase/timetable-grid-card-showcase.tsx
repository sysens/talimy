"use client"

import * as React from "react"

import { TimetableGridCard } from "@/components/shared/schedule/timetable-grid-card"
import {
  DEFAULT_TIMETABLE_ENTRIES,
  DEFAULT_TIMETABLE_PERIOD_OPTIONS,
} from "@/components/shared/schedule/timetable-grid-card.fixtures"

export function TimetableGridCardShowcase() {
  const [period, setPeriod] = React.useState("weekly")

  return (
    <div className="max-w-4xl">
      <TimetableGridCard
        entries={DEFAULT_TIMETABLE_ENTRIES}
        onPeriodChange={setPeriod}
        period={period}
        periodOptions={DEFAULT_TIMETABLE_PERIOD_OPTIONS}
        title="Schedule"
      />
    </div>
  )
}
