"use client"

import { Button, Card, Chip } from "@heroui/react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@talimy/ui"

import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"

type RequestDecisionCardProps = {
  badgeLabel: string
  className?: string
  description: string
  isPrimaryActionDisabled?: boolean
  isPrimaryActionLoading?: boolean
  isSecondaryActionDisabled?: boolean
  isSecondaryActionLoading?: boolean
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  primaryActionLabel?: string
  secondaryActionLabel?: string
  title: string
}

export function RequestDecisionCard({
  badgeLabel,
  className,
  description,
  isPrimaryActionDisabled = false,
  isPrimaryActionLoading = false,
  isSecondaryActionDisabled = false,
  isSecondaryActionLoading = false,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  title,
}: RequestDecisionCardProps) {
  return (
    <Card className={cn("w-full rounded-[18px] bg-white rounded-t-none shadow-none", className)}>
      <Card.Content className="">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[16px] font-semibold leading-none text-talimy-navy">{title}</h3>

          <Button
            isIconOnly
            aria-label={`${title} actions`}
            className="size-6 min-w-6 rounded-full bg-transparent p-0 text-slate-400 shadow-none hover:bg-transparent"
            variant="ghost"
          >
            <MoreHorizontal className="size-3" />
          </Button>
        </div>

        <MutedPanelCard className="rounded-2xl border-[#f3f4f6] bg-[#fbfbf9] p-0">
          <div className="space-y-2.5">
            <Chip className="h-4 rounded-[6px] bg-talimy-pink px-1.5 text-[8px] font-medium text-talimy-navy shadow-none">
              {badgeLabel}
            </Chip>

            <p className="max-w-37 text-[10px] leading-[1.35] text-slate-600">{description}</p>

            {primaryActionLabel || secondaryActionLabel ? (
              <div className="flex items-center gap-1.5">
                {primaryActionLabel ? (
                  <Button
                    className="h-6 rounded-[10px] border-0 bg-white px-3 text-[10px] font-medium text-slate-600 shadow-none hover:bg-slate-100"
                    isDisabled={isPrimaryActionDisabled}
                    onPress={onPrimaryAction}
                    variant="secondary"
                  >
                    {isPrimaryActionLoading ? `${primaryActionLabel}...` : primaryActionLabel}
                  </Button>
                ) : null}
                {secondaryActionLabel ? (
                  <Button
                    className="h-6 rounded-[10px] bg-transparent px-1.5 text-[10px] font-medium text-slate-700 shadow-none hover:bg-transparent hover:text-slate-900"
                    isDisabled={isSecondaryActionDisabled}
                    onPress={onSecondaryAction}
                    variant="ghost"
                  >
                    {isSecondaryActionLoading ? `${secondaryActionLabel}...` : secondaryActionLabel}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </MutedPanelCard>
      </Card.Content>
    </Card>
  )
}
