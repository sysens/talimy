"use client"

import { useQuery } from "@tanstack/react-query"

import { getStudentDetailOverview } from "@/components/students/detail/student-detail-api"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"

export function useStudentDetailOverviewQuery(studentId: string) {
  return useQuery({
    queryFn: () => getStudentDetailOverview(studentId),
    queryKey: studentDetailQueryKeys.overview(studentId),
    staleTime: 60_000,
  })
}
