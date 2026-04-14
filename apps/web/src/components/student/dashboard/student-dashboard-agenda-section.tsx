"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { getStudentDashboardAgenda } from "@/components/student/dashboard/student-dashboard-api"
import { mapStudentAgendaItems } from "@/components/student/dashboard/student-dashboard.mappers"
import { studentDashboardQueryKeys } from "@/components/student/dashboard/student-dashboard-query-keys"
import { AgendaListCard } from "@/components/shared/events/agenda-list-card"
import type { AppLocale } from "@/config/site"

export function StudentDashboardAgendaSection() {
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const t = useTranslations("studentDashboard.agenda")
  const agendaQuery = useQuery({
    queryFn: () => getStudentDashboardAgenda(4, "today"),
    queryKey: studentDashboardQueryKeys.agenda(4, "today"),
    staleTime: 60_000,
  })

  if (agendaQuery.isLoading) {
    return <Skeleton className="h-[320px] rounded-[28px]" />
  }

  if (!agendaQuery.data) {
    return null
  }

  return (
    <AgendaListCard
      className="border-0 bg-transparent"
      emptyLabel={t("empty")}
      items={mapStudentAgendaItems(
        locale,
        {
          academic: t("types.academic"),
          administration: t("types.administration"),
          events: t("types.events"),
          exam: t("types.exam"),
          finance: t("types.finance"),
          holiday: t("types.holiday"),
          other: t("types.other"),
          sports: t("types.sports"),
        },
        agendaQuery.data
      )}
      onViewAll={() => router.push("/student/calendar")}
      title={t("title")}
      viewAllLabel={t("viewAll")}
    />
  )
}
