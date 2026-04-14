"use client"

import type { LucideIcon } from "lucide-react"
import { Pencil } from "lucide-react"
import { Button, Card, CardContent } from "@talimy/ui"

import { PersonAvatar } from "@/components/shared/avatar/person-avatar"
import { cn } from "@/lib/utils"

export type WelcomeProfileMetaItem = {
  icon: LucideIcon
  label: string
  value: string
}

type WelcomeProfileCardProps = {
  actionLabel?: string
  avatarFallback: string
  avatarUrl?: string | null
  className?: string
  message: string
  metaItems: readonly WelcomeProfileMetaItem[]
  name: string
  onActionPress?: () => void
}

export function WelcomeProfileCard({
  actionLabel,
  avatarFallback,
  avatarUrl,
  className,
  message,
  metaItems,
  name,
  onActionPress,
}: WelcomeProfileCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[28px] border border-slate-100 bg-[#dff5ff] py-0 shadow-none",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="grid gap-4 md:grid-cols-[104px_minmax(0,1fr)] md:items-center">
          <div className="flex items-center justify-center md:justify-start">
            <PersonAvatar
              alt={name}
              className="size-24 bg-white ring-8 ring-white/70"
              fallback={avatarFallback}
              fallbackClassName="bg-[var(--talimy-color-pink)]/50 text-[30px] font-semibold text-talimy-navy"
              src={avatarUrl}
            />
          </div>

          <div className="min-w-0 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <h2 className="truncate text-[28px] leading-none font-semibold text-talimy-navy">
                  {name}
                </h2>
                <p className="max-w-[54ch] text-[13px] leading-6 text-[#567286] line-clamp-2">
                  {message}
                </p>
              </div>

              <Button
                aria-label={actionLabel}
                className="size-8 rounded-full border border-white/75 bg-white/75 p-0 text-talimy-navy shadow-none hover:bg-white"
                onClick={onActionPress}
                type="button"
                variant="ghost"
              >
                <Pencil className="size-4" />
              </Button>
            </div>

            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {metaItems.map((item) => {
                const Icon = item.icon

                return (
                  <div className="flex items-center gap-2.5" key={`${item.label}-${item.value}`}>
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/75 text-[#355574]">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#6f8798]">{item.label}</p>
                      <p className="truncate text-[12px] font-medium text-talimy-navy">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
