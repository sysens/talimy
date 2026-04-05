"use client"

import { ProfileDetailsCard } from "@/components/shared/profile/profile-details-card"

const SHOWCASE_ITEMS = [
  {
    label: "Subject",
    value: "English Language",
  },
  {
    label: "Class",
    value: "8C - 9A - 9B",
  },
] as const

export function ProfileDetailsCardShowcase() {
  return <ProfileDetailsCard items={SHOWCASE_ITEMS} />
}
