"use client"

import { FeesProgressCard } from "@/components/shared/finance/fees-progress-card"

const ITEMS = [
  {
    collectedLabel: "$70,000 / $80,000 collected",
    id: "tuition",
    label: "Tuition Fee",
    progressLabel: "87.5%",
    progressPercentage: 87.5,
  },
  {
    collectedLabel: "$10,500 / $12,000 collected",
    id: "books",
    label: "Books & Supplies",
    progressLabel: "87.5%",
    progressPercentage: 87.5,
  },
  {
    collectedLabel: "$7,200 / $8,000 collected",
    id: "activities",
    label: "Activities",
    progressLabel: "90%",
    progressPercentage: 90,
  },
  {
    collectedLabel: "$4,800 / $5,500 collected",
    id: "misc",
    label: "Miscellaneous",
    progressLabel: "86.5%",
    progressPercentage: 86.5,
  },
] as const

export function FeesProgressCardShowcase() {
  return (
    <div className="max-w-[360px]">
      <FeesProgressCard actionLabel="More actions" items={ITEMS} title="Fees Collection Progress" />
    </div>
  )
}
