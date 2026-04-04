"use client"

import * as React from "react"

import { ChartBarDefault, MiniChart } from "@talimy/ui"

import type { DashboardStudentAttendancePeriod } from "@/components/dashboard/admin/dashboard.types"

export type AttendancePoint = {
  absentBreakdown: Array<{
    label: string
    value: number
  }>
  label: string
  value: number
}

type StudentAttendanceChartProps = {
  className?: string
  dataByPeriod?: Record<DashboardStudentAttendancePeriod, AttendancePoint[]>
  filterAriaLabel?: string
  filterOptions?: ReadonlyArray<{ label: string; value: DashboardStudentAttendancePeriod }>
  onPeriodChange?: (value: DashboardStudentAttendancePeriod) => void
  period?: DashboardStudentAttendancePeriod
  title?: string
}

const DEFAULT_WEEKLY_ATTENDANCE_DATA: AttendancePoint[] = [
  { absentBreakdown: [{ label: "A1 Group", value: 8 }], label: "Mon", value: 1144 },
  { absentBreakdown: [{ label: "A2 Group", value: 21 }], label: "Tue", value: 1043 },
  { absentBreakdown: [{ label: "A3 Group", value: 28 }], label: "Wed", value: 933 },
  { absentBreakdown: [{ label: "A4 Group", value: 12 }], label: "Thu", value: 1089 },
  { absentBreakdown: [{ label: "A5 Group", value: 9 }], label: "Fri", value: 1089 },
  { absentBreakdown: [{ label: "A6 Group", value: 21 }], label: "Sat", value: 1026 },
]

const DEFAULT_MONTHLY_ATTENDANCE_DATA: AttendancePoint[] = [
  { absentBreakdown: [{ label: "Grade 7", value: 44 }], label: "Jan", value: 1082 },
  { absentBreakdown: [{ label: "Grade 8", value: 41 }], label: "Feb", value: 1124 },
  { absentBreakdown: [{ label: "Grade 9", value: 24 }], label: "Mar", value: 1189 },
  { absentBreakdown: [{ label: "Grade 7", value: 41 }], label: "Apr", value: 1108 },
  { absentBreakdown: [{ label: "Grade 8", value: 45 }], label: "May", value: 1108 },
  { absentBreakdown: [{ label: "Grade 9", value: 56 }], label: "Jun", value: 1108 },
]

const DEFAULT_DATA_BY_PERIOD: Record<DashboardStudentAttendancePeriod, AttendancePoint[]> = {
  monthly: DEFAULT_MONTHLY_ATTENDANCE_DATA,
  weekly: DEFAULT_WEEKLY_ATTENDANCE_DATA,
}

const DEFAULT_FILTER_OPTIONS: ReadonlyArray<{
  label: string
  value: DashboardStudentAttendancePeriod
}> = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
]

function isStudentAttendancePeriod(value: string): value is DashboardStudentAttendancePeriod {
  return value === "weekly" || value === "monthly"
}

export function StudentAttendanceChart({
  className,
  dataByPeriod = DEFAULT_DATA_BY_PERIOD,
  filterAriaLabel = "Attendance period filter",
  filterOptions = DEFAULT_FILTER_OPTIONS,
  onPeriodChange,
  period,
  title = "Student Attendance",
}: StudentAttendanceChartProps) {
  const [internalPeriod, setInternalPeriod] =
    React.useState<DashboardStudentAttendancePeriod>("weekly")
  const activePeriod = period ?? internalPeriod
  const data = dataByPeriod[activePeriod]

  return (
    <MiniChart
      className={className ?? "h-full min-h-[300px]"}
      bottomLabels={{
        className: "px-2",
        values: data.map((item) => item.label),
      }}
      chartClassName="min-h-[188px]"
      contentClassName="space-y-3 p-5"
      filter={{
        ariaLabel: filterAriaLabel,
        onValueChange: (value) => {
          if (!isStudentAttendancePeriod(value)) {
            return
          }

          if (onPeriodChange) {
            onPeriodChange(value)
            return
          }

          setInternalPeriod(value)
        },
        options: [...filterOptions],
        value: activePeriod,
      }}
      filterTriggerClassName="h-10 min-w-24 rounded-2xl px-3 text-sm font-semibold"
      topLabels={{
        className: "px-1.5",
        values: data.map((item) => item.value.toLocaleString()),
      }}
      title={title}
      titleClassName="text-[1rem] font-semibold"
    >
      <ChartBarDefault className="h-[180px]" data={data} hideFooter hideHeader hideXAxis />
    </MiniChart>
  )
}
