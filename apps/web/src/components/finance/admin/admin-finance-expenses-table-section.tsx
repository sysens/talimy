"use client"

import * as React from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Button, Card, CardContent, Skeleton } from "@talimy/ui"
import { Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { AddExpenseModal } from "@/components/finance/admin/add-expense-modal"
import { getFinanceExpensesList } from "@/components/finance/admin/finance-expenses-api"
import type { FinanceExpenseCategoryFilter } from "@/components/finance/admin/finance-expenses-api.types"
import {
  buildFinanceExpenseMonthOptions,
  formatFinanceExpenseDate,
  formatUsdCurrency,
  getCurrentFinanceExpenseMonthValue,
  getFinanceExpenseCategoryTranslationKey,
} from "@/components/finance/admin/finance-expenses-formatters"
import { financeExpensesQueryKeys } from "@/components/finance/admin/finance-expenses-query-keys"
import { ExpensesTableCard } from "@/components/shared/finance/expenses-table-card"
import { FinanceFilterBar } from "@/components/shared/finance/finance-filter-bar"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"
import type { TeachersFilterOption } from "@/components/teachers/list/teachers-filter-bar.types"

const LIMIT_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "8", value: "8" },
  { label: "10", value: "10" },
  { label: "12", value: "12" },
] as const

const CATEGORY_VALUES: readonly FinanceExpenseCategoryFilter[] = [
  "all",
  "salaries",
  "supplies",
  "events",
  "maintenance",
  "others",
  "custom",
] as const

export function AdminFinanceExpensesTableSection() {
  const locale = useLocale()
  const t = useTranslations("adminFinanceExpenses.expenses")
  const [category, setCategory] = React.useState<FinanceExpenseCategoryFilter>("all")
  const [month, setMonth] = React.useState(getCurrentFinanceExpenseMonthValue())
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(8)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const expensesQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getFinanceExpensesList({ category, limit, month, page }),
    queryKey: financeExpensesQueryKeys.list({ category, limit, month, page }),
    staleTime: 30_000,
  })

  React.useEffect(() => {
    const totalPages = expensesQuery.data?.meta.totalPages
    if (typeof totalPages === "number" && page > totalPages) {
      setPage(totalPages)
    }
  }, [expensesQuery.data?.meta.totalPages, page])

  const categoryOptions = React.useMemo(
    () =>
      CATEGORY_VALUES.map((value) => ({
        label:
          value === "all"
            ? t("filters.allCategories")
            : t(`categories.${getFinanceExpenseCategoryTranslationKey(value)}`),
        value,
      })),
    [t]
  )

  const monthOptions = React.useMemo(
    () => buildFinanceExpenseMonthOptions(locale, t("filters.thisMonth")),
    [locale, t]
  )

  const filters = (
    <FinanceFilterBar
      action={
        <Button
          className="h-10 rounded-[16px] bg-talimy-pink px-4 text-[13px] font-medium text-talimy-navy shadow-none hover:bg-(--talimy-color-pink)/90"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <Plus className="mr-1 size-4" />
          {t("actions.add")}
        </Button>
      }
      items={[
        {
          ariaLabel: t("filters.categoryAriaLabel"),
          onValueChange: (value) => {
            setCategory(
              CATEGORY_VALUES.includes(value as FinanceExpenseCategoryFilter)
                ? (value as FinanceExpenseCategoryFilter)
                : "all"
            )
            setPage(1)
          },
          options: categoryOptions,
          triggerClassName: "min-w-[136px]",
          value: category,
        },
        {
          ariaLabel: t("filters.monthAriaLabel"),
          onValueChange: (value) => {
            setMonth(value)
            setPage(1)
          },
          options: monthOptions,
          triggerClassName: "min-w-[118px]",
          value: month,
        },
      ]}
    />
  )

  if (expensesQuery.isLoading && !expensesQuery.data) {
    return (
      <>
        <Card className="rounded-[28px] border border-slate-100 bg-white py-0 shadow-none">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-32 rounded-xl" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32 rounded-2xl" />
                <Skeleton className="h-10 w-28 rounded-2xl" />
              </div>
            </div>
            <Skeleton className="h-[420px] rounded-[22px]" />
          </CardContent>
        </Card>
        <AddExpenseModal month={month} onOpenChange={setIsModalOpen} open={isModalOpen} />
      </>
    )
  }

  return (
    <section className="space-y-4">
      <ExpensesTableCard
        columns={{
          amount: t("columns.amount"),
          category: t("columns.category"),
          date: t("columns.date"),
          department: t("columns.department"),
          description: t("columns.description"),
          quantity: t("columns.quantity"),
        }}
        emptyLabel={expensesQuery.isError ? t("states.loadError") : t("states.empty")}
        filters={filters}
        formatAmount={(value) => formatUsdCurrency(locale, value)}
        formatDate={(value) => formatFinanceExpenseDate(locale, value)}
        getCategoryLabel={(value) =>
          t(`categories.${getFinanceExpenseCategoryTranslationKey(value)}`)
        }
        getDepartmentLabel={(val) => {
          const keyMap: Record<string, string> = {
            Mathematics: "mathematics",
            Science: "science",
            Language: "language",
            Social: "social",
            Arts: "arts",
            "Physical Education": "physicalEducation",
            Other: "other",
          }
          const key = keyMap[val]
          return key ? t(`departments.${key}`) : val
        }}
        rows={expensesQuery.data?.rows ?? []}
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
          total={expensesQuery.data?.meta.total ?? 0}
        />
        <TeachersPagination
          currentPage={page}
          nextLabel={t("pagination.next")}
          onPageChange={setPage}
          previousLabel={t("pagination.previous")}
          totalPages={expensesQuery.data?.meta.totalPages ?? 1}
        />
      </div>

      <AddExpenseModal month={month} onOpenChange={setIsModalOpen} open={isModalOpen} />
    </section>
  )
}
