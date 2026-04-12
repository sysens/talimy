"use client"

import { Avatar, Card, Chip } from "@heroui/react"

type ProfileOverviewBadgeTone = "info" | "muted" | "success"

export type ProfileOverviewBadge = {
  label: string
  tone?: ProfileOverviewBadgeTone
}

type ProfileOverviewCardProps = {
  avatarFallback: string
  avatarUrl?: string
  badges?: readonly ProfileOverviewBadge[]
  metaLabel?: string
  name: string
  statusLabel?: string
}

const BADGE_CLASS_NAMES: Record<ProfileOverviewBadgeTone, string> = {
  info: "rounded-md bg-[#d7eef5] text-[10px] font-medium text-talimy-navy shadow-none",
  muted: "rounded-md bg-[#e6e8eb] p-0.5 text-[10px] font-medium text-slate-700 shadow-none",
  success: "rounded-md bg-[#b9f0d1] text-[10px] font-medium text-[#0e7a47] shadow-none",
}

export function ProfileOverviewCard({
  avatarFallback,
  avatarUrl,
  badges,
  metaLabel = "",
  name,
  statusLabel = "",
}: ProfileOverviewCardProps) {
  const resolvedBadges: ReadonlyArray<ProfileOverviewBadge> =
    badges && badges.length > 0
      ? badges
      : [
          { label: metaLabel, tone: "muted" },
          { label: statusLabel, tone: "info" },
        ]

  return (
    <Card className="p-0 shadow-none">
      <Card.Content className="items-center justify-center text-center">
        <Avatar className="size-[118px] rounded-[28px]  mb-6" size="md">
          {avatarUrl ? <Avatar.Image alt={name} src={avatarUrl} /> : null}
          <Avatar.Fallback className="rounded-[28px] bg-[#f4c4f7] text-[28px] font-semibold text-talimy-navy">
            {avatarFallback}
          </Avatar.Fallback>
        </Avatar>

        <div className="space-y-3">
          <h3 className="text-[17px] font-semibold leading-none text-talimy-navy">{name}</h3>

          <div className="flex items-center justify-center gap-2">
            {resolvedBadges.map((badge) => (
              <Chip
                className={BADGE_CLASS_NAMES[badge.tone ?? "muted"]}
                key={`${badge.label}-${badge.tone ?? "muted"}`}
              >
                {badge.label}
              </Chip>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
