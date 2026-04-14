"use client"

import { MessagesEmptyCard } from "@/components/shared/cards/messages-empty-card"
import { useTranslations } from "next-intl"

export function StudentDashboardMessagesSection() {
  const t = useTranslations("studentDashboard.messages")

  return <MessagesEmptyCard emptyLabel={t("empty")} title={t("title")} />
}
