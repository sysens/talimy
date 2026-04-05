"use client"

import { MoreHorizontal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { ChartRadialStacked, Skeleton } from "@talimy/ui"

import { getTeachersByDepartment } from "@/components/teachers/overview/teacher-overview-api"
import type { TeacherOverviewDepartmentKey } from "@/components/teachers/overview/teacher-overview-api.types"
import { teacherOverviewQueryKeys } from "@/components/teachers/overview/teacher-overview-query-keys"

const DEPARTMENT_COLORS: Record<TeacherOverviewDepartmentKey, string> = {
  arts: "#B2B4B3",
  language: "var(--talimy-color-pink)",
  mathematics: "var(--talimy-color-sky)",
  other: "#DCDEDD",
  physicalEducation: "#DCDEDD",
  science: "var(--talimy-color-navy)",
  social: "#FCEBFD",
}

export function DepartmentDonutChart() {
  const locale = useLocale()
  const t = useTranslations("adminTeachers.overview.department")

  const departmentQuery = useQuery({
    queryKey: teacherOverviewQueryKeys.department(locale),
    queryFn: () => getTeachersByDepartment(),
    staleTime: 60_000,
  })

  if (departmentQuery.isLoading) {
    return <Skeleton className="h-[280px] rounded-[28px]" />
  }

  const items = departmentQuery.data?.items ?? []

  return (
    <div className="rounded-[28px] bg-card px-5 py-[18px]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-talimy-navy dark:text-sky-200">{t("title")}</h3>
        <button aria-label={t("actionsAriaLabel")} className="text-talimy-gray" type="button">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="mt-1.5">
        <ChartRadialStacked
          centerLabel={t("centerLabel")}
          centerValue={String(departmentQuery.data?.totalTeachers ?? 0)}
          centerLabelClassName="text-[10px]"
          centerValueClassName="text-[24px]"
          chartClassName="h-[172px]!"
          className="min-h-[146px]"
          containerClassName="h-[108px] max-w-[248px]"
          cx="50%"
          cy="82%"
          hideHeader
          guideRadius={72}
          innerRadius={70}
          outerRadius={116}
          segments={items.map((item) => ({
            color: DEPARTMENT_COLORS[item.key],
            key: item.key,
            label: t(`items.${item.key}` as never),
            value: item.percentage,
          }))}
        />
      </div>

      <div className="mt-2 border-t border-[color-mix(in_srgb,var(--talimy-color-gray)_25%,white_75%)] pt-[14px]">
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.key}
              className="grid grid-cols-[minmax(0,1fr)_24px_40px] items-center gap-2.5"
            >
              <div className="flex items-center gap-2.5 text-[13px] leading-5 text-talimy-gray">
                <span
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: DEPARTMENT_COLORS[item.key] }}
                />
                <span>{t(`items.${item.key}` as never)}</span>
              </div>
              <span className="text-right text-[13px] leading-5 text-talimy-gray">
                {item.count}
              </span>
              <span className="text-right text-[13px] leading-5 font-semibold text-talimy-navy dark:text-sky-200">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
