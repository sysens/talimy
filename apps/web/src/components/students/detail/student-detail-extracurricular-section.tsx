"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@heroui/react"
import { Skeleton } from "@talimy/ui"
import { Bot, MoreHorizontal, PersonStanding, Shapes, Waves } from "lucide-react"
import { useTranslations } from "next-intl"

import { RecordsTableCard } from "@/components/shared/records/records-table-card"
import type { RecordsTableCardColumn } from "@/components/shared/records/records-table-card.types"
import { getStudentDetailExtracurricular } from "@/components/students/detail/student-detail-api"
import type { StudentDetailExtracurricularRecord } from "@/components/students/detail/student-detail-api.types"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"

type StudentDetailExtracurricularSectionProps = {
  studentId: string
}

function ExtracurricularIcon({
  iconKey,
}: {
  iconKey: StudentDetailExtracurricularRecord["iconKey"]
}) {
  const Icon =
    iconKey === "swimming"
      ? Waves
      : iconKey === "dance"
        ? PersonStanding
        : iconKey === "robotics"
          ? Bot
          : Shapes

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-[#d9f1f7] text-talimy-navy">
      <Icon className="size-4.5" />
    </div>
  )
}

export function StudentDetailExtracurricularSection({
  studentId,
}: StudentDetailExtracurricularSectionProps) {
  const t = useTranslations("adminStudents.detail.extracurricular")
  const extracurricularQuery = useQuery({
    queryFn: () => getStudentDetailExtracurricular(studentId),
    queryKey: studentDetailQueryKeys.extracurricular(studentId),
    staleTime: 60_000,
  })

  const columns = useMemo<readonly RecordsTableCardColumn<StudentDetailExtracurricularRecord>[]>(
    () => [
      {
        key: "club",
        label: t("columns.club"),
        render: (record) => (
          <div className="flex items-center gap-3">
            <ExtracurricularIcon iconKey={record.iconKey} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-slate-800">{record.clubName}</p>
              <p className="text-[12px] text-slate-400">{record.roleLabel}</p>
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        key: "achievements",
        label: t("columns.achievements"),
        columnClassName: "w-[30%] min-w-[260px]",
        render: (record) => (
          <span className="whitespace-nowrap text-[14px] text-slate-700">{record.achievement}</span>
        ),
        sortable: true,
      },
      {
        key: "duration",
        label: t("columns.duration"),
        render: (record) => (
          <span className="text-[14px] text-slate-700">{record.durationLabel}</span>
        ),
        sortable: true,
      },
      {
        key: "advisor",
        label: t("columns.advisor"),
        render: (record) => (
          <span className="text-[14px] text-slate-700">{record.advisorName}</span>
        ),
        sortable: true,
      },
    ],
    [t]
  )

  if (extracurricularQuery.isLoading) {
    return <Skeleton className="h-[270px] w-full rounded-[28px]" />
  }

  if (extracurricularQuery.isError) {
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
      rows={extracurricularQuery.data ?? []}
      title={t("title")}
    />
  )
}
