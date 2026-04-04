"use client"

import { EventsList } from "@/components/shared/events/events-list"
import { EVENT_LIST_ITEMS } from "@/components/shared/events/events-list.data"

export function EventsListShowcase() {
  return <EventsList events={EVENT_LIST_ITEMS} />
}
