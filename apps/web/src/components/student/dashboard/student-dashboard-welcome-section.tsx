"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { getStudentDashboardAdvice } from "@/components/student/dashboard/student-dashboard-api"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { buildWelcomeMetaItems } from "@/components/student/dashboard/student-dashboard.mappers"
import { WelcomeProfileCard } from "@/components/shared/cards/welcome-profile-card"
import type { AppLocale } from "@/config/site"

export function StudentDashboardWelcomeSection() {
  const locale = useLocale() as AppLocale
  const t = useTranslations("studentDashboard.welcome")
  const router = useRouter()
  const adviceQuery = useQuery({
    queryFn: () => getStudentDashboardAdvice(),
    queryKey: studentDashboardQueryKeys.advice(),
    staleTime: 24 * 60 * 60 * 1000,
  })

  if (adviceQuery.isLoading) {
    return <Skeleton className="h-[226px] rounded-[28px]" />
  }

  if (!adviceQuery.data) {
    return null
  }

  const record = adviceQuery.data

  return (
    <WelcomeProfileCard
      actionLabel={t("actionLabel")}
      avatarFallback={buildInitials(record.fullName)}
      avatarUrl={record.avatarUrl}
      message={record.aiAdvice}
      metaItems={buildWelcomeMetaItems(
        locale,
        {
          classLabel: t("classLabel"),
          dateOfBirthLabel: t("dateOfBirthLabel"),
          emailLabel: t("emailLabel"),
          phoneLabel: t("phoneLabel"),
        },
        record
      )}
      name={t("title", { name: record.fullName })}
      onActionPress={() => router.push("/student/profile")}
    />
  )
}

function buildInitials(value: string) {
  const tokens = value
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0)

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("")
}
