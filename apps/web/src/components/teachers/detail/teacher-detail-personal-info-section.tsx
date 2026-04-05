"use client"

import { CalendarDays, House, Mail, Mars, Phone } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Skeleton } from "@talimy/ui"

import { PersonalInfoCard } from "@/components/shared/profile/personal-info-card"
import { useTeacherDetailOverviewQuery } from "@/components/teachers/detail/use-teacher-detail-overview-query"
import { formatMonthDayYear } from "@/lib/dashboard/dashboard-formatters"

type TeacherDetailPersonalInfoSectionProps = {
  teacherId: string
}

export function TeacherDetailPersonalInfoSection({
  teacherId,
}: TeacherDetailPersonalInfoSectionProps) {
  const locale = useLocale()
  const t = useTranslations("adminTeachers.detail.personalInfo")
  const teacherDetailQuery = useTeacherDetailOverviewQuery(teacherId)

  if (teacherDetailQuery.isLoading) {
    return <Skeleton className="h-[268px] w-full rounded-[28px]" />
  }

  if (teacherDetailQuery.isError || !teacherDetailQuery.data?.teacher) {
    return null
  }

  const teacher = teacherDetailQuery.data.teacher

  return (
    <PersonalInfoCard
      actionLabel={t("actionLabel")}
      items={[
        {
          icon: <Mars className="size-4" />,
          label: t("fields.gender"),
          value: teacher.gender === "male" ? t("states.male") : t("states.female"),
        },
        {
          icon: <CalendarDays className="size-4" />,
          label: t("fields.dateOfBirth"),
          value: teacher.dateOfBirth ? formatMonthDayYear(locale, teacher.dateOfBirth) : "—",
        },
        {
          icon: <Mail className="size-4" />,
          label: t("fields.emailAddress"),
          value: teacher.email,
        },
        {
          icon: <Phone className="size-4" />,
          label: t("fields.phoneNumber"),
          value: teacher.phone ?? "—",
        },
        {
          icon: <House className="size-4" />,
          label: t("fields.address"),
          value: teacher.address ?? "—",
        },
      ]}
      title={t("title")}
    />
  )
}
