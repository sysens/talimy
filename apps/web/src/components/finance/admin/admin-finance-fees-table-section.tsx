"use client"

import * as React from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { getFinanceFeesList } from "@/components/finance/admin/finance-fees-api"
import type { FinanceFeeStatus } from "@/components/finance/admin/finance-fees-api.types"
import {
  buildFinanceMonthOptions,
  formatFinanceDate,
  formatUsdCurrency,
  getCurrentFinanceMonthValue,
  getFinanceFeeCategoryTranslationKey,
  getFinanceFeeStatusTranslationKey,
} from "@/components/finance/admin/finance-fees-formatters"
import { financeFeesQueryKeys } from "@/components/finance/admin/finance-fees-query-keys"
import { FinanceFilterBar } from "@/components/shared/finance/finance-filter-bar"
import { FeesCollectionTable } from "@/components/shared/finance/fees-collection-table"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"
import type { TeachersFilterOption } from "@/components/teachers/list/teachers-filter-bar.types"

const LIMIT_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "5", value: "5" },
  { label: "8", value: "8" },
  { label: "10", value: "10" },
] as const

const STATUS_VALUES: readonly ["all", ...FinanceFeeStatus[]] = [
  "all",
  "paid",
  "pending",
  "overdue",
  "partially_paid",
] as const

function isFinanceStatusValue(value: string): value is (typeof STATUS_VALUES)[number] {
  return STATUS_VALUES.includes(value as (typeof STATUS_VALUES)[number])
}

export function AdminFinanceFeesTableSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinancePayments.table")
  const [classId, setClassId] = React.useState("all")
  const [status, setStatus] = React.useState<(typeof STATUS_VALUES)[number]>("all")
  const [month, setMonth] = React.useState(getCurrentFinanceMonthValue())
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(5)

  const feesQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      getFinanceFeesList({
        classId: classId === "all" ? undefined : classId,
        limit,
        month,
        page,
        status,
      }),
    queryKey: financeFeesQueryKeys.list({
      classId: classId === "all" ? undefined : classId,
      limit,
      month,
      page,
      status,
    }),
    staleTime: 60_000,
  })

  React.useEffect(() => {
    const totalPages = feesQuery.data?.meta.totalPages

    if (typeof totalPages === "number" && page > totalPages) {
      setPage(totalPages)
    }
  }, [feesQuery.data?.meta.totalPages, page])

  const classOptions = React.useMemo<readonly { label: string; value: string }[]>(
    () => [
      { label: t("filters.allClasses"), value: "all" },
      ...(feesQuery.data?.classOptions ?? []).map((option) => ({
        label: option.label,
        value: option.id,
      })),
    ],
    [feesQuery.data?.classOptions, t]
  )

  const statusOptions = React.useMemo(
    () =>
      STATUS_VALUES.map((value) => ({
        label:
          value === "all"
            ? t("filters.allStatuses")
            : t(`statuses.${getFinanceFeeStatusTranslationKey(value)}`),
        value,
      })),
    [t]
  )

  const monthOptions = React.useMemo(
    () => buildFinanceMonthOptions(locale, t("filters.thisMonth")),
    [locale, t]
  )

  const filters = (
    <FinanceFilterBar
      items={[
        {
          ariaLabel: t("filters.classAriaLabel"),
          onValueChange: (value) => {
            setClassId(value)
            setPage(1)
          },
          options: classOptions,
          triggerClassName: "min-w-[132px]",
          value: classId,
        },
        {
          ariaLabel: t("filters.statusAriaLabel"),
          onValueChange: (value) => {
            if (isFinanceStatusValue(value)) {
              setStatus(value)
              setPage(1)
            }
          },
          options: statusOptions,
          triggerClassName: "min-w-[128px]",
          value: status,
        },
        {
          ariaLabel: t("filters.monthAriaLabel"),
          onValueChange: (value) => {
            setMonth(value)
            setPage(1)
          },
          options: monthOptions,
          triggerClassName: "min-w-[124px]",
          value: month,
        },
      ]}
    />
  )

  if (feesQuery.isLoading && !feesQuery.data) {
    return (
      <Card className="rounded-[28px] border border-slate-100 bg-white shadow-none">
        <CardContent className="space-y-5 p-5 ">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-[18px] font-semibold text-talimy-navy">{t("title")}</h3>
            {filters}
          </div>
          <div className="space-y-3">
            {Array.from({ length: limit + 1 }, (_, index) => (
              <Skeleton className="h-12 rounded-2xl" key={`finance-fees-row-skeleton-${index}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      <FeesCollectionTable
        columns={{
          classLabel: t("columns.classLabel"),
          dueDate: t("columns.dueDate"),
          feeCategory: t("columns.feeCategory"),
          status: t("columns.status"),
          student: t("columns.student"),
          totalAmount: t("columns.totalAmount"),
        }}
        emptyLabel={feesQuery.isError ? t("states.loadError") : t("states.empty")}
        filters={filters}
        formatDueDate={(value) => formatFinanceDate(locale, value)}
        formatMoney={(value) => formatUsdCurrency(locale, value)}
        getCategoryLabel={(categoryId) =>
          t(`categories.${getFinanceFeeCategoryTranslationKey(categoryId)}`)
        }
        getStatusLabel={(feeStatus) =>
          t(`statuses.${getFinanceFeeStatusTranslationKey(feeStatus)}`)
        }
        rows={feesQuery.data?.rows ?? []}
        title={t("title")}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <TeachersResultsSummary
          limit={limit}
          limitOptions={LIMIT_OPTIONS}
          ofLabel={t("pagination.of")}
          onLimitChange={(value) => {
            setLimit(Number(value))
            setPage(1)
          }}
          resultsLabel={t("pagination.results")}
          showLabel={t("pagination.show")}
          total={feesQuery.data?.meta.total ?? 0}
        />
        <TeachersPagination
          currentPage={page}
          nextLabel={t("pagination.next")}
          onPageChange={setPage}
          previousLabel={t("pagination.previous")}
          totalPages={feesQuery.data?.meta.totalPages ?? 1}
        />
      </div>
    </section>
  )
}
