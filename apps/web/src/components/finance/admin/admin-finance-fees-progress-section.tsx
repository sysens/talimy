"use client"

import { Skeleton } from "@talimy/ui"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"

import { getFinanceFeesProgress } from "@/components/finance/admin/finance-fees-api"
import {
  formatPercentage,
  formatUsdCurrency,
  getFinanceFeeCategoryTranslationKey,
} from "@/components/finance/admin/finance-fees-formatters"
import { financeFeesQueryKeys } from "@/components/finance/admin/finance-fees-query-keys"
import { FeesProgressCard } from "@/components/shared/finance/fees-progress-card"

export function AdminFinanceFeesProgressSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinancePayments.progress")
  const progressQuery = useQuery({
    queryFn: () => getFinanceFeesProgress(),
    queryKey: financeFeesQueryKeys.progress(),
    staleTime: 60_000,
  })

  if (progressQuery.isLoading && !progressQuery.data) {
    return <Skeleton className="h-[256px] rounded-[28px]" />
  }

  if (!progressQuery.data) {
    return null
  }

  return (
    <FeesProgressCard
      actionLabel={t("actionLabel")}
      items={progressQuery.data.categories.map((category) => ({
        collectedLabel: t("collectedLabel", {
          collected: formatUsdCurrency(locale, category.collectedAmount),
          total: formatUsdCurrency(locale, category.targetAmount),
        }),
        id: category.categoryId,
        label: t(`categories.${getFinanceFeeCategoryTranslationKey(category.categoryId)}`),
        progressLabel: formatPercentage(category.progressPercentage),
        progressPercentage: category.progressPercentage,
      }))}
      title={t("title")}
    />
  )
}
