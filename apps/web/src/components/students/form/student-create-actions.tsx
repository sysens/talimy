"use client"

import Link from "next/link"
import { Button } from "@talimy/ui"
import { LoaderCircle } from "lucide-react"
import { useTranslations } from "next-intl"

type StudentCreateActionsProps = {
  isSubmitting: boolean
  onSaveDraft: () => void
}

export function StudentCreateActions({ isSubmitting, onSaveDraft }: StudentCreateActionsProps) {
  const t = useTranslations("adminStudents.create")

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button type="button" variant="ghost" onClick={onSaveDraft}>
        {t("actions.saveDraft")}
      </Button>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button asChild type="button" variant="outline">
          <Link href="/admin/students">{t("actions.cancel")}</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {isSubmitting ? t("actions.submitting") : t("actions.submit")}
        </Button>
      </div>
    </div>
  )
}
