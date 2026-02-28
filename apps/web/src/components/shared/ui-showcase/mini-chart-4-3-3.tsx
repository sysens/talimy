"use client"

import * as React from "react"
import { MiniChart, MultipleBarChart, type MiniChartLegendItem, type MultipleBarChartSeries } from "@talimy/ui"

type GradeScore = 2 | 3 | 4 | 5
type GradeDistribution = Record<GradeScore, number>

type StudentPerformanceSource = {
  grade7: GradeDistribution
  grade8: GradeDistribution
  grade9: GradeDistribution
  month: string
}

type StudentPerformancePeriod = "lastSemester" | "thisSemester"

const MAX_GRADE_VALUE = 5

const STUDENT_PERFORMANCE_SERIES: MultipleBarChartSeries[] = [
  { color: "var(--talimy-color-sky)", key: "grade7", label: "Grade 7" },
  { color: "var(--talimy-color-pink)", key: "grade8", label: "Grade 8" },
  { color: "var(--talimy-color-navy)", key: "grade9", label: "Grade 9" },
]

const STUDENT_PERFORMANCE_LEGEND: MiniChartLegendItem[] = [
  { color: "var(--talimy-color-sky)", id: "grade7", label: "Grade 7" },
  { color: "var(--talimy-color-pink)", id: "grade8", label: "Grade 8" },
  { color: "var(--talimy-color-navy)", id: "grade9", label: "Grade 9" },
]

const LAST_SEMESTER_SOURCE: StudentPerformanceSource[] = [
  {
    grade7: { 2: 12, 3: 24, 4: 38, 5: 26 },
    grade8: { 2: 8, 3: 17, 4: 29, 5: 24 },
    grade9: { 2: 11, 3: 23, 4: 27, 5: 18 },
    month: "Jul",
  },
  {
    grade7: { 2: 10, 3: 21, 4: 37, 5: 30 },
    grade8: { 2: 7, 3: 16, 4: 25, 5: 28 },
    grade9: { 2: 12, 3: 22, 4: 26, 5: 20 },
    month: "Aug",
  },
  {
    grade7: { 2: 11, 3: 22, 4: 36, 5: 29 },
    grade8: { 2: 9, 3: 16, 4: 27, 5: 26 },
    grade9: { 2: 12, 3: 21, 4: 25, 5: 18 },
    month: "Sep",
  },
  {
    grade7: { 2: 13, 3: 25, 4: 34, 5: 27 },
    grade8: { 2: 9, 3: 18, 4: 27, 5: 24 },
    grade9: { 2: 13, 3: 24, 4: 24, 5: 17 },
    month: "Oct",
  },
  {
    grade7: { 2: 12, 3: 23, 4: 35, 5: 29 },
    grade8: { 2: 8, 3: 18, 4: 25, 5: 25 },
    grade9: { 2: 13, 3: 22, 4: 25, 5: 18 },
    month: "Nov",
  },
  {
    grade7: { 2: 11, 3: 21, 4: 37, 5: 31 },
    grade8: { 2: 8, 3: 15, 4: 25, 5: 30 },
    grade9: { 2: 11, 3: 21, 4: 25, 5: 22 },
    month: "Dec",
  },
]

const THIS_SEMESTER_SOURCE: StudentPerformanceSource[] = [
  {
    grade7: { 2: 9, 3: 19, 4: 34, 5: 34 },
    grade8: { 2: 7, 3: 14, 4: 25, 5: 32 },
    grade9: { 2: 10, 3: 20, 4: 26, 5: 23 },
    month: "Jan",
  },
  {
    grade7: { 2: 10, 3: 20, 4: 33, 5: 32 },
    grade8: { 2: 7, 3: 13, 4: 26, 5: 31 },
    grade9: { 2: 10, 3: 21, 4: 24, 5: 24 },
    month: "Feb",
  },
  {
    grade7: { 2: 9, 3: 18, 4: 35, 5: 34 },
    grade8: { 2: 6, 3: 14, 4: 25, 5: 33 },
    grade9: { 2: 9, 3: 20, 4: 25, 5: 24 },
    month: "Mar",
  },
  {
    grade7: { 2: 10, 3: 18, 4: 34, 5: 36 },
    grade8: { 2: 6, 3: 14, 4: 24, 5: 34 },
    grade9: { 2: 10, 3: 19, 4: 24, 5: 25 },
    month: "Apr",
  },
  {
    grade7: { 2: 8, 3: 19, 4: 34, 5: 37 },
    grade8: { 2: 6, 3: 13, 4: 25, 5: 34 },
    grade9: { 2: 9, 3: 18, 4: 25, 5: 26 },
    month: "May",
  },
  {
    grade7: { 2: 9, 3: 17, 4: 35, 5: 37 },
    grade8: { 2: 5, 3: 12, 4: 24, 5: 35 },
    grade9: { 2: 8, 3: 18, 4: 25, 5: 27 },
    month: "Jun",
  },
]

function calculateNormalizedPerformance(distribution: GradeDistribution) {
  let totalStudents = 0
  let weightedScore = 0

  for (const [grade, studentsCount] of Object.entries(distribution) as Array<[`${GradeScore}`, number]>) {
    const numericGrade = Number(grade)
    totalStudents += studentsCount
    weightedScore += numericGrade * studentsCount
  }

  if (totalStudents === 0) {
    return 0
  }

  return Number(((weightedScore / (totalStudents * MAX_GRADE_VALUE)) * 100).toFixed(1))
}

function buildPerformanceRows(data: StudentPerformanceSource[]) {
  return data.map((entry) => ({
    grade7: calculateNormalizedPerformance(entry.grade7),
    grade8: calculateNormalizedPerformance(entry.grade8),
    grade9: calculateNormalizedPerformance(entry.grade9),
    month: entry.month,
  }))
}

function calculateSeriesAverage(
  rows: Array<{ grade7: number; grade8: number; grade9: number; month: string }>,
  key: "grade7" | "grade8" | "grade9"
) {
  if (!rows.length) {
    return 0
  }

  const total = rows.reduce((sum, row) => sum + row[key], 0)
  return Number((total / rows.length).toFixed(1))
}

export function MiniChartShowcase433() {
  const [period, setPeriod] = React.useState<StudentPerformancePeriod>("lastSemester")

  const rows = React.useMemo(() => {
    const source = period === "lastSemester" ? LAST_SEMESTER_SOURCE : THIS_SEMESTER_SOURCE
    return buildPerformanceRows(source)
  }, [period])

  const summaryRows = React.useMemo(
    () => [
      {
        color: "var(--talimy-color-sky)",
        label: "Grade 7",
        value: `${Math.round(calculateSeriesAverage(rows, "grade7"))}%`,
      },
      {
        color: "var(--talimy-color-pink)",
        label: "Grade 8",
        value: `${Math.round(calculateSeriesAverage(rows, "grade8"))}%`,
      },
      {
        color: "var(--talimy-color-navy)",
        label: "Grade 9",
        value: `${Math.round(calculateSeriesAverage(rows, "grade9"))}%`,
      },
    ],
    [rows]
  )

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/dashboard</h3>

      <div className="max-w-xl">
        <MiniChart
          chartClassName="min-h-[236px]"
          chartOverlay={
            <div className="w-28 rounded-lg border border-border/70 bg-card/95 p-2 shadow-sm backdrop-blur">
              <div className="space-y-1.5">
                {summaryRows.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
                      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-[var(--talimy-color-navy)] dark:text-sky-200">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          }
          filter={{
            ariaLabel: "Student performance period",
            onValueChange: (value) => setPeriod(value as StudentPerformancePeriod),
            options: [
              { label: "Last Semester", value: "lastSemester" },
              { label: "This Semester", value: "thisSemester" },
            ],
            value: period,
          }}
          legend={STUDENT_PERFORMANCE_LEGEND}
          title="Student Performance"
        >
          <MultipleBarChart
            data={rows}
            hideFooter
            hideHeader
            series={STUDENT_PERFORMANCE_SERIES}
            valueFormatter={(value) => `${value.toFixed(1)}%`}
            xKey="month"
          />
        </MiniChart>
      </div>

      <p className="text-xs text-muted-foreground">
        Formula: normalized quality = weighted grade score / (student count x 5) x 100.
      </p>
    </div>
  )
}
