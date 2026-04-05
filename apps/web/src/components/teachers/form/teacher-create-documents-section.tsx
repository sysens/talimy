"use client"

import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormReturn,
} from "react-hook-form"
import { Button } from "@talimy/ui"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { FormSectionCard } from "@/components/shared/forms/form-section-card"
import { TeacherCreateDocumentRow } from "@/components/teachers/form/teacher-create-document-row"
import {
  EMPTY_TEACHER_DOCUMENT_FORM_VALUE,
  type TeacherCreateDocumentFormValue,
  type TeacherCreateFormValues,
} from "@/components/teachers/form/teacher-form.schema"

type TeacherCreateDocumentsSectionProps = {
  appendDocument: UseFieldArrayAppend<TeacherCreateFormValues, "documents">
  disabled?: boolean
  documentFiles: Readonly<Record<string, File | null>>
  fields: readonly FieldArrayWithId<TeacherCreateFormValues, "documents", "id">[]
  form: UseFormReturn<TeacherCreateFormValues>
  removeDocument: UseFieldArrayRemove
  setDocumentFile: (fieldId: string, file: File | null) => void
  updateDocument: UseFieldArrayUpdate<TeacherCreateFormValues, "documents">
}

export function TeacherCreateDocumentsSection({
  appendDocument,
  disabled = false,
  documentFiles,
  fields,
  form,
  removeDocument,
  setDocumentFile,
  updateDocument,
}: TeacherCreateDocumentsSectionProps) {
  const t = useTranslations("adminTeachers.create")

  return (
    <FormSectionCard title={t("documents.title")}>
      <div className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-sm text-slate-500">{t("documents.emptyState")}</p>
        ) : null}

        {fields.map((field, index) => {
          const value = form.getValues(`documents.${index}`)
          return (
            <TeacherCreateDocumentRow
              key={field.id}
              disabled={disabled}
              file={documentFiles[field.id] ?? null}
              fileErrorMessage={form.formState.errors.documents?.[index]?.fileName?.message}
              value={value}
              onDocumentTypeChange={(documentType) => {
                form.setValue(`documents.${index}.documentType`, documentType)
              }}
              onFileChange={(file) => {
                setDocumentFile(field.id, file)
                form.clearErrors(`documents.${index}.fileName`)
                form.setValue(`documents.${index}.fileName`, file?.name ?? "")
                form.setValue(`documents.${index}.mimeType`, file?.type ?? "")
                form.setValue(`documents.${index}.sizeBytes`, file?.size ?? 0)
              }}
              onRemove={() => {
                setDocumentFile(field.id, null)
                removeDocument(index)
              }}
            />
          )
        })}

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => appendDocument({ ...EMPTY_TEACHER_DOCUMENT_FORM_VALUE })}
        >
          <Plus className="size-4" />
          {t("documents.addLabel")}
        </Button>
      </div>
    </FormSectionCard>
  )
}
