"use client"

import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import { RelationshipContactsCard } from "@/components/shared/profile/relationship-contacts-card"
import { mapStudentGuardians } from "@/components/students/detail/student-detail.mappers"
import { useStudentDetailOverviewQuery } from "@/components/students/detail/use-student-detail-overview-query"

type StudentDetailGuardianSectionProps = {
  studentId: string
}

export function StudentDetailGuardianSection({ studentId }: StudentDetailGuardianSectionProps) {
  const t = useTranslations("adminStudents.detail.guardians")
  const overviewQuery = useStudentDetailOverviewQuery(studentId)

  if (overviewQuery.isLoading) {
    return <Skeleton className="h-[236px] w-full rounded-[28px]" />
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return null
  }

  const guardians = mapStudentGuardians(overviewQuery.data.guardians)
  const alternativeGuardianRelation =
    guardians.alternativeGuardian?.relationship === "aunt"
      ? t("relationship.aunt")
      : guardians.alternativeGuardian?.relationship === "uncle"
        ? t("relationship.uncle")
        : guardians.alternativeGuardian?.relationship === "guardian"
          ? t("relationship.guardian")
          : t("relationship.guardian")

  return (
    <RelationshipContactsCard
      actionLabel={t("actionLabel")}
      items={[
        {
          label: t("father"),
          meta: guardians.father?.phone ?? "—",
          name: guardians.father?.fullName ?? "—",
        },
        {
          label: t("mother"),
          meta: guardians.mother?.phone ?? "—",
          name: guardians.mother?.fullName ?? "—",
        },
        {
          label: t("alternativeGuardian"),
          meta: guardians.alternativeGuardian?.phone ?? "—",
          name: guardians.alternativeGuardian
            ? `${guardians.alternativeGuardian.fullName} (${alternativeGuardianRelation})`
            : "—",
        },
      ]}
      title={t("title")}
    />
  )
}
