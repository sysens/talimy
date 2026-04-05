"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Card, CardContent, Skeleton } from "@talimy/ui"

import { TeachersFilterBar } from "@/components/teachers/list/teachers-filter-bar"
import type { TeachersFilterOption } from "@/components/teachers/list/teachers-filter-bar.types"
import { TeachersGrid } from "@/components/teachers/list/teachers-grid"
import { getTeachersList } from "@/components/teachers/list/teachers-list-api"
import type { TeachersListDepartmentKey } from "@/components/teachers/list/teachers-list-api.types"
import { teacherListQueryKeys } from "@/components/teachers/list/teachers-list-query-keys"
import {
  getTeachersPageSizeOptions,
  parseTeachersListRequest,
  serializeTeachersFilterState,
  toTeachersFilterState,
  updateTeachersListSearchParams,
} from "@/components/teachers/list/teachers-list-search-params"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"

type DepartmentKey = Exclude<TeachersListDepartmentKey, "other">

const DEPARTMENT_KEYS: readonly DepartmentKey[] = [
  "science",
  "mathematics",
  "language",
  "social",
  "arts",
  "physicalEducation",
] as const

export function TeachersDirectorySection() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("adminTeachers.list")
  const tDepartments = useTranslations("adminTeachers.overview.workload.departments")

  const request = React.useMemo(() => parseTeachersListRequest(searchParams), [searchParams])
  const [draftSearch, setDraftSearch] = React.useState(request.search)

  React.useEffect(() => {
    setDraftSearch(request.search)
  }, [request.search])

  const departmentOptions = React.useMemo<readonly TeachersFilterOption[]>(
    () =>
      DEPARTMENT_KEYS.map((departmentKey) => ({
        label: tDepartments(departmentKey),
        value: departmentKey,
      })),
    [tDepartments]
  )

  const statusOptions = React.useMemo<readonly TeachersFilterOption[]>(
    () => [
      { label: t("filters.status.active"), value: "active" },
      { label: t("filters.status.inactive"), value: "inactive" },
      { label: t("filters.status.onLeave"), value: "on_leave" },
    ],
    [t]
  )

  const genderOptions = React.useMemo<readonly TeachersFilterOption[]>(
    () => [
      { label: t("filters.gender.male"), value: "male" },
      { label: t("filters.gender.female"), value: "female" },
    ],
    [t]
  )

  const sortOptions = React.useMemo<readonly TeachersFilterOption[]>(
    () => [
      { label: t("sort.latest"), value: "latest" },
      { label: t("sort.oldest"), value: "oldest" },
      { label: t("sort.nameAsc"), value: "nameAsc" },
    ],
    [t]
  )

  const limitOptions = React.useMemo<readonly TeachersFilterOption[]>(
    () =>
      getTeachersPageSizeOptions().map((size) => ({
        label: String(size),
        value: String(size),
      })),
    []
  )

  const replaceSearchParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const nextSearch = updateTeachersListSearchParams(searchParams, updates)
      router.replace(`${pathname}${nextSearch}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  React.useEffect(() => {
    const handler = window.setTimeout(() => {
      if (draftSearch.trim() === request.search) {
        return
      }

      replaceSearchParams({
        page: "1",
        search: draftSearch.trim().length > 0 ? draftSearch.trim() : null,
      })
    }, 300)

    return () => {
      window.clearTimeout(handler)
    }
  }, [draftSearch, replaceSearchParams, request.search])

  const teachersQuery = useQuery({
    placeholderData: keepPreviousData,
    queryKey: teacherListQueryKeys.list(locale, request),
    queryFn: () => getTeachersList(request),
    staleTime: 60_000,
  })

  const filters = React.useMemo(() => toTeachersFilterState(request), [request])

  function handleFiltersChange(nextFilters: typeof filters): void {
    replaceSearchParams({
      ...serializeTeachersFilterState(nextFilters),
      page: "1",
    })
  }

  function handleSortChange(value: string): void {
    replaceSearchParams({
      page: "1",
      sort: value,
    })
  }

  function handlePageChange(page: number): void {
    replaceSearchParams({ page: String(page) })
  }

  function handleLimitChange(value: string): void {
    replaceSearchParams({
      limit: value,
      page: "1",
    })
  }

  function handleAddTeacher(): void {
    router.push("/admin/teachers/new")
  }

  const teachers = teachersQuery.data?.data ?? []
  const meta = teachersQuery.data?.meta

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-semibold leading-none text-talimy-navy">{t("title")}</h1>

        <div className="min-w-0 flex-1">
          <TeachersFilterBar
            addTeacherLabel={t("addTeacher")}
            applyFiltersLabel={t("filters.actions.apply")}
            clearFiltersLabel={t("filters.actions.clear")}
            departmentOptions={departmentOptions}
            departmentLabel={t("filters.department")}
            filters={filters}
            filterButtonLabel={t("filterButton")}
            filterTitle={t("filterTitle")}
            genderLabel={t("filters.genderLabel")}
            genderOptions={genderOptions}
            onAddTeacher={handleAddTeacher}
            onFiltersChange={handleFiltersChange}
            onSearchChange={setDraftSearch}
            onSortChange={handleSortChange}
            searchPlaceholder={t("searchPlaceholder")}
            searchValue={draftSearch}
            statusLabel={t("filters.statusLabel")}
            sortLabel={t("sortLabel")}
            sortOptions={sortOptions}
            sortValue={request.sort}
            statusOptions={statusOptions}
          />
        </div>
      </div>

      {teachersQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: request.limit }, (_, index) => (
            <Skeleton className="h-55 rounded-[28px]" key={`teacher-card-skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {!teachersQuery.isLoading && teachersQuery.isError ? (
        <Card className="rounded-[28px] border border-rose-100 bg-rose-50/70 shadow-none">
          <CardContent className="px-5 py-4 text-sm text-rose-600">{t("states.error")}</CardContent>
        </Card>
      ) : null}

      {!teachersQuery.isLoading && !teachersQuery.isError && teachers.length === 0 ? (
        <Card className="rounded-[28px] border border-slate-100 bg-white shadow-none ">
          <CardContent className="px-5 py-8 text-center text-sm text-slate-500">
            {t("states.empty")}
          </CardContent>
        </Card>
      ) : null}

      {!teachersQuery.isLoading && !teachersQuery.isError && teachers.length > 0 ? (
        <>
          <TeachersGrid items={teachers} messageLabel={t("message")} />

          {meta ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <TeachersResultsSummary
                limit={meta.limit}
                limitOptions={limitOptions}
                ofLabel={t("pagination.of")}
                onLimitChange={handleLimitChange}
                resultsLabel={t("pagination.results")}
                showLabel={t("pagination.show")}
                total={meta.total}
              />

              <TeachersPagination
                currentPage={meta.page}
                nextLabel={t("pagination.next")}
                onPageChange={handlePageChange}
                previousLabel={t("pagination.previous")}
                totalPages={meta.totalPages}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
