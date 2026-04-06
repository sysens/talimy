import type { GroupedCappedProgressChartSeries } from "@talimy/ui"

import type { AcademicPerformanceChartRow } from "@/components/shared/charts/academic-performance-chart-card"
import type { AreaTrendChartPoint } from "@/components/shared/charts/area-trend-chart-card"
import type { AttendancePoint } from "@/components/shared/charts/student-attendance-chart"

export type StudentsAcademicPerformancePeriod = "lastSemester" | "thisSemester"
export type StudentsEnrollmentTrendsPeriod = "lastFiveYears"
export type StudentsAttendancePeriod = "weekly" | "monthly"

export const STUDENTS_STATS = {
  grade7Students: 410,
  grade8Students: 415,
  grade9Students: 420,
  totalStudents: 1245,
} as const

export const STUDENTS_ACADEMIC_SERIES = [
  {
    accentColor: "#b3b3b3",
    color: "#e7e7e7",
    key: "grade7",
    label: "Grade 7",
  },
  {
    accentColor: "var(--talimy-color-navy)",
    color: "var(--talimy-color-sky)",
    key: "grade8",
    label: "Grade 8",
  },
  {
    accentColor: "#f4b7f1",
    color: "#f8dcf7",
    key: "grade9",
    label: "Grade 9",
  },
] as const satisfies readonly [
  GroupedCappedProgressChartSeries,
  GroupedCappedProgressChartSeries,
  GroupedCappedProgressChartSeries,
]

export const STUDENTS_ACADEMIC_DATA_BY_PERIOD: Record<
  StudentsAcademicPerformancePeriod,
  readonly AcademicPerformanceChartRow[]
> = {
  lastSemester: [
    { grade7: 90.4, grade8: 95.2, grade9: 86.2, month: "Jul" },
    { grade7: 89.6, grade8: 94.1, grade9: 85.5, month: "Aug" },
    { grade7: 90.8, grade8: 95.0, grade9: 85.0, month: "Sep" },
    { grade7: 88.2, grade8: 93.1, grade9: 84.4, month: "Oct" },
    { grade7: 89.7, grade8: 94.0, grade9: 84.9, month: "Nov" },
    { grade7: 92.1, grade8: 96.4, grade9: 87.8, month: "Dec" },
  ],
  thisSemester: [
    { grade7: 91.5, grade8: 95.8, grade9: 88.7, month: "Jan" },
    { grade7: 92.0, grade8: 96.6, grade9: 89.2, month: "Feb" },
    { grade7: 92.8, grade8: 97.1, grade9: 89.7, month: "Mar" },
    { grade7: 93.0, grade8: 97.4, grade9: 90.2, month: "Apr" },
    { grade7: 93.6, grade8: 98.2, grade9: 90.9, month: "May" },
    { grade7: 94.1, grade8: 98.7, grade9: 91.5, month: "Jun" },
  ],
}

export const STUDENTS_ENROLLMENT_DATA_BY_PERIOD: Record<
  StudentsEnrollmentTrendsPeriod,
  readonly AreaTrendChartPoint[]
> = {
  lastFiveYears: [
    { label: "2030", shortLabel: "2030", value: 6800 },
    { annotation: "8,015", label: "2031", shortLabel: "2031", value: 8015 },
    { label: "2032", shortLabel: "2032", value: 6200 },
    { label: "2033", shortLabel: "2033", value: 14900 },
    { label: "2034", shortLabel: "2034", value: 10100 },
    { label: "2035", shortLabel: "2035", value: 12800 },
  ],
}

export const STUDENTS_ATTENDANCE_DATA_BY_PERIOD: Record<
  StudentsAttendancePeriod,
  AttendancePoint[]
> = {
  weekly: [
    {
      absentBreakdown: [
        { label: "Alicia Gomez", meta: "8B", value: 1 },
        { label: "Daniel Park", meta: "8A", value: 1 },
      ],
      label: "Mon",
      value: 1180,
    },
    {
      absentBreakdown: [
        { label: "Emma Williams", meta: "7B", value: 1 },
        { label: "Rajesh Kumar", meta: "7C", value: 1 },
      ],
      label: "Tue",
      value: 1085,
    },
    {
      absentBreakdown: [
        { label: "Hannah Lee", meta: "8A", value: 1 },
        { label: "Thomas Green", meta: "8B", value: 1 },
      ],
      label: "Wed",
      value: 1230,
    },
    {
      absentBreakdown: [
        { label: "Isabella Rossi", meta: "8C", value: 1 },
        { label: "Ahmed Ali", meta: "9A", value: 1 },
      ],
      label: "Thu",
      value: 1102,
    },
    {
      absentBreakdown: [
        { label: "Chloe Davis", meta: "9B", value: 1 },
        { label: "Michael Chen", meta: "7A", value: 1 },
      ],
      label: "Fri",
      value: 1200,
    },
    {
      absentBreakdown: [
        { label: "Leo Ricci", meta: "9C", value: 1 },
        { label: "Fatima Noor", meta: "8B", value: 1 },
      ],
      label: "Sat",
      value: 980,
    },
    {
      absentBreakdown: [
        { label: "Omar Reed", meta: "7A", value: 1 },
        { label: "Maya Collins", meta: "9A", value: 1 },
      ],
      label: "Sun",
      value: 910,
    },
  ],
  monthly: [
    {
      absentBreakdown: [{ label: "1-hafta", meta: "24 ta sababli davomat", value: 24 }],
      label: "Mon",
      value: 1180,
    },
    {
      absentBreakdown: [{ label: "2-hafta", meta: "31 ta sababli davomat", value: 31 }],
      label: "Tue",
      value: 1085,
    },
    {
      absentBreakdown: [{ label: "3-hafta", meta: "18 ta sababli davomat", value: 18 }],
      label: "Wed",
      value: 1230,
    },
    {
      absentBreakdown: [{ label: "4-hafta", meta: "27 ta sababli davomat", value: 27 }],
      label: "Thu",
      value: 1102,
    },
    {
      absentBreakdown: [{ label: "5-hafta", meta: "22 ta sababli davomat", value: 22 }],
      label: "Fri",
      value: 1200,
    },
    {
      absentBreakdown: [{ label: "6-hafta", meta: "35 ta sababli davomat", value: 35 }],
      label: "Sat",
      value: 980,
    },
    {
      absentBreakdown: [{ label: "7-hafta", meta: "42 ta sababli davomat", value: 42 }],
      label: "Sun",
      value: 910,
    },
  ],
}
