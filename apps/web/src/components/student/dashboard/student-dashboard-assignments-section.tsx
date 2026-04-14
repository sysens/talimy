"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { getStudentDashboardAssignments } from "@/components/student/dashboard/student-dashboard-api"
import { mapStudentAssignmentsRows } from "@/components/student/dashboard/student-dashboard.mappers"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { AssignmentsPreviewTableCard } from "@/components/shared/assignments/assignments-preview-table-card"
import type { AppLocale } from "@/config/site"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"

const LIMIT_OPTIONS = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
] as const

export function StudentDashboardAssignmentsSection() {
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const t = useTranslations("studentDashboard.assignments")
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(5)
  const [search, setSearch] = React.useState("")

  const assignmentsQuery = useQuery({
    queryFn: () => getStudentDashboardAssignments({ limit, page, search }),
    queryKey: studentDashboardQueryKeys.assignments(page, limit, search),
    staleTime: 60_000,
  })

  React.useEffect(() => {
    setPage(1)
  }, [limit, search])

  if (assignmentsQuery.isLoading) {
    return <Skeleton className="h-[420px] rounded-[28px]" />
  }

  if (!assignmentsQuery.data) {
    return null
  }

  const rows = mapStudentAssignmentsRows(
    locale,
    {
      inProgress: t("statuses.inProgress"),
      notStarted: t("statuses.notStarted"),
      submitted: t("statuses.submitted"),
    },
    assignmentsQuery.data
  )

  return (
    <div className="space-y-4">
      <AssignmentsPreviewTableCard
        actionLabel={t("addLabel")}
        columns={{
          action: t("columns.action"),
          dueDate: t("columns.dueDate"),
          no: t("columns.no"),
          status: t("columns.status"),
          subject: t("columns.subject"),
          task: t("columns.task"),
          time: t("columns.time"),
        }}
        emptyLabel={t("empty")}
        onActionPress={() => router.push("/student/assignments")}
        onEdit={(rowId) => router.push(`/student/assignments/${rowId}`)}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchPlaceholder")}
        searchValue={search}
        rows={rows}
        title={t("title")}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <TeachersResultsSummary
          limit={limit}
          limitOptions={LIMIT_OPTIONS}
          ofLabel={t("summary.of")}
          onLimitChange={(value) => {
            const nextLimit = Number(value)
            if (Number.isFinite(nextLimit) && nextLimit > 0) {
              setLimit(nextLimit)
            }
          }}
          resultsLabel={t("summary.results")}
          showLabel={t("summary.show")}
          total={assignmentsQuery.data.meta.total}
        />
        <TeachersPagination
          currentPage={assignmentsQuery.data.meta.page}
          nextLabel={t("pagination.next")}
          onPageChange={setPage}
          previousLabel={t("pagination.previous")}
          totalPages={assignmentsQuery.data.meta.totalPages}
        />
      </div>
    </div>
  )
}
