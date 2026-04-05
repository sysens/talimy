import type { TeacherCreateFormOptions } from "@talimy/shared"

import type { TeacherCreateFormValues } from "./teacher-form.schema"

export type TeacherCreateSubmitData = {
  avatarFile: File | null
  documentFiles: readonly (File | null)[]
  values: TeacherCreateFormValues
}

export type TeacherCreateFormProps = {
  className?: string
  formOptions: TeacherCreateFormOptions
  isSubmitting?: boolean
  onSubmit: (payload: TeacherCreateSubmitData) => Promise<void> | void
}
