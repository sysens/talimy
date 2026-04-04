"use client"

import { RECENT_ACTIVITY_ITEMS } from "@/components/shared/activity/recent-activity.data"
import { RecentActivity } from "@/components/shared/activity/recent-activity"

export function RecentActivityShowcase() {
  return <RecentActivity items={RECENT_ACTIVITY_ITEMS} />
}
