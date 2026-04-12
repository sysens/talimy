import { webApiFetch } from "@/lib/api"

import type {
  AdminCalendarEventResponse,
  AdminCalendarEventsQuery,
  AdminCalendarEventsResponse,
  CreateCalendarEventPayload,
} from "@/components/admin/calendar/admin-calendar-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

function buildSearch(params: Record<string, number | string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      searchParams.set(key, String(value))
    }
  }

  const serialized = searchParams.toString()
  return serialized.length > 0 ? `?${serialized}` : ""
}

export function getAdminCalendarEvents(query: AdminCalendarEventsQuery) {
  return webApiFetch<SuccessEnvelope<AdminCalendarEventsResponse>>(
    `/events${buildSearch({
      limit: query.limit,
      month: query.month,
      order: query.order,
      page: query.page,
      search: query.search,
      sort: query.sort,
      type: query.type,
    })}`
  ).then((response) => response.data)
}

export function getAdminCalendarEventById(eventId: string) {
  return webApiFetch<SuccessEnvelope<AdminCalendarEventResponse>>(`/events/${eventId}`).then(
    (response) => response.data
  )
}

export function createAdminCalendarEvent(payload: CreateCalendarEventPayload) {
  return webApiFetch<SuccessEnvelope<AdminCalendarEventResponse>>("/events", {
    body: JSON.stringify(payload),
    method: "POST",
  }).then((response) => response.data)
}
