"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { StudentAcademicPerformanceCard } from "@/components/shared/charts/student-academic-performance-card"
import { getStudentDetailAcademicPerformance } from "@/components/students/detail/student-detail-api"
import type { StudentDetailAcademicPerformancePeriod } from "@/components/students/detail/student-detail-api.types"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"

type StudentDetailAcademicPerformanceSectionProps = {
  studentId: string
}

export function StudentDetailAcademicPerformanceSection({
  studentId,
}: StudentDetailAcademicPerformanceSectionProps) {
  const t = useTranslations("adminStudents.detail.academicPerformance")
  const [period, setPeriod] = useState<StudentDetailAcademicPerformancePeriod>("last6Months")
  const performanceQuery = useQuery({
    queryFn: () => getStudentDetailAcademicPerformance(studentId, period),
    queryKey: studentDetailQueryKeys.academicPerformance(studentId, period),
    staleTime: 60_000,
  })

  if (performanceQuery.isLoading) {
    return <Skeleton className="h-[324px] w-full rounded-[28px]" />
  }

  if (performanceQuery.isError || !performanceQuery.data) {
    return null
  }

  return (
    <StudentAcademicPerformanceCard
      averageScoreMax={performanceQuery.data.averageScoreMax}
      averageScoreValue={performanceQuery.data.averageScoreValue}
      filterOptions={[
        { label: t("filters.last6Months"), value: "last6Months" },
        { label: t("filters.thisSemester"), value: "thisSemester" },
      ]}
      note={performanceQuery.data.note}
      onPeriodChange={setPeriod}
      period={period}
      points={performanceQuery.data.points}
      title={t("title")}
    />
  )
}
