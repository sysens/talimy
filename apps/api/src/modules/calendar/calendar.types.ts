export type CalendarEventType =
  | "academic"
  | "events"
  | "finance"
  | "administration"
  | "exam"
  | "holiday"
  | "sports"
  | "other"

export type CalendarEventVisibility = "all" | "admin" | "teachers" | "students"

export type CalendarEventView = {
  id: string
  tenantId: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  location: string | null
  type: CalendarEventType
  visibility: CalendarEventVisibility
  createdAt: string
  updatedAt: string
}

export type CalendarEventsListResponse = {
  data: CalendarEventView[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}
