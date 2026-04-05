"use client"

import { RequestDecisionCard } from "@/components/shared/requests/request-decision-card"

export function RequestDecisionCardShowcase() {
  return (
    <div className="w-72 shrink-0">
      <RequestDecisionCard
        badgeLabel="Sick Leave"
        className="w-72"
        description="Fever and medical rest advised by doctor"
        onPrimaryAction={() => undefined}
        onSecondaryAction={() => undefined}
        primaryActionLabel="Approve"
        secondaryActionLabel="Decline"
        title="Leave Request"
      />
    </div>
  )
}
