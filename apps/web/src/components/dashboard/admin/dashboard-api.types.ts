import type { FeedItem } from "@/components/shared/feed/feed-table"
import type { CalendarMonthData } from "@/components/shared/calendar/calendar-widget.types"
import type { EventListItem } from "@/components/shared/events/events-list.types"
import type { RecentActivityItem } from "@/components/shared/activity/recent-activity.types"

export type AdminDashboardStatsResponse = {
  activeTeachers: number
  enrolledStudents: number
  supportStaff: number
  totalAwards: number
}

export type AdminStudentPerformanceResponse = {
  period: "last_semester" | "this_semester"
  points: ReadonlyArray<{
    grade7: number
    grade8: number
    grade9: number
    monthNumber: number
  }>
}

export type AdminStudentsByGenderResponse = {
  boys: number
  girls: number
  gradeId: string
  total: number
}

export type AdminAttendanceOverviewResponse = {
  period: "weekly" | "monthly"
  points: ReadonlyArray<{
    date: string
    label: string
    value: number
  }>
}

export type AdminFinanceEarningsResponse = {
  period: "last_year" | "this_year"
  points: ReadonlyArray<{
    earnings: number
    expenses: number
    monthNumber: number
  }>
  year: number
}

export type AdminActivityResponse = {
  items: ReadonlyArray<{
    action: string
    actorName: string | null
    id: string
    resource: string
    resourceLabel: string | null
    timestamp: string
  }>
}

export type NoticesResponse = {
  data: ReadonlyArray<{
    content: string
    createdAt: string
    createdBy: string | null
    createdByName: string | null
    expiryDate: string | null
    id: string
    priority: "low" | "medium" | "high" | "urgent"
    publishDate: string
    targetRole: "all" | "teachers" | "students" | "parents"
    tenantId: string
    title: string
    updatedAt: string
  }>
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export type EventsResponse = {
  data: ReadonlyArray<{
    createdAt: string
    description: string | null
    endDate: string
    id: string
    location: string | null
    startDate: string
    tenantId: string
    title: string
    type:
      | "academic"
      | "events"
      | "finance"
      | "administration"
      | "exam"
      | "holiday"
      | "sports"
      | "other"
    visibility: "all" | "admin" | "teachers" | "students"
    updatedAt: string
  }>
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export type DashboardCalendarPayload = {
  eventCountLabel: (count: number) => string
  months: readonly CalendarMonthData[]
  weekdayLabels: readonly string[]
}

export type DashboardEventsPayload = readonly EventListItem[]
export type DashboardRecentActivityPayload = readonly RecentActivityItem[]
export type DashboardNoticesPayload = readonly FeedItem[]
