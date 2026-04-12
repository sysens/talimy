"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@heroui/react"
import { Skeleton } from "@talimy/ui"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { RecordsTableCard } from "@/components/shared/records/records-table-card"
import type { RecordsTableCardColumn } from "@/components/shared/records/records-table-card.types"
import { getStudentDetailBehaviorLog } from "@/components/students/detail/student-detail-api"
import type { StudentDetailBehaviorLogRecord } from "@/components/students/detail/student-detail-api.types"
import { mapBehaviorRecordDate } from "@/components/students/detail/student-detail.mappers"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"

type StudentDetailBehaviorLogSectionProps = {
  studentId: string
}

function BehaviorActionBadge({
  actionStatus,
  label,
}: {
  actionStatus: StudentDetailBehaviorLogRecord["actionStatus"]
  label: string
}) {
  const isInteractive = actionStatus === "record_recognition" || actionStatus === "issue_warning"

  return (
    <div
      className={[
        "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium",
        actionStatus === "recognition_recorded" || actionStatus === "parent_notified"
          ? "bg-[#e7f2ff] text-[#306aa5]"
          : "bg-[#f1f3f5] text-slate-700",
      ].join(" ")}
    >
      <span>{label}</span>
      {isInteractive ? <ChevronDown className="size-3.5" /> : null}
    </div>
  )
}

export function StudentDetailBehaviorLogSection({
  studentId,
}: StudentDetailBehaviorLogSectionProps) {
  const locale = useLocale()
  const t = useTranslations("adminStudents.detail.behaviorLog")
  const behaviorLogQuery = useQuery({
    queryFn: () => getStudentDetailBehaviorLog(studentId),
    queryKey: studentDetailQueryKeys.behaviorLog(studentId),
    staleTime: 60_000,
  })

  const columns = useMemo<readonly RecordsTableCardColumn<StudentDetailBehaviorLogRecord>[]>(
    () => [
      {
        key: "date",
        cellClassName: "whitespace-nowrap",
        columnClassName: "w-[16%] min-w-[140px] p-3",
        label: t("columns.date"),
        render: (record) => mapBehaviorRecordDate(locale, record.recordDate),
        sortable: true,
      },
      {
        key: "type",
        columnClassName: "w-[42%] min-w-[320px] p-3",
        label: t("columns.typeAndDetails"),
        render: (record) => (
          <div>
            <p className="text-[14px] font-semibold text-slate-800">
              {record.entryType === "positive_note"
                ? t("types.positiveNote")
                : record.entryType === "minor_issue"
                  ? t("types.minorIssue")
                  : t("types.majorIssue")}
            </p>
            <p className="max-w-[34ch] whitespace-normal text-[12px] leading-5 text-slate-500">
              {record.details}
            </p>
          </div>
        ),
        sortable: true,
      },
      {
        key: "reportedBy",
        columnClassName: "w-[18%] min-w-[150px] p-3",
        label: t("columns.reportedBy"),
        render: (record) => record.reportedByLabel,
        sortable: true,
      },
      {
        key: "statusAction",
        cellClassName: "whitespace-nowrap",
        columnClassName: "w-[24%] min-w-[190px] p-3",
        label: t("columns.statusAction"),
        render: (record) => (
          <BehaviorActionBadge
            actionStatus={record.actionStatus}
            label={
              record.actionStatus === "record_recognition"
                ? t("actions.recordRecognition")
                : record.actionStatus === "recognition_recorded"
                  ? t("actions.recognitionRecorded")
                  : record.actionStatus === "issue_warning"
                    ? t("actions.issueWarning")
                    : t("actions.parentNotified")
            }
          />
        ),
        sortable: true,
      },
    ],
    [locale, t]
  )

  if (behaviorLogQuery.isLoading) {
    return <Skeleton className="h-[360px] w-full rounded-[28px]" />
  }

  if (behaviorLogQuery.isError) {
    return null
  }

  return (
    <RecordsTableCard
      columns={columns}
      emptyState={t("empty")}
      getRowKey={(record) => record.id}
      headerEnd={
        <Button
          isIconOnly
          aria-label={t("actionLabel")}
          className="size-8 min-w-8 rounded-full bg-transparent text-slate-400 shadow-none hover:bg-slate-50"
          variant="ghost"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      }
      rows={behaviorLogQuery.data ?? []}
      tableContentClassName="min-w-[760px]"
      title={t("title")}
    />
  )
}
