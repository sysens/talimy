"use client"

import { useQuery } from "@tanstack/react-query"

import { getTeacherDetailOverview } from "@/components/teachers/detail/teacher-detail-api"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"

export function useTeacherDetailOverviewQuery(teacherId: string) {
  return useQuery({
    queryKey: teacherDetailQueryKeys.overview(teacherId),
    queryFn: () => getTeacherDetailOverview(teacherId),
    staleTime: 60_000,
  })
}
