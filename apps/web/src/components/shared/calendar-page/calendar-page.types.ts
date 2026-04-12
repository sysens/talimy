import type { ComponentType } from "react"
import type { EventTypeInput, EventVisibilityInput } from "@talimy/shared"

export type CalendarPageCategory = "academic" | "events" | "finance" | "administration"
export type CalendarPageCategoryFilter = "all" | CalendarPageCategory
export type CalendarPageView = "day" | "month" | "week"

export type CalendarPageEvent = {
  category: CalendarPageCategory
  description: string | null
  endDate: string
  id: string
  location: string | null
  startDate: string
  title: string
  type: EventTypeInput
  visibility: EventVisibilityInput
}

export type CalendarMonthOption = {
  label: string
  value: string
}

export type CalendarCategoryTabItem = {
  count: number
  icon: ComponentType<{ className?: string }>
  tone: "gray" | "navy" | "pink" | "sky"
  value: CalendarPageCategoryFilter
}
