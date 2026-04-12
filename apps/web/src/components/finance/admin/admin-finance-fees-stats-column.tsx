"use client"

import { AlertCircle, BadgeCheck, Hourglass } from "lucide-react"
import { Skeleton, StatCard } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getFinanceFeesSummary } from "@/components/finance/admin/finance-fees-api"
import { formatUsdCurrency } from "@/components/finance/admin/finance-fees-formatters"
import { financeFeesQueryKeys } from "@/components/finance/admin/finance-fees-query-keys"

const CARD_CONFIG = [
  { icon: BadgeCheck, key: "collected", tone: "navy" },
  { icon: Hourglass, key: "pending", tone: "sky" },
  { icon: AlertCircle, key: "overdue", tone: "pink" },
] as const

export function AdminFinanceFeesStatsColumn() {
  const locale = useLocale()
  const t = useTranslations("adminFinancePayments.stats")
  const summaryQuery = useQuery({
    queryFn: () => getFinanceFeesSummary(),
    queryKey: financeFeesQueryKeys.summary(),
    staleTime: 60_000,
  })

  if (summaryQuery.isLoading && !summaryQuery.data) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton className="h-[92px] rounded-[24px]" key={`finance-stat-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  if (!summaryQuery.data) {
    return null
  }

  return (
    <div className="space-y-4">
      {CARD_CONFIG.map((card) => (
        <StatCard
          className="min-h-[92px]"
          icon={card.icon}
          key={card.key}
          title={t(card.key)}
          tone={card.tone}
          value={formatUsdCurrency(locale, summaryQuery.data.amounts[card.key])}
          variant="finance"
        />
      ))}
    </div>
  )
}
