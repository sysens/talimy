"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { getFinanceExpensesBreakdown } from "@/components/finance/admin/finance-expenses-api"
import {
  formatUsdCurrency,
  getFinanceExpenseCategoryTranslationKey,
} from "@/components/finance/admin/finance-expenses-formatters"
import { financeExpensesQueryKeys } from "@/components/finance/admin/finance-expenses-query-keys"
import { ExpenseBreakdownDonutCard } from "@/components/shared/finance/expense-breakdown-donut-card"

const BREAKDOWN_COLORS: Record<string, string> = {
  events: "#cfeef8",
  maintenance: "#f5b6ff",
  others: "#ececec",
  salaries: "var(--talimy-color-navy)",
  supplies: "var(--talimy-color-pink)",
}

export function AdminFinanceExpenseBreakdownSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinanceExpenses.breakdown")
  const breakdownQuery = useQuery({
    queryFn: getFinanceExpensesBreakdown,
    queryKey: financeExpensesQueryKeys.breakdown(),
    staleTime: 60_000,
  })

  if (breakdownQuery.isLoading && !breakdownQuery.data) {
    return (
      <Card className="rounded-[28px] border border-slate-100 bg-white py-0 shadow-none">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-44 rounded-xl" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <Skeleton className="h-[212px] rounded-[22px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <ExpenseBreakdownDonutCard
      actionLabel={t("actionLabel")}
      amountFormatter={(value) => formatUsdCurrency(locale, value)}
      items={
        breakdownQuery.data?.items.map((item) => ({
          amount: item.amount,
          categoryId: item.categoryId,
          color: BREAKDOWN_COLORS[item.categoryId] ?? "var(--talimy-color-gray)",
          label: t(`categories.${getFinanceExpenseCategoryTranslationKey(item.categoryId)}`),
          percentage: item.percentage,
        })) ?? []
      }
      title={t("title")}
      totalAmountLabel={t("totalLabel")}
      totalAmountValue={formatUsdCurrency(locale, breakdownQuery.data?.totalAmount ?? 0)}
    />
  )
}
