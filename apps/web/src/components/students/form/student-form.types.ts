import type { StudentCreateFormOptions } from "@talimy/shared"

import type { StudentCreateFormValues } from "./student-form.schema"

export type StudentCreateSubmitData = {
  avatarFile: File | null
  values: StudentCreateFormValues
}

export type StudentCreateFormProps = {
  className?: string
  formOptions: StudentCreateFormOptions
  isSubmitting?: boolean
  onSubmit: (payload: StudentCreateSubmitData) => Promise<void> | void
}
