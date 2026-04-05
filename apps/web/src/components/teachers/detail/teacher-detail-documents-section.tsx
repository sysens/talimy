"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Skeleton } from "@talimy/ui"

import { DocumentsListCard } from "@/components/shared/documents/documents-list-card"
import { getTeacherDetailDocuments } from "@/components/teachers/detail/teacher-detail-api"
import { mapDocumentsToCardItems } from "@/components/teachers/detail/teacher-detail.mappers"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"

type TeacherDetailDocumentsSectionProps = {
  teacherId: string
}

export function TeacherDetailDocumentsSection({ teacherId }: TeacherDetailDocumentsSectionProps) {
  const t = useTranslations("adminTeachers.detail.documents")
  const documentsQuery = useQuery({
    queryFn: () => getTeacherDetailDocuments(teacherId),
    queryKey: teacherDetailQueryKeys.documents(teacherId),
    staleTime: 60_000,
  })

  if (documentsQuery.isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-[28px]" />
  }

  if (documentsQuery.isError || !documentsQuery.data) {
    return null
  }

  return (
    <DocumentsListCard
      actionLabel={t("actionLabel")}
      items={mapDocumentsToCardItems(documentsQuery.data)}
      title={t("title")}
    />
  )
}
