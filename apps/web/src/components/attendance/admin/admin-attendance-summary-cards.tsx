"use client"

import { BriefcaseBusiness, Clock3, UsersRound } from "lucide-react"
import { Skeleton } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getAdminAttendanceSummary } from "@/components/attendance/admin/admin-attendance-api"
import { adminAttendanceQueryKeys } from "@/components/attendance/admin/admin-attendance-query-keys"
import type {
  AdminAttendanceEntityType,
  AdminAttendanceSummaryDate,
} from "@/components/attendance/admin/admin-attendance-api.types"
import { SummaryBreakdownCard } from "@/components/shared/cards/summary-breakdown-card"

const CARD_VARIANTS: Record<AdminAttendanceEntityType, "navy" | "pink" | "sky"> = {
  staff: "navy",
  students: "pink",
  teachers: "sky",
}

const CARD_ICONS = {
  staff: BriefcaseBusiness,
  students: UsersRound,
  teachers: Clock3,
} as const

function formatCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(value)
}

function formatShare(value: number): string {
  return `${value.toFixed(1)}%`
}

type AdminAttendanceSummaryCardsProps = {
  date: AdminAttendanceSummaryDate
}

export function AdminAttendanceSummaryCards({ date }: AdminAttendanceSummaryCardsProps) {
  const locale = useLocale()
  const t = useTranslations("adminAttendance.summary")
  const summaryQuery = useQuery({
    queryFn: () => getAdminAttendanceSummary(date),
    queryKey: adminAttendanceQueryKeys.summary(date),
    staleTime: 60_000,
  })

  if (summaryQuery.isLoading && !summaryQuery.data) {
    return (
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton
            className="h-[210px] rounded-[22px]"
            key={`attendance-summary-skeleton-${index}`}
          />
        ))}
      </div>
    )
  }

  if (!summaryQuery.data) {
    return null
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {summaryQuery.data.cards.map((card) => {
        const Icon = CARD_ICONS[card.key]

        return (
          <SummaryBreakdownCard
            accentIcon={Icon}
            key={card.key}
            metrics={[
              {
                id: `${card.key}-on-time`,
                label: t("metrics.onTime"),
                share: formatShare(card.onTimeShare),
                value: formatCount(card.onTimeCount, locale),
              },
              {
                id: `${card.key}-late`,
                label: t("metrics.late"),
                share: formatShare(card.lateShare),
                value: formatCount(card.lateCount, locale),
              },
              {
                id: `${card.key}-absent`,
                label: t("metrics.absent"),
                share: formatShare(card.absentShare),
                value: formatCount(card.absentCount, locale),
              },
            ]}
            title={t(`titles.${card.key}`)}
            totalChangeLabel={formatShare(card.totalChangePercentage)}
            totalLabel={t("totalLabel")}
            totalValue={formatCount(card.totalPresent, locale)}
            variant={CARD_VARIANTS[card.key]}
            watermarkIcon={Icon}
          />
        )
      })}
    </div>
  )
}
