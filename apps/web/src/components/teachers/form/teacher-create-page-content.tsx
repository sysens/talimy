"use client"

import { AlertCircle, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@talimy/ui"
import { useTranslations } from "next-intl"
import { sileo } from "sileo"

import { DetailPageHeader } from "@/components/shared/navigation/detail-page-header"
import {
  createTeacher,
  getTeacherCreateFormOptions,
} from "@/components/teachers/form/teacher-create-api"
import {
  deleteTeacherUploadedFiles,
  uploadTeacherFile,
} from "@/components/teachers/form/teacher-file-upload"
import { TeacherCreateForm } from "@/components/teachers/form/teacher-form"
import { TEACHER_CREATE_QUERY_KEYS } from "@/components/teachers/form/teacher-create-query-keys"
import type { TeacherCreateSubmitData } from "@/components/teachers/form/teacher-form.types"

export function TeacherCreatePageContent() {
  const router = useRouter()
  const t = useTranslations("adminTeachers.create")
  const formOptionsQuery = useQuery({
    queryKey: TEACHER_CREATE_QUERY_KEYS.formOptions,
    queryFn: getTeacherCreateFormOptions,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: TeacherCreateSubmitData) => {
      const formOptions = formOptionsQuery.data
      if (!formOptions) {
        throw new Error(t("toasts.formOptionsMissing"))
      }

      const uploadedFiles: Array<{ storageKey: string }> = []

      try {
        const avatarUpload = payload.avatarFile
          ? await uploadTeacherFile({
              file: payload.avatarFile,
              folder: "teachers/avatar",
              tenantId: formOptions.tenantId,
            })
          : null

        if (avatarUpload) {
          uploadedFiles.push({ storageKey: avatarUpload.storageKey })
        }

        const uploadedDocumentFiles: Array<{
          fileName: string
          mimeType: string
          sizeBytes: number
          storageKey: string
        }> = []

        for (const documentFile of payload.documentFiles) {
          if (!documentFile) {
            throw new Error(t("toasts.documentUploadMissing"))
          }

          const uploadedDocument = await uploadTeacherFile({
            file: documentFile,
            folder: "teachers/documents",
            tenantId: formOptions.tenantId,
          })

          uploadedFiles.push({ storageKey: uploadedDocument.storageKey })
          uploadedDocumentFiles.push(uploadedDocument)
        }

        return createTeacher({
          ...payload.values,
          avatar: avatarUpload?.publicUrl ?? null,
          avatarStorageKey: avatarUpload?.storageKey ?? null,
          documents: payload.values.documents.map((document, index) => {
            const uploadedDocument = uploadedDocumentFiles[index]
            if (!uploadedDocument) {
              throw new Error(t("toasts.documentUploadMissing"))
            }

            return {
              documentType: document.documentType,
              fileName: uploadedDocument.fileName,
              mimeType: uploadedDocument.mimeType,
              sizeBytes: uploadedDocument.sizeBytes,
              storageKey: uploadedDocument.storageKey,
            }
          }),
        })
      } catch (error) {
        if (uploadedFiles.length > 0) {
          await deleteTeacherUploadedFiles(formOptions.tenantId, uploadedFiles)
        }

        throw error
      }
    },
    onError: (error) => {
      let message = error instanceof Error ? error.message : t("toasts.createErrorDescription")
      if (message.toLowerCase().includes("email already exists")) {
        message = "Ushbu elektron pochta manzili allaqachon ro'yxatdan o'tgan!"
      }

      sileo.error({
        title: t("toasts.createErrorTitle"),
        description: message,
        position: "top-center",
      })
    },
    onSuccess: () => {
      sileo.success({
        title: t("toasts.createSuccessTitle"),
        description: t("toasts.createSuccessDescription"),
        position: "top-center",
      })
      void router.push("/admin/teachers")
    },
  })

  return (
    <div className="space-y-6 bg-white">
      <DetailPageHeader
        backHref="/admin/teachers"
        backLabel={t("header.backLabel")}
        breadcrumbs={[
          { href: "/admin/dashboard", label: t("header.breadcrumbs.dashboard") },
          { href: "/admin/teachers", label: t("header.breadcrumbs.teachers") },
          { label: t("header.breadcrumbs.addTeacher") },
        ]}
        title={t("header.title")}
      />

      {formOptionsQuery.isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <LoaderCircle className="size-4 animate-spin" />
            {t("loading")}
          </div>
        </div>
      ) : null}

      {formOptionsQuery.isError ? (
        <div className="space-y-4 rounded-[28px] border border-red-200 bg-red-50 px-5 py-5">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700">
            <AlertCircle className="size-4" />
            {t("loadError")}
          </div>
          <Button type="button" variant="outline" onClick={() => void formOptionsQuery.refetch()}>
            {t("retry")}
          </Button>
        </div>
      ) : null}

      {formOptionsQuery.data ? (
        <TeacherCreateForm
          className="pb-6"
          formOptions={formOptionsQuery.data}
          isSubmitting={createMutation.isPending}
          onSubmit={(payload) => {
            createMutation.mutate(payload)
          }}
        />
      ) : null}
    </div>
  )
}
