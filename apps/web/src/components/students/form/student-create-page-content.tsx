"use client"

import { AlertCircle, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@talimy/ui"
import { useTranslations } from "next-intl"
import { sileo } from "sileo"

import { DetailPageHeader } from "@/components/shared/navigation/detail-page-header"
import {
  createStudent,
  getStudentCreateFormOptions,
} from "@/components/students/form/student-create-api"
import { STUDENT_CREATE_QUERY_KEYS } from "@/components/students/form/student-create-query-keys"
import { clearStudentCreateDraft } from "@/components/students/form/student-create-draft"
import { StudentCreateForm } from "@/components/students/form/student-form"
import { mapStudentFormValuesToCreatePayload } from "@/components/students/form/student-form.mappers"
import {
  deleteStudentUploadedFiles,
  uploadStudentFile,
} from "@/components/students/form/student-file-upload"
import type { StudentCreateSubmitData } from "@/components/students/form/student-form.types"

export function StudentCreatePageContent() {
  const router = useRouter()
  const t = useTranslations("adminStudents.create")
  const formOptionsQuery = useQuery({
    queryKey: STUDENT_CREATE_QUERY_KEYS.formOptions,
    queryFn: getStudentCreateFormOptions,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: StudentCreateSubmitData) => {
      const formOptions = formOptionsQuery.data
      if (!formOptions) {
        throw new Error(t("toasts.formOptionsMissing"))
      }

      const uploadedFiles: Array<{ storageKey: string }> = []

      try {
        const avatarUpload = payload.avatarFile
          ? await uploadStudentFile({
              file: payload.avatarFile,
              folder: "students/avatar",
              tenantId: formOptions.tenantId,
            })
          : null

        if (avatarUpload) {
          uploadedFiles.push({ storageKey: avatarUpload.storageKey })
        }

        return createStudent(mapStudentFormValuesToCreatePayload(payload.values, avatarUpload))
      } catch (error) {
        if (uploadedFiles.length > 0) {
          await deleteStudentUploadedFiles(formOptions.tenantId, uploadedFiles)
        }

        throw error
      }
    },
    onError: (error) => {
      let message = error instanceof Error ? error.message : t("toasts.createErrorDescription")
      if (message.toLowerCase().includes("email already exists")) {
        message = t("toasts.emailAlreadyExists")
      }

      sileo.error({
        title: t("toasts.createErrorTitle"),
        description: message,
        position: "top-center",
      })
    },
    onSuccess: () => {
      const formOptions = formOptionsQuery.data
      if (formOptions) {
        clearStudentCreateDraft(formOptions.tenantId)
      }

      sileo.success({
        title: t("toasts.createSuccessTitle"),
        description: t("toasts.createSuccessDescription"),
        position: "top-center",
      })
      void router.push("/admin/students")
    },
  })

  return (
    <div className="space-y-6 bg-white">
      <DetailPageHeader
        backHref="/admin/students"
        backLabel={t("header.backLabel")}
        breadcrumbs={[
          { href: "/admin/dashboard", label: t("header.breadcrumbs.dashboard") },
          { href: "/admin/students", label: t("header.breadcrumbs.students") },
          { label: t("header.breadcrumbs.addStudent") },
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
        <StudentCreateForm
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
