"use client"

import Image from "next/image"
import { CircleUserRoundIcon, Trash2Icon } from "lucide-react"
import { sileo } from "sileo"
import { Button, cn } from "@talimy/ui"

import { useFileUpload, type FileMetadata } from "@/hooks/use-file-upload"

type ProfileImageUploadFieldProps = {
  changeLabel: string
  className?: string
  disabled?: boolean
  emptyLabel: string
  initialFile?: FileMetadata
  label: string
  maxSizeBytes?: number
  noImageLabel: string
  onFileChange: (file: File | null) => void
  removeLabel: string
  uploadErrorTitle: string
  uploadLabel: string
}

export function ProfileImageUploadField({
  changeLabel,
  className,
  disabled = false,
  emptyLabel,
  initialFile,
  label,
  maxSizeBytes = 2 * 1024 * 1024,
  noImageLabel,
  onFileChange,
  removeLabel,
  uploadErrorTitle,
  uploadLabel,
}: ProfileImageUploadFieldProps) {
  const [{ files }, { getInputProps, openFileDialog, removeFile }] = useFileUpload({
    accept: "image/*",
    initialFiles: initialFile ? [initialFile] : [],
    maxFiles: 1,
    maxSize: maxSizeBytes,
    onError: (errors) => {
      const [message] = errors
      if (message) {
        sileo.error({
          title: uploadErrorTitle,
          description: message,
          position: "top-center",
        })
      }
    },
    onFilesChange: (nextFiles) => {
      const file = nextFiles[0]?.file
      onFileChange(file instanceof File ? file : null)
    },
  })

  const previewUrl = files[0]?.preview ?? null
  const fileName = files[0]?.file.name ?? null

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-start gap-3">
        <div
          className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
          aria-label={previewUrl ? emptyLabel : noImageLabel}
        >
          {previewUrl ? (
            <Image
              alt={emptyLabel}
              className="size-full object-cover"
              height={36}
              src={previewUrl}
              width={36}
            />
          ) : (
            <CircleUserRoundIcon className="opacity-60" aria-hidden="true" height={16} width={16} />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="inline-flex items-center gap-2">
            <Button disabled={disabled} type="button" variant="outline" onClick={openFileDialog}>
              {fileName ? changeLabel : uploadLabel}
            </Button>
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label={uploadLabel}
              tabIndex={-1}
            />
            {fileName ? (
              <Button
                disabled={disabled}
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeFile(files[0]?.id ?? "")}
                title={removeLabel}
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">{removeLabel}</span>
              </Button>
            ) : null}
          </div>
          <p className="text-muted-foreground max-w-[220px] truncate text-xs" aria-live="polite">
            {fileName ?? noImageLabel}
          </p>
        </div>
      </div>
    </div>
  )
}
