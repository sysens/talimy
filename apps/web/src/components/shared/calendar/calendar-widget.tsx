"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@talimy/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  CALENDAR_ATTENDANCE_MONTHS,
  CALENDAR_EVENT_MONTHS,
} from "@/components/shared/calendar/calendar-widget.data"
import { CALENDAR_ICONS } from "@/components/shared/calendar/calendar-widget.icons"
import type {
  CalendarAttendanceStatus,
  CalendarMonthData,
  CalendarViewVariant,
} from "@/components/shared/calendar/calendar-widget.types"
import {
  buildCalendarGrid,
  CALENDAR_DAYS_OF_WEEK,
} from "@/components/shared/calendar/calendar-widget.types"
import { formatCalendarMonth } from "@/lib/dashboard/dashboard-formatters"
import { cn } from "@/lib/utils"

type CalendarWidgetLabels = {
  attendanceStatusMeta?: Record<CalendarAttendanceStatus, { description: string; label: string }>
  eventCountLabel?: (count: number) => string
  weekdayLabels?: readonly string[]
}

type CalendarWidgetProps = {
  attendanceSummaryVariant?: "bars" | "cards"
  attendanceSummaryGridClassName?: string
  className?: string
  labels?: CalendarWidgetLabels
  locale?: string
  months?: readonly CalendarMonthData[]
  onSelectedDateChange?: (value: string) => void
  selectedDate?: string | null
  variant?: CalendarViewVariant
}

const ATTENDANCE_STATUS_CLASS_NAMES: Record<CalendarAttendanceStatus, string> = {
  absent: "bg-[#dfe3e6] text-[#6c7a86]",
  late: "bg-[#f6b5ff] text-[#4d4f7d]",
  onLeave: "bg-[#1f4b7b] text-white",
  present: "bg-[#d4f1ff] text-[#476881]",
  sick: "bg-[#1f4b7b] text-white",
}

const DEFAULT_ATTENDANCE_STATUS_META: Record<
  CalendarAttendanceStatus,
  { description: string; label: string }
> = {
  absent: {
    description: "Darsga qatnashmagan",
    label: "Absent",
  },
  late: {
    description: "Kechikib kelgan",
    label: "Late",
  },
  onLeave: {
    description: "Ruxsat bilan yo‘q",
    label: "On Leave",
  },
  present: {
    description: "Darsda qatnashgan",
    label: "Present",
  },
  sick: {
    description: "Sog‘liq bo‘yicha ruxsatli yo‘q",
    label: "Sick",
  },
}

function getDefaultMonths(variant: CalendarViewVariant): readonly CalendarMonthData[] {
  return variant === "attendance" ? CALENDAR_ATTENDANCE_MONTHS : CALENDAR_EVENT_MONTHS
}

function resolveSelectedDay(
  activeMonth: CalendarMonthData,
  selectedDate: string | null | undefined
): number | null {
  if (!selectedDate) {
    return activeMonth.selectedDay
  }

  const date = new Date(selectedDate)
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== activeMonth.year ||
    date.getMonth() + 1 !== activeMonth.monthNumber
  ) {
    return activeMonth.selectedDay
  }

  return date.getDate()
}

function buildIsoDate(year: number, monthNumber: number, day: number): string {
  return `${year}-${monthNumber.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
}

function resolveAttendanceSummaryCardTextClassName(colorClassName: string): string {
  return colorClassName === "bg-[#1f4b7b]" ? "text-white" : "text-[#274760]"
}

export function CalendarWidget({
  attendanceSummaryVariant = "bars",
  attendanceSummaryGridClassName,
  className,
  labels,
  locale = "en",
  months,
  onSelectedDateChange,
  selectedDate,
  variant = "events",
}: CalendarWidgetProps) {
  const resolvedMonths = months ?? getDefaultMonths(variant)
  const [activeMonthIndex, setActiveMonthIndex] = React.useState(1)
  const [hoveredDay, setHoveredDay] = React.useState<number | null>(null)
  const activeMonth = resolvedMonths[activeMonthIndex] ?? resolvedMonths[0]
  const attendanceStatusMeta = labels?.attendanceStatusMeta ?? DEFAULT_ATTENDANCE_STATUS_META
  const weekdayLabels = labels?.weekdayLabels ?? CALENDAR_DAYS_OF_WEEK

  if (!activeMonth) {
    return null
  }

  const gridDays = React.useMemo(
    () => buildCalendarGrid(activeMonth.monthNumber, activeMonth.year),
    [activeMonth.monthNumber, activeMonth.year]
  )
  const resolvedSelectedDay = resolveSelectedDay(activeMonth, selectedDate)

  function setMonthSelection(nextMonth: CalendarMonthData) {
    if (nextMonth.kind !== "events" || !onSelectedDateChange || nextMonth.selectedDay === null) {
      return
    }

    onSelectedDateChange(buildIsoDate(nextMonth.year, nextMonth.monthNumber, nextMonth.selectedDay))
  }

  function moveMonth(direction: "next" | "previous") {
    setHoveredDay(null)
    setActiveMonthIndex((currentIndex) => {
      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % resolvedMonths.length
          : (currentIndex - 1 + resolvedMonths.length) % resolvedMonths.length
      const nextMonth = resolvedMonths[nextIndex]

      if (nextMonth) {
        setMonthSelection(nextMonth)
      }

      return nextIndex
    })
  }

  return (
    <div
      className={[
        "w-full text-[#2d5877] mb-0 rounded-b-none",
        variant === "attendance"
          ? "rounded-[24px] bg-white p-4 pt-6  "
          : "rounded-4xl bg-[#d9f3ff] p-4",
        className ?? "",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3
          className={[
            "font-semibold tracking-[-0.02em] text-[#2b5371]",
            variant === "attendance" ? "text-[16px]" : "text-[18px]",
          ].join(" ")}
        >
          {formatCalendarMonth(locale, activeMonth.monthNumber, activeMonth.year)}
        </h3>

        <div className="flex items-center gap-1">
          <Button
            className={[
              "h-7 w-7 p-0 text-[#8ca6b8] shadow-none hover:bg-white/90",
              variant === "attendance" ? "rounded-full bg-transparent" : "rounded-[8px] bg-white",
            ].join(" ")}
            onClick={() => moveMonth("previous")}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            className={[
              "h-7 w-7 p-0 text-[#8ca6b8] shadow-none hover:bg-white/90",
              variant === "attendance" ? "rounded-full bg-transparent" : "rounded-[8px] bg-white",
            ].join(" ")}
            onClick={() => moveMonth("next")}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center">
        {weekdayLabels.map((day, index) => (
          <div
            className={[
              "py-1 text-[10px] font-medium tracking-[0.16em]",
              variant === "attendance" ? "text-[#95a7b5]" : "text-[#87a8bc]",
            ].join(" ")}
            key={`${variant}-${day}-${index}`}
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={["grid grid-cols-7 "].join(" ")}
          exit={{ opacity: 0, y: 8 }}
          initial={{ opacity: 0, y: -8 }}
          key={activeMonth.key}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {gridDays.map((cell) => {
            const dayItems =
              activeMonth.kind === "events" && cell.isCurrentMonth
                ? (activeMonth.events[cell.day] ?? [])
                : []
            const dayStatus =
              activeMonth.kind === "attendance" && cell.isCurrentMonth
                ? activeMonth.statuses[cell.day]
                : undefined
            const hasItems = dayItems.length > 0
            const isHovered = cell.isCurrentMonth && hoveredDay === cell.day
            const isSelected = cell.isCurrentMonth && resolvedSelectedDay === cell.day

            return (
              <div
                className={[
                  "relative flex items-center justify-center",
                  variant === "attendance" ? "h-9" : "h-8",
                ].join(" ")}
                key={`${activeMonth.key}-${cell.key}`}
                onMouseEnter={() => setHoveredDay(cell.isCurrentMonth ? cell.day : null)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <motion.button
                  className={[
                    "flex items-center justify-center text-[13px] font-medium transition-colors",
                    variant === "attendance" ? "h-8 w-8 rounded-[10px]" : "h-7 w-7 rounded-full",
                    !cell.isCurrentMonth
                      ? variant === "attendance"
                        ? "text-[#b8c2cd]"
                        : "text-[#9db5c7]"
                      : "",
                    activeMonth.kind === "events" && cell.isCurrentMonth && !hasItems && !isSelected
                      ? "text-[#355574] hover:bg-white/55"
                      : "",
                    activeMonth.kind === "events" && hasItems
                      ? "cursor-pointer bg-[#f0b9ff] text-[#355574]"
                      : "",
                    activeMonth.kind === "events" && isSelected
                      ? "bg-white text-[#355574] shadow-[0_10px_18px_-12px_rgba(33,89,124,0.55)]"
                      : "",
                    activeMonth.kind === "attendance" && cell.isCurrentMonth && !dayStatus
                      ? "text-[#28485e]"
                      : "",
                    activeMonth.kind === "attendance" && dayStatus
                      ? ATTENDANCE_STATUS_CLASS_NAMES[dayStatus]
                      : "",
                  ].join(" ")}
                  onClick={() => {
                    if (
                      activeMonth.kind !== "events" ||
                      !cell.isCurrentMonth ||
                      !onSelectedDateChange
                    ) {
                      return
                    }

                    onSelectedDateChange(
                      buildIsoDate(activeMonth.year, activeMonth.monthNumber, cell.day)
                    )
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  type="button"
                  whileHover={cell.isCurrentMonth ? { scale: 1.06 } : undefined}
                >
                  {cell.day}
                </motion.button>

                <AnimatePresence>
                  {activeMonth.kind === "events" && isHovered && hasItems ? (
                    <motion.div
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-[0_20px_45px_-20px_rgba(48,104,139,0.45)]"
                      exit={{ opacity: 0, scale: 0.92, y: 6 }}
                      initial={{ opacity: 0, scale: 0.92, y: 10 }}
                      transition={{ damping: 24, stiffness: 320, type: "spring" }}
                    >
                      <div className="flex flex-col gap-3 p-3">
                        {dayItems.map((item) => {
                          const ItemIcon = CALENDAR_ICONS[item.iconKey]

                          return (
                            <div
                              className="flex items-center gap-3"
                              key={`${cell.day}-${item.title}`}
                            >
                              <div
                                className={`rounded-lg bg-[#eef7fd] p-1.5 ${item.colorClassName}`}
                              >
                                <ItemIcon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#355574]">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-[#7a97aa]">{item.metaLabel}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="border-t border-[#dcebf5] bg-[#f7fbfe] px-3 py-2 text-[11px] font-medium text-[#7a97aa]">
                        {labels?.eventCountLabel
                          ? labels.eventCountLabel(dayItems.length)
                          : `${dayItems.length} ta tadbir`}
                      </div>
                    </motion.div>
                  ) : null}

                  {activeMonth.kind === "attendance" && isHovered && dayStatus ? (
                    <motion.div
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 z-50 mb-2 min-w-32 -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-[0_20px_45px_-20px_rgba(48,104,139,0.35)]"
                      exit={{ opacity: 0, scale: 0.92, y: 6 }}
                      initial={{ opacity: 0, scale: 0.92, y: 10 }}
                      transition={{ damping: 24, stiffness: 320, type: "spring" }}
                    >
                      <div className="flex items-center gap-2 border-b border-[#e6eff5] px-3 py-2">
                        <span
                          className={[
                            "h-2.5 w-2.5 rounded-full",
                            dayStatus === "present"
                              ? "bg-[#b8ebff]"
                              : dayStatus === "late"
                                ? "bg-[#f6b5ff]"
                                : dayStatus === "absent"
                                  ? "bg-[#dfe3e6]"
                                  : "bg-[#1f4b7b]",
                          ].join(" ")}
                        />
                        <span className="text-xs font-semibold text-[#31516d]">
                          {attendanceStatusMeta[dayStatus].label}
                        </span>
                      </div>
                      <div className="px-3 py-2 text-[11px] text-[#7d97a8]">
                        {attendanceStatusMeta[dayStatus].description}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {activeMonth.kind === "attendance" ? (
        <div className="mt-5 space-y-3">
          {attendanceSummaryVariant === "cards" ? (
            <div className={cn("grid grid-cols-4 gap-3", attendanceSummaryGridClassName)}>
              {activeMonth.summary.map((item) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-[14px] px-3 py-2 ${item.colorClassName}`}
                  initial={{ opacity: 0, y: 8 }}
                  key={`${activeMonth.key}-${item.label}`}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="space-y-1">
                    <p
                      className={[
                        "text-[12px] font-medium",
                        resolveAttendanceSummaryCardTextClassName(item.colorClassName),
                      ].join(" ")}
                    >
                      {item.label}
                    </p>
                    <p
                      className={[
                        "text-[10px] font-semibold leading-none",
                        resolveAttendanceSummaryCardTextClassName(item.colorClassName),
                      ].join(" ")}
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {activeMonth.summary.map((item) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 8 }}
                  key={`${activeMonth.key}-${item.label}`}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className={`h-1.5 rounded-full ${item.colorClassName}`} />
                  <div className="flex items-center gap-2 text-[11px] text-[#8195a6]">
                    <span>{item.label}</span>
                    <span className="text-[12px] font-semibold text-[#274760]">{item.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
