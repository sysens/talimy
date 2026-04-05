import type { TeacherCreateFormOptions } from "@talimy/shared"

export type TeacherCreateResponse = {
  employeeId: string
  fullName: string
  id: string
}

export type TeacherCreateFormOptionsResponse = TeacherCreateFormOptions

export type UploadedTeacherFile = {
  fileName: string
  mimeType: string
  publicUrl: string | null
  sizeBytes: number
  storageKey: string
}
