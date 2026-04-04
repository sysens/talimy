import type { EventListItem } from "@/components/shared/events/events-list.types"

export const EVENT_LIST_ITEMS: readonly EventListItem[] = [
  {
    audience: "All Classes",
    dateLabel: "March 2",
    id: "sport-competition",
    timeRange: "09:00 AM – 12:00 PM",
    title: "Annual Sport Competition",
  },
  {
    audience: "7A, 7B",
    dateLabel: "March 5",
    id: "parent-teacher-meeting",
    timeRange: "02:00 PM – 04:00 PM",
    title: "Parent-Teacher Meeting",
  },
  {
    audience: "All Classes",
    dateLabel: "March 28",
    id: "science-fair",
    timeRange: "09:00 AM – 05:00 PM",
    title: "Annual Science Fair",
  },
] as const
