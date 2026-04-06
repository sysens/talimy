"use client"

import * as React from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"
import type { TeachersFilterOption } from "@/components/teachers/list/teachers-filter-bar.types"
import { StudentsFilterBar } from "@/components/students/list/students-filter-bar"
import type {
  StudentsStatusFilter,
  StudentsTableSortDescriptor,
} from "@/components/students/list/students-list.types"
import { getStudentsList } from "@/components/students/list/students-list-api"
import { studentsListQueryKeys } from "@/components/students/list/students-list-query-keys"
import { StudentsTable } from "@/components/students/list/students-table"

const LIMIT_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "8", value: "8" },
  { label: "10", value: "10" },
  { label: "12", value: "12" },
] as const

const STATUS_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "On Leave", value: "onLeave" },
  { label: "Suspended", value: "suspended" },
] as const

export function StudentsDirectorySection() {
  const router = useRouter()
  const t = useTranslations("adminStudents.list")
  const [draftSearchValue, setDraftSearchValue] = React.useState("")
  const [searchValue, setSearchValue] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StudentsStatusFilter>("all")
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(8)
  const [sortDescriptor, setSortDescriptor] = React.useState<StudentsTableSortDescriptor>({
    column: "student",
    direction: "ascending",
  })

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchValue(draftSearchValue.trim())
      setPage(1)
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [draftSearchValue])

  const studentsQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      getStudentsList({
        limit,
        page,
        search: searchValue,
        sortDescriptor,
        status: statusFilter,
      }),
    queryKey: studentsListQueryKeys.list({
      limit,
      page,
      search: searchValue,
      sortDescriptor,
      status: statusFilter,
    }),
    staleTime: 60_000,
  })

  const items = studentsQuery.data?.data ?? []
  const meta = studentsQuery.data?.meta

  React.useEffect(() => {
    if (meta && page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, page])

  return (
    <section className="space-y-6">
      <Card className="rounded-[28px] border border-slate-100 bg-white shadow-none">
        <CardContent className="space-y-6 px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="shrink-0 text-[28px] font-semibold leading-none text-talimy-navy">
              {t("title")}
            </h2>
            <div className="min-w-0 lg:flex-1">
              <StudentsFilterBar
                addStudentLabel={t("addStudent")}
                onAddStudent={() => router.push("/admin/students/new")}
                onSearchChange={(value) => {
                  setDraftSearchValue(value)
                }}
                onStatusChange={(value) => {
                  setStatusFilter(value)
                  setPage(1)
                }}
                searchPlaceholder={t("searchPlaceholder")}
                searchValue={draftSearchValue}
                statusOptions={STATUS_OPTIONS.map((option) => ({
                  label:
                    option.value === "all"
                      ? t("filters.status.all")
                      : option.value === "active"
                        ? t("filters.status.active")
                        : option.value === "onLeave"
                          ? t("filters.status.onLeave")
                          : t("filters.status.suspended"),
                  value: option.value,
                }))}
                statusValue={statusFilter}
              />
            </div>
          </div>

          {studentsQuery.isLoading && !studentsQuery.data ? (
            <div className="space-y-3">
              {Array.from({ length: limit }, (_, index) => (
                <Skeleton className="h-14 rounded-2xl" key={`students-table-skeleton-${index}`} />
              ))}
            </div>
          ) : null}

          {!studentsQuery.isLoading && studentsQuery.isError ? (
            <div className="py-8 text-center text-sm text-slate-500">{t("states.error")}</div>
          ) : null}

          {!studentsQuery.isLoading && !studentsQuery.isError && items.length > 0 ? (
            <>
              <StudentsTable
                items={items}
                onSortChange={setSortDescriptor}
                sortDescriptor={sortDescriptor}
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
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
                  total={meta?.total ?? 0}
                />
                <TeachersPagination
                  currentPage={page}
                  nextLabel={t("pagination.next")}
                  onPageChange={setPage}
                  previousLabel={t("pagination.previous")}
                  totalPages={meta?.totalPages ?? 1}
                />
              </div>
            </>
          ) : (
            !studentsQuery.isLoading &&
            !studentsQuery.isError && (
              <div className="py-8 text-center text-sm text-slate-500">{t("states.empty")}</div>
            )
          )}
        </CardContent>
      </Card>
    </section>
  )
}
