import type { StudentCreateFormOptions } from "@talimy/shared"

export type StudentCreateResponse = {
  admissionNumber: string
  fullName: string
  id: string
  studentId: string
}

export type StudentCreateFormOptionsResponse = StudentCreateFormOptions

export type UploadedStudentFile = {
  fileName: string
  mimeType: string
  publicUrl: string | null
  sizeBytes: number
  storageKey: string
}
