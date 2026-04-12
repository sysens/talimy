export const adminCalendarQueryKeys = {
  all: ["admin-calendar"] as const,
  event: (eventId: string) => [...adminCalendarQueryKeys.all, "event", eventId] as const,
  list: (month: string) => [...adminCalendarQueryKeys.all, "list", month] as const,
}
