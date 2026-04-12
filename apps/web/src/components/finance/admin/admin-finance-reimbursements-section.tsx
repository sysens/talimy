"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { sileo } from "sileo"

import {
  getFinanceReimbursements,
  updateFinanceReimbursementStatus,
} from "@/components/finance/admin/finance-expenses-api"
import {
  formatFinanceExpenseDate,
  formatUsdCurrency,
  getFinanceReimbursementStatusTranslationKey,
} from "@/components/finance/admin/finance-expenses-formatters"
import { financeExpensesQueryKeys } from "@/components/finance/admin/finance-expenses-query-keys"
import { FinanceFilterBar } from "@/components/shared/finance/finance-filter-bar"
import { ReimbursementsTableCard } from "@/components/shared/finance/reimbursements-table-card"

export function AdminFinanceReimbursementsSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinanceExpenses.reimbursements")
  const queryClient = useQueryClient()
  const [week, setWeek] = React.useState<"current" | "previous">("current")

  const reimbursementsQuery = useQuery({
    queryFn: () => getFinanceReimbursements(week),
    queryKey: financeExpensesQueryKeys.reimbursements(week),
    staleTime: 30_000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "declined" }) =>
      updateFinanceReimbursementStatus(id, status),
    onError: () => {
      sileo.error({
        description: t("toasts.errorDescription"),
        title: t("toasts.errorTitle"),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: financeExpensesQueryKeys.reimbursements(week),
      })
      sileo.success({
        description: t("toasts.successDescription"),
        title: t("toasts.successTitle"),
      })
    },
  })

  const filters = (
    <FinanceFilterBar
      items={[
        {
          ariaLabel: t("filterAriaLabel"),
          onValueChange: (value) => setWeek(value === "previous" ? "previous" : "current"),
          options: [
            { label: t("periods.thisWeek"), value: "current" },
            { label: t("periods.previousWeek"), value: "previous" },
          ],
          triggerClassName: "min-w-[118px]",
          value: week,
        },
      ]}
    />
  )

  if (reimbursementsQuery.isLoading && !reimbursementsQuery.data) {
    return (
      <Card className="rounded-[28px] border border-slate-100 bg-white py-0 shadow-none">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-52 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-2xl" />
          </div>
          <Skeleton className="h-[300px] rounded-[22px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <ReimbursementsTableCard
      actionLabels={{
        approve: t("actions.approve"),
        decline: t("actions.decline"),
        viewFile: t("actions.viewFile"),
      }}
      columns={{
        amount: t("columns.amount"),
        datePaid: t("columns.datePaid"),
        proof: t("columns.proof"),
        requestName: t("columns.requestName"),
        staffName: t("columns.staffName"),
        status: t("columns.status"),
      }}
      emptyLabel={reimbursementsQuery.isError ? t("states.loadError") : t("states.empty")}
      filters={filters}
      formatCurrency={(value) => formatUsdCurrency(locale, value)}
      formatDate={(value) => formatFinanceExpenseDate(locale, value)}
      getDepartmentLabel={(val) => {
        const keyMap: Record<string, string> = {
          Mathematics: "mathematics",
          Science: "science",
          Language: "language",
          Social: "social",
          "Social Studies": "social",
          Arts: "arts",
          "Physical Education": "physicalEducation",
          "Physical Ed.": "physicalEducation",
          Other: "other",
        }
        const key = keyMap[val]
        return key ? t(`departments.${key}`) : val
      }}
      getStatusLabel={(status) =>
        t(`statuses.${getFinanceReimbursementStatusTranslationKey(status)}`)
      }
      onStatusChange={(id, status) => updateMutation.mutate({ id, status })}
      rows={reimbursementsQuery.data?.rows ?? []}
      title={t("title")}
    />
  )
}
