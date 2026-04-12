"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@heroui/react"
import { Skeleton } from "@talimy/ui"
import { Award, MoreHorizontal, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

import { MetricProgressCard } from "@/components/shared/performance/metric-progress-card"
import { getStudentDetailScholarships } from "@/components/students/detail/student-detail-api"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"

type StudentDetailScholarshipsSectionProps = {
  studentId: string
}

function ScholarshipIcon({ type }: { type: "enrichment" | "finance" }) {
  const Icon = type === "finance" ? Award : Sparkles

  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-[#f5c0f8] text-talimy-navy">
      <Icon className="size-5" />
    </div>
  )
}

export function StudentDetailScholarshipsSection({
  studentId,
}: StudentDetailScholarshipsSectionProps) {
  const t = useTranslations("adminStudents.detail.scholarships")
  const scholarshipsQuery = useQuery({
    queryFn: () => getStudentDetailScholarships(studentId),
    queryKey: studentDetailQueryKeys.scholarships(studentId),
    staleTime: 60_000,
  })

  if (scholarshipsQuery.isLoading) {
    return <Skeleton className="h-[204px] w-full rounded-[28px]" />
  }

  if (scholarshipsQuery.isError) {
    return null
  }

  return (
    <MetricProgressCard
      bodyClassName="space-y-3"
      className="rounded-[28px] border border-slate-100 mb-0 p-5 px-0 shadow-none"
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
      {(scholarshipsQuery.data ?? []).map((record) => (
        <div
          className="flex items-center gap-4 rounded-[22px] border border-slate-100 bg-white px-4 py-4"
          key={record.id}
        >
          <ScholarshipIcon type={record.scholarshipType} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-slate-800">{record.title}</p>
            <p className="mt-1 text-[12px] text-slate-500">
              {record.scholarshipType === "finance" ? t("types.finance") : t("types.enrichment")}
            </p>
          </div>
        </div>
      ))}
    </MetricProgressCard>
  )
}
