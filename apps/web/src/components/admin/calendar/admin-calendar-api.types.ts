import type { CreateEventInput, EventTypeInput, EventVisibilityInput } from "@talimy/shared"

export type AdminCalendarEventResponse = {
  createdAt: string
  description: string | null
  endDate: string
  id: string
  location: string | null
  startDate: string
  tenantId: string
  title: string
  type: EventTypeInput
  updatedAt: string
  visibility: EventVisibilityInput
}

export type AdminCalendarEventsResponse = {
  data: readonly AdminCalendarEventResponse[]
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export type AdminCalendarEventsQuery = {
  limit?: number
  month?: string
  order?: "asc" | "desc"
  page?: number
  search?: string
  sort?: "createdAt" | "endDate" | "startDate" | "title" | "type" | "visibility"
  type?: EventTypeInput
}

export type CreateCalendarEventPayload = Omit<CreateEventInput, "tenantId">
