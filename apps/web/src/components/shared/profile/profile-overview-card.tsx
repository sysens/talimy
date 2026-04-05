"use client"

import { Avatar, Card, Chip } from "@heroui/react"

type ProfileOverviewCardProps = {
  avatarFallback: string
  avatarUrl?: string
  metaLabel: string
  name: string
  statusLabel: string
}

export function ProfileOverviewCard({
  avatarFallback,
  avatarUrl,
  metaLabel,
  name,
  statusLabel,
}: ProfileOverviewCardProps) {
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
            <Chip className="rounded-md bg-[#e6e8eb] p-0.5 text-[10px] font-medium text-slate-700 shadow-none">
              {metaLabel}
            </Chip>
            <Chip className="rounded-md bg-[#d7eef5] text-[10px] font-medium text-talimy-navy shadow-none">
              {statusLabel}
            </Chip>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
