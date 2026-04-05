"use client"

import { ProfileOverviewCard } from "@/components/shared/profile/profile-overview-card"

export function ProfileOverviewCardShowcase() {
  return (
    <ProfileOverviewCard
      avatarFallback="CV"
      avatarUrl="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/man-3.png"
      metaLabel="T-1003"
      name="Cliff William"
      statusLabel="Full-Time"
    />
  )
}
