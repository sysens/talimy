"use client"

import { useEffect, useMemo, useRef } from "react"
import { CalendarDays, MapPin, Mars, Phone } from "lucide-react"
import { Card, CardContent, Skeleton } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { sileo } from "sileo"

import { ProfileFactsPanel } from "@/components/shared/profile/profile-facts-panel"
import { ProfileOverviewCard } from "@/components/shared/profile/profile-overview-card"
import { useStudentDetailOverviewQuery } from "@/components/students/detail/use-student-detail-overview-query"
import { formatMonthDayYear } from "@/lib/dashboard/dashboard-formatters"

type StudentDetailProfileSectionProps = {
  studentId: string
}

function getAvatarFallback(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "ST"
}

function formatCompactClassName(name: string | null): string {
  if (!name) {
    return "—"
  }

  const normalizedName = name.trim()
  const gradeMatch = /^grade\s+(\d+)\s*([a-z])$/i.exec(normalizedName)

  if (gradeMatch) {
    return `${gradeMatch[1] ?? ""}${gradeMatch[2]?.toUpperCase() ?? ""}`
  }

  const compactMatch = /(\d+)\s*([a-z])/i.exec(normalizedName)

  if (compactMatch) {
    return `${compactMatch[1] ?? ""}${compactMatch[2]?.toUpperCase() ?? ""}`
  }

  return normalizedName
}

export function StudentDetailProfileSection({ studentId }: StudentDetailProfileSectionProps) {
  const locale = useLocale()
  const t = useTranslations("adminStudents.detail")
  const hasShownErrorToastRef = useRef(false)
  const overviewQuery = useStudentDetailOverviewQuery(studentId)

  const statusBadgeByState = useMemo<
    Record<string, { label: string; tone: "info" | "muted" | "success" }>
  >(
    () => ({
      active: { label: t("status.active"), tone: "success" },
      graduated: { label: t("status.graduated"), tone: "info" },
      inactive: { label: t("status.inactive"), tone: "muted" },
      transferred: { label: t("status.transferred"), tone: "info" },
    }),
    [t]
  )

  useEffect(() => {
    if (!overviewQuery.isError || hasShownErrorToastRef.current) {
      return
    }

    sileo.error({
      description:
        overviewQuery.error instanceof Error ? overviewQuery.error.message : t("toast.loadFailed"),
      title: t("toast.title"),
    })
    hasShownErrorToastRef.current = true
  }, [overviewQuery.error, overviewQuery.isError, t])

  if (overviewQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[328px] rounded-[32px]" />
      </div>
    )
  }

  if (overviewQuery.isError) {
    return null
  }

  const student = overviewQuery.data?.student

  if (!student) {
    return (
      <Card className="rounded-[28px] border border-slate-100 bg-white shadow-none">
        <CardContent className="px-5 py-6 text-sm text-slate-500">{t("states.empty")}</CardContent>
      </Card>
    )
  }

  const statusBadge =
    statusBadgeByState[student.status] ??
    ({
      label: t("status.inactive"),
      tone: "muted",
    } as const)

  return (
    <div className="space-y-4 rounded-[32px] border border-slate-100 border-b-0 bg-white p-4 pt-10 mb-0 rounded-b-none">
      <ProfileOverviewCard
        avatarFallback={getAvatarFallback(student.fullName)}
        avatarUrl={student.avatar ?? undefined}
        badges={[
          { label: student.studentId, tone: "muted" },
          { label: formatCompactClassName(student.className), tone: "muted" },
          statusBadge,
        ]}
        name={student.fullName}
      />

      <ProfileFactsPanel
        items={[
          {
            icon: <Mars className="size-3.5" />,
            label: t("personal.gender"),
            value: student.gender === "male" ? t("gender.male") : t("gender.female"),
          },
          {
            icon: <CalendarDays className="size-3.5" />,
            label: t("personal.dateOfBirth"),
            value: student.dateOfBirth ? formatMonthDayYear(locale, student.dateOfBirth) : "—",
          },
          {
            icon: <Phone className="size-3.5" />,
            label: t("personal.phone"),
            value: student.phone ?? "—",
          },
          {
            icon: <MapPin className="size-3.5" />,
            label: t("personal.address"),
            value: student.address ?? "—",
          },
        ]}
      />
    </div>
  )
}
