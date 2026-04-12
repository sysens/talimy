"use client"

import * as React from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { sileo } from "sileo"

import type {
  AdminAttendanceCellChange,
  AdminAttendanceEntityType,
} from "@/components/attendance/admin/admin-attendance-api.types"
import {
  getAdminAttendanceGrid,
  getAdminAttendanceOptions,
  markAdminAttendance,
} from "@/components/attendance/admin/admin-attendance-api"
import { adminAttendanceQueryKeys } from "@/components/attendance/admin/admin-attendance-query-keys"
import { AdminAttendanceTabsBar } from "@/components/attendance/admin/admin-attendance-tabs-bar"
import { AttendanceRosterGridCard } from "@/components/shared/attendance/attendance-roster-grid-card"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"
import type { TeachersFilterOption } from "@/components/teachers/list/teachers-filter-bar.types"
import { formatMonthShort } from "@/lib/dashboard/dashboard-formatters"

const LIMIT_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
] as const

function formatMonthLabel(locale: string, value: string): string {
  const [yearText, monthText] = value.split("-")
  const monthNumber = Number(monthText)

  return `${formatMonthShort(locale, monthNumber)} ${yearText}`
}

export function AdminAttendanceGridSection() {
  const locale = useLocale()
  const t = useTranslations("adminAttendance")
  const queryClient = useQueryClient()
  const [type, setType] = React.useState<AdminAttendanceEntityType>("students")
  const [month, setMonth] = React.useState(() => new Date().toISOString().slice(0, 7))
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [selectedClassId, setSelectedClassId] = React.useState<string | undefined>(undefined)
  const [selectedDepartment, setSelectedDepartment] = React.useState<string | undefined>(undefined)

  const optionsQuery = useQuery({
    queryFn: getAdminAttendanceOptions,
    queryKey: adminAttendanceQueryKeys.options(),
    staleTime: 300_000,
  })

  React.useEffect(() => {
    if (!selectedClassId && optionsQuery.data?.classes[0]?.id) {
      setSelectedClassId(optionsQuery.data.classes[0].id)
    }
  }, [optionsQuery.data?.classes, selectedClassId])

  const gridQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      getAdminAttendanceGrid({
        classId: type === "students" ? selectedClassId : undefined,
        department: type === "teachers" ? selectedDepartment : undefined,
        limit,
        month,
        page,
        type,
      }),
    queryKey: adminAttendanceQueryKeys.grid({
      classId: type === "students" ? selectedClassId : undefined,
      department: type === "teachers" ? selectedDepartment : undefined,
      limit,
      month,
      page,
      type,
    }),
    staleTime: 30_000,
  })

  React.useEffect(() => {
    if (
      type === "students" &&
      gridQuery.data?.classId &&
      gridQuery.data.classId !== selectedClassId
    ) {
      setSelectedClassId(gridQuery.data.classId)
    }
  }, [gridQuery.data?.classId, selectedClassId, type])

  const markMutation = useMutation({
    mutationFn: markAdminAttendance,
    onError: () => {
      sileo.error({
        description: t("toasts.markErrorDescription"),
        title: t("toasts.markErrorTitle"),
      })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminAttendanceQueryKeys.grid({
            classId: type === "students" ? selectedClassId : undefined,
            department: type === "teachers" ? selectedDepartment : undefined,
            limit,
            month,
            page,
            type,
          }),
        }),
        queryClient.invalidateQueries({ queryKey: ["admin-attendance", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-attendance", "trends"] }),
      ])
    },
  })

  const classOptions = React.useMemo(
    () => (optionsQuery.data?.classes ?? []).map((item) => ({ label: item.label, value: item.id })),
    [optionsQuery.data?.classes]
  )
  const departmentOptions = React.useMemo(() => {
    const options = (optionsQuery.data?.departments ?? []).map((item) => ({
      label: item.label,
      value: item.id,
    }))

    return [{ label: t("filters.allDepartments"), value: "all" }, ...options]
  }, [optionsQuery.data?.departments, t])
  const monthOptions = React.useMemo(
    () =>
      (optionsQuery.data?.months ?? []).map((item) => ({
        label: formatMonthLabel(locale, item.value),
        value: item.value,
      })),
    [locale, optionsQuery.data?.months]
  )

  function handleTypeChange(nextType: AdminAttendanceEntityType): void {
    setType(nextType)
    setPage(1)
  }

  function handleCellChange(change: AdminAttendanceCellChange): void {
    void markMutation.mutateAsync({
      date: change.columnId,
      records: [
        {
          entityId: change.rowId,
          note: change.note,
          status: change.status,
        },
      ],
      type,
    })
  }

  const gridData = gridQuery.data

  return (
    <Card className="rounded-[28px] border border-slate-100 py-0 bg-white shadow-none">
      <CardContent className="space-y-5 px-5 py-5">
        <AdminAttendanceTabsBar
          activeType={type}
          classOptions={classOptions}
          departmentOptions={departmentOptions}
          monthOptions={monthOptions}
          monthValue={month}
          onClassChange={(value) => {
            setSelectedClassId(value)
            setPage(1)
          }}
          onDepartmentChange={(value) => {
            setSelectedDepartment(value === "all" ? undefined : value)
            setPage(1)
          }}
          onMonthChange={(value) => {
            setMonth(value)
            setPage(1)
          }}
          onTypeChange={handleTypeChange}
          selectedClassId={selectedClassId}
          selectedDepartment={selectedDepartment ?? "all"}
          tabLabels={{
            staff: t("filters.tabs.staff"),
            students: t("filters.tabs.students"),
            teachers: t("filters.tabs.teachers"),
          }}
        />

        {gridQuery.isLoading && !gridData ? <Skeleton className="h-160 rounded-[24px]" /> : null}

        {!gridQuery.isLoading && gridQuery.isError ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
            {t("states.loadError")}
          </div>
        ) : null}

        {!gridQuery.isLoading && !gridQuery.isError && gridData ? (
          <>
            <AttendanceRosterGridCard
              ariaLabel={t("grid.ariaLabel")}
              className="border-0 bg-transparent"
              columns={gridData.columns}
              emptyState={
                type === "students"
                  ? t("grid.empty.students")
                  : type === "teachers"
                    ? t("grid.empty.teachers")
                    : t("grid.empty.staff")
              }
              labels={{
                cancel: t("grid.editor.cancel"),
                editorDescription: t("grid.editor.description"),
                editorTitle: t("grid.editor.title"),
                reasonPlaceholder: t("grid.editor.reasonPlaceholder"),
                save: t("grid.editor.save"),
              }}
              locale={locale}
              onCellChange={handleCellChange}
              profileColumnLabel={
                type === "students"
                  ? t("grid.profile.students")
                  : type === "teachers"
                    ? t("grid.profile.teachers")
                    : t("grid.profile.staff")
              }
              rows={gridData.rows}
              statusLabels={{
                absent: t("grid.statuses.absent"),
                holiday: t("grid.statuses.holiday"),
                late: t("grid.statuses.late"),
                on_time: t("grid.statuses.onTime"),
                weekend: t("grid.statuses.weekend"),
              }}
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
                total={gridData.meta.total}
              />
              <TeachersPagination
                currentPage={gridData.meta.page}
                nextLabel={t("pagination.next")}
                onPageChange={setPage}
                previousLabel={t("pagination.previous")}
                totalPages={gridData.meta.totalPages}
              />
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
