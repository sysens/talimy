import { deleteUploadedFile } from "@/lib/upload"
import { webApiFetch } from "@/lib/api"

import type { UploadedTeacherFile } from "./teacher-create-api.types"

type UploadTeacherFileInput = {
  file: File
  folder: string
  tenantId: string
}

export async function uploadTeacherFile({ file, folder, tenantId }: UploadTeacherFileInput) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)
  formData.append("tenantId", tenantId)

  const response = await webApiFetch<{
    success: boolean
    data?: {
      key: string
      fileName: string
      contentType: string
      size: number
      url: string | null
    }
  }>("/upload", {
    method: "POST",
    body: formData,
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
  } satisfies UploadedTeacherFile
}

export async function deleteTeacherUploadedFiles(
  tenantId: string,
  files: ReadonlyArray<Pick<UploadedTeacherFile, "storageKey">>
) {
  await Promise.allSettled(
    files.map((file) => deleteUploadedFile({ key: file.storageKey }, tenantId))
  )
}
