"use client"

import { useRef } from "react"
import { Input, Label } from "@talimy/ui"
import { Button } from "@talimy/ui"
import { FileUp, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { HeroSelectField } from "@/components/shared/forms/hero-select-field"
import type { TeacherCreateDocumentFormValue } from "@/components/teachers/form/teacher-form.schema"

type TeacherCreateDocumentRowProps = {
  disabled?: boolean
  fileErrorMessage?: string
  file: File | null
  onDocumentTypeChange: (value: TeacherCreateDocumentFormValue["documentType"]) => void
  onFileChange: (file: File | null) => void
  onRemove: () => void
  value: TeacherCreateDocumentFormValue
}

export function TeacherCreateDocumentRow({
  disabled = false,
  fileErrorMessage,
  file,
  onDocumentTypeChange,
  onFileChange,
  onRemove,
  value,
}: TeacherCreateDocumentRowProps) {
  const t = useTranslations("adminTeachers.create")
  const inputRef = useRef<HTMLInputElement>(null)
  const fileName = file?.name ?? value.fileName

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto]">
      <HeroSelectField
        disabled={disabled}
        label={t("documents.documentTypeLabel")}
        options={[
          { label: t("documents.documentTypeOptions.diploma"), value: "diploma" },
          { label: t("documents.documentTypeOptions.certificate"), value: "certificate" },
          { label: t("documents.documentTypeOptions.idCard"), value: "id_card" },
          { label: t("documents.documentTypeOptions.other"), value: "other" },
        ]}
        placeholder={t("documents.documentTypePlaceholder")}
        value={value.documentType}
        onChange={(nextValue) =>
          onDocumentTypeChange(nextValue as TeacherCreateDocumentFormValue["documentType"])
        }
      />

      <div className="space-y-2">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <Label htmlFor="teacher-document-file">{t("documents.fileLabel")}</Label>
            <Input
              id="teacher-document-file"
              disabled={disabled}
              placeholder={t("documents.filePlaceholder")}
              readOnly
              value={fileName}
            />
          </div>
          <div className="flex items-end">
            <Button
              disabled={disabled}
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <FileUp className="size-4" />
              {t("documents.uploadLabel")}
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          accept=".pdf,.png,.jpg,.jpeg"
          className="sr-only"
          disabled={disabled}
          type="file"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null
            onFileChange(nextFile)
            event.target.value = ""
          }}
        />
        {fileName ? (
          <p className="text-xs text-slate-500">{t("documents.fileReadyLabel")}</p>
        ) : null}
        {fileErrorMessage ? (
          <p className="text-[0.8rem] font-medium text-destructive">{fileErrorMessage}</p>
        ) : null}
      </div>

      <div className="flex items-end">
        <Button type="button" variant="ghost" disabled={disabled} onClick={onRemove}>
          <Trash2 className="size-4" />
          {t("documents.removeLabel")}
        </Button>
      </div>
    </div>
  )
}
