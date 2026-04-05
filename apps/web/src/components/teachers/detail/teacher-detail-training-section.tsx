"use client"

import * as React from "react"
import { Chip } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Skeleton } from "@talimy/ui"

import { getTeacherDetailTraining } from "@/components/teachers/detail/teacher-detail-api"
import { mapTrainingRecordsToRows } from "@/components/teachers/detail/teacher-detail.mappers"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"
import { RecordsTableCard } from "@/components/shared/records/records-table-card"
import type { RecordsTableCardColumn } from "@/components/shared/records/records-table-card.types"
import type { TeacherDetailTrainingRecord } from "@/components/teachers/detail/teacher-detail-api.types"

type TrainingPeriod = "lastSemester" | "thisSemester"

type TeacherTrainingTableRow = Omit<TeacherDetailTrainingRecord, "eventDate"> & {
  dateLabel: string
}

type TeacherDetailTrainingSectionProps = {
  teacherId: string
}

export function TeacherDetailTrainingSection({ teacherId }: TeacherDetailTrainingSectionProps) {
  const [period, setPeriod] = React.useState<TrainingPeriod>("thisSemester")
  const locale = useLocale()
  const t = useTranslations("adminTeachers.detail.training")
  const semester = period === "thisSemester" ? "current" : "previous"

  const trainingQuery = useQuery({
    queryFn: () => getTeacherDetailTraining(teacherId, semester),
    queryKey: teacherDetailQueryKeys.training(teacherId, semester),
    staleTime: 60_000,
  })

  if (trainingQuery.isLoading) {
    return <Skeleton className="h-[432px] w-full rounded-[28px]" />
  }

  if (trainingQuery.isError || !trainingQuery.data) {
    return null
  }

  const columns: readonly RecordsTableCardColumn<TeacherTrainingTableRow>[] = [
    {
      columnClassName: "w-[40%] min-w-[250px]",
      key: "event",
      label: t("columns.event"),
      render: (item) => (
        <div className="space-y-0.5">
          <p className="text-[15px] leading-6 font-medium text-talimy-navy">{item.title}</p>
          <p className="text-[13px] leading-none text-slate-400">{item.subtitle}</p>
        </div>
      ),
      sortable: true,
    },
    {
      columnClassName: "w-[17%] min-w-[124px]",
      key: "date",
      label: t("columns.date"),
      render: (item) => <span className="text-[#1fa4e8]">{item.dateLabel}</span>,
      sortable: true,
    },
    {
      columnClassName: "w-[28%] min-w-[220px]",
      key: "location",
      label: t("columns.location"),
      render: (item) => item.locationLabel,
      sortable: true,
    },
    {
      columnClassName: "w-[15%] min-w-[126px]",
      key: "status",
      label: t("columns.status"),
      render: (item) => (
        <Chip
          className="h-7 rounded-full border-0 px-3 text-[12px] font-medium shadow-none"
          color={
            item.status === "completed"
              ? "success"
              : item.status === "upcoming"
                ? "accent"
                : "danger"
          }
          variant="soft"
        >
          {item.status === "completed"
            ? t("statusMap.completed")
            : item.status === "upcoming"
              ? t("statusMap.upcoming")
              : t("statusMap.cancelled")}
        </Chip>
      ),
      sortable: true,
    },
  ]

  return (
    <RecordsTableCard
      columns={columns}
      filterAriaLabel={t("filterAriaLabel")}
      filterOptions={[
        { label: t("periodOptions.thisSemester"), value: "thisSemester" },
        { label: t("periodOptions.lastSemester"), value: "lastSemester" },
      ]}
      filterValue={period}
      getRowKey={(item) => item.id}
      onFilterChange={(value) => setPeriod(value as TrainingPeriod)}
      rows={mapTrainingRecordsToRows(locale, trainingQuery.data)}
      title={t("title")}
    />
  )
}
