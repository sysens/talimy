"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@heroui/react"
import { Skeleton } from "@talimy/ui"
import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { MetricProgressCard } from "@/components/shared/performance/metric-progress-card"
import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"
import { getStudentDetailHealth } from "@/components/students/detail/student-detail-api"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"
import { mapStudentHealthToneToClasses } from "@/components/students/detail/student-detail.mappers"

type StudentDetailHealthSectionProps = {
  studentId: string
}

export function StudentDetailHealthSection({ studentId }: StudentDetailHealthSectionProps) {
  const t = useTranslations("adminStudents.detail.health")
  const healthQuery = useQuery({
    queryFn: () => getStudentDetailHealth(studentId),
    queryKey: studentDetailQueryKeys.health(studentId),
    staleTime: 60_000,
  })

  if (healthQuery.isLoading) {
    return <Skeleton className="h-[268px] w-full rounded-[28px]" />
  }

  if (healthQuery.isError) {
    return null
  }

  return (
    <MetricProgressCard
      bodyClassName="space-y-3"
      className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-none"
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
      title={t("title")}
    >
      {(healthQuery.data ?? []).map((record) => {
        const toneClasses = mapStudentHealthToneToClasses(record)

        return (
          <MutedPanelCard className={toneClasses.panelClassName} key={record.id}>
            <div className="space-y-3">
              <span
                className={`inline-flex rounded-lg px-3 py-1 mb-0 text-[12px] font-medium ${toneClasses.badgeClassName}`}
              >
                {record.label}
              </span>
              <p className="text-[14px] leading-6 text-talimy-navy  line-clamp-2">
                {record.description}
              </p>
            </div>
          </MutedPanelCard>
        )
      })}
    </MetricProgressCard>
  )
}
