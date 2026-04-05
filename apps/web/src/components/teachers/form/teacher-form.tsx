"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@talimy/ui"
import { useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { TeacherCreateAcademicSection } from "@/components/teachers/form/teacher-create-academic-section"
import { TeacherCreateActions } from "@/components/teachers/form/teacher-create-actions"
import { TeacherCreateContactSection } from "@/components/teachers/form/teacher-create-contact-section"
import { TeacherCreateDocumentsSection } from "@/components/teachers/form/teacher-create-documents-section"
import { TeacherCreatePersonalSection } from "@/components/teachers/form/teacher-create-personal-section"
import {
  createTeacherFormSchema,
  TEACHER_CREATE_FORM_DEFAULT_VALUES,
  type TeacherCreateFormValues,
} from "@/components/teachers/form/teacher-form.schema"
import type { TeacherCreateFormProps } from "@/components/teachers/form/teacher-form.types"

export function TeacherCreateForm({
  className,
  formOptions,
  isSubmitting = false,
  onSubmit,
}: TeacherCreateFormProps) {
  const t = useTranslations("adminTeachers.create")
  const schema = useMemo(
    () =>
      createTeacherFormSchema({
        classIdsRequired: t("validation.classIdsRequired"),
        dateOfBirthRequired: t("validation.dateOfBirthRequired"),
        emailInvalid: t("validation.emailInvalid"),
        emailRequired: t("validation.emailRequired"),
        firstNameRequired: t("validation.firstNameRequired"),
        joinDateRequired: t("validation.joinDateRequired"),
        lastNameRequired: t("validation.lastNameRequired"),
        nationalityRequired: t("validation.nationalityRequired"),
        phoneInvalid: t("validation.phoneInvalid"),
        subjectIdsRequired: t("validation.subjectIdsRequired"),
        telegramInvalid: t("validation.telegramInvalid"),
      }),
    [t]
  )
  const form = useForm<TeacherCreateFormValues>({
    defaultValues: {
      ...TEACHER_CREATE_FORM_DEFAULT_VALUES,
      gender: formOptions.defaultGender,
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  })
  const documentFieldArray = useFieldArray({
    control: form.control,
    name: "documents",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [documentFiles, setDocumentFiles] = useState<Record<string, File | null>>({})

  function setDocumentFile(fieldId: string, file: File | null) {
    setDocumentFiles((currentFiles) => ({
      ...currentFiles,
      [fieldId]: file,
    }))
  }

  async function handleValidSubmit(values: TeacherCreateFormValues) {
    let hasDocumentError = false
    const orderedDocumentFiles = documentFieldArray.fields.map((field, index) => {
      const nextFile = documentFiles[field.id] ?? null
      if (!nextFile) {
        hasDocumentError = true
        form.setError(`documents.${index}.fileName`, {
          message: t("validation.documentFileRequired"),
          type: "manual",
        })
      }
      return nextFile
    })

    if (hasDocumentError) {
      return
    }

    await onSubmit({
      avatarFile,
      documentFiles: orderedDocumentFiles,
      values,
    })
  }

  return (
    <form className={cn("space-y-6", className)} onSubmit={form.handleSubmit(handleValidSubmit)}>
      <div className="grid xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <TeacherCreatePersonalSection
            allowedGenders={formOptions.allowedGenders}
            avatarFile={avatarFile}
            disabled={isSubmitting}
            form={form}
            onAvatarFileChange={setAvatarFile}
          />
          <TeacherCreateContactSection disabled={isSubmitting} form={form} />
          <TeacherCreateDocumentsSection
            appendDocument={documentFieldArray.append}
            disabled={isSubmitting}
            documentFiles={documentFiles}
            fields={documentFieldArray.fields}
            form={form}
            removeDocument={documentFieldArray.remove}
            setDocumentFile={setDocumentFile}
            updateDocument={documentFieldArray.update}
          />
        </div>

        <div className="space-y-6">
          <TeacherCreateAcademicSection disabled={isSubmitting} form={form} options={formOptions} />
        </div>
      </div>

      <TeacherCreateActions isSubmitting={isSubmitting} />
    </form>
  )
}
