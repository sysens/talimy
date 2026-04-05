"use client"

import Link from "next/link"
import { Button } from "@talimy/ui"
import { LoaderCircle } from "lucide-react"
import { useTranslations } from "next-intl"

type TeacherCreateActionsProps = {
  isSubmitting: boolean
}

export function TeacherCreateActions({ isSubmitting }: TeacherCreateActionsProps) {
  const t = useTranslations("adminTeachers.create")

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button asChild type="button" variant="outline">
        <Link href="/admin/teachers">{t("actions.cancel")}</Link>
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {isSubmitting ? t("actions.submitting") : t("actions.submit")}
      </Button>
    </div>
  )
}
