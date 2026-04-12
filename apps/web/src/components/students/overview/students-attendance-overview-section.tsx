"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { CappedProgressBarChart } from "@talimy/ui"

import { getStudentsAttendanceWeekly } from "@/components/students/overview/students-overview-api"
import { studentsOverviewQueryKeys } from "@/components/students/overview/students-overview-query-keys"

export function StudentsAttendanceOverviewSection() {
  const t = useTranslations("adminStudents.overview.attendanceOverview")
  const attendanceQuery = useQuery({
    queryFn: getStudentsAttendanceWeekly,
    queryKey: studentsOverviewQueryKeys.attendanceWeekly(),
    staleTime: 60_000,
  })
  const points = attendanceQuery.data?.points ?? []
  const maxValue = Math.max(
    attendanceQuery.data?.totalStudents ?? 0,
    ...points.map((item) => item.value),
    1
  )
  const chartData =
    points.length > 0
      ? points.map((item) => ({
          details: item.absentStudents.map((student) => ({
            label: student.name,
            meta: student.classLabel,
          })),
          label: item.label,
          value: item.value,
        }))
      : [
          { details: [], label: "Mon", value: 0 },
          { details: [], label: "Tue", value: 0 },
          { details: [], label: "Wed", value: 0 },
          { details: [], label: "Thu", value: 0 },
          { details: [], label: "Fri", value: 0 },
          { details: [], label: "Sat", value: 0 },
          { details: [], label: "Sun", value: 0 },
        ]

  return (
    <CappedProgressBarChart
      barSize={32}
      chartMargin={{ bottom: 18, left: 4, right: 4, top: 18 }}
      data={chartData}
      filter={{
        ariaLabel: t("filterAriaLabel"),
        options: [{ label: t("periods.thisWeek"), value: "thisWeek" }],
        value: "thisWeek",
      }}
      maxValue={maxValue}
      title={t("title")}
    />
  )
}
