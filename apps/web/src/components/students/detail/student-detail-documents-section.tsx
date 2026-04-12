"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { DocumentsListCard } from "@/components/shared/documents/documents-list-card"
import { getStudentDetailDocuments } from "@/components/students/detail/student-detail-api"
import { studentDetailQueryKeys } from "@/components/students/detail/student-detail-query-keys"
import { mapStudentDocumentsToCardItems } from "@/components/students/detail/student-detail.mappers"

type StudentDetailDocumentsSectionProps = {
  studentId: string
}

export function StudentDetailDocumentsSection({ studentId }: StudentDetailDocumentsSectionProps) {
  const t = useTranslations("adminStudents.detail.documents")
  const documentsQuery = useQuery({
    queryFn: () => getStudentDetailDocuments(studentId),
    queryKey: studentDetailQueryKeys.documents(studentId),
    staleTime: 60_000,
  })

  if (documentsQuery.isLoading) {
    return <Skeleton className="h-[248px] w-full rounded-[28px]" />
  }

  if (documentsQuery.isError) {
    return null
  }

  return (
    <DocumentsListCard
      actionLabel={t("actionLabel")}
      items={mapStudentDocumentsToCardItems(documentsQuery.data ?? [])}
      title={t("title")}
    />
  )
}
