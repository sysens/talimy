import { deleteUploadedFile } from "@/lib/upload"
import { webApiFetch } from "@/lib/api"

import type { UploadedStudentFile } from "./student-create-api.types"

type UploadStudentFileInput = {
  file: File
  folder: string
  tenantId: string
}

export async function uploadStudentFile({ file, folder, tenantId }: UploadStudentFileInput) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)
  formData.append("tenantId", tenantId)

  const response = await webApiFetch<{
    success: boolean
    data?: {
      contentType: string
      fileName: string
      key: string
      size: number
      url: string | null
    }
  }>("/upload", {
    body: formData,
    method: "POST",
  })

  const uploadData = response.data
  if (!uploadData) {
    throw new Error("Upload response data was not returned")
  }

  return {
    fileName: uploadData.fileName ?? file.name,
    mimeType: uploadData.contentType ?? file.type,
    publicUrl: uploadData.url,
    sizeBytes: uploadData.size ?? file.size,
    storageKey: uploadData.key,
  } satisfies UploadedStudentFile
}

export async function deleteStudentUploadedFiles(
  tenantId: string,
  files: ReadonlyArray<Pick<UploadedStudentFile, "storageKey">>
) {
  await Promise.allSettled(
    files.map((file) => deleteUploadedFile({ key: file.storageKey }, tenantId))
  )
}
