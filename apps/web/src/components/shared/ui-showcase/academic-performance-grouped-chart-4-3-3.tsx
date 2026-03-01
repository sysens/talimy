"use client"

import * as React from "react"
import {
  GroupedCappedProgressChart,
  type GroupedCappedProgressChartSeries,
} from "@talimy/ui"

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

const SERIES: GroupedCappedProgressChartSeries[] = [
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

function buildRows(data: StudentPerformanceSource[]) {
  return data.map((entry) => ({
    grade7: calculateNormalizedPerformance(entry.grade7),
    grade8: calculateNormalizedPerformance(entry.grade8),
    grade9: calculateNormalizedPerformance(entry.grade9),
    month: entry.month,
  }))
}

export function AcademicPerformanceGroupedChartShowcase433() {
  const [period, setPeriod] = React.useState<StudentPerformancePeriod>("lastSemester")

  const data = React.useMemo(() => {
    const source = period === "lastSemester" ? LAST_SEMESTER_SOURCE : THIS_SEMESTER_SOURCE
    return buildRows(source)
  }, [period])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/admin/students</h3>

      <div className="max-w-xl">
        <GroupedCappedProgressChart
          data={data}
          filter={{
            ariaLabel: "Academic performance period",
            onValueChange: (value) => setPeriod(value as StudentPerformancePeriod),
            options: [
              { label: "Last Semester", value: "lastSemester" },
              { label: "This Semester", value: "thisSemester" },
            ],
            value: period,
          }}
          maxValue={100}
          series={SERIES}
          title="Academic Performance"
          valueFormatter={(value) => `${value.toFixed(1)}%`}
          xKey="month"
        />
      </div>
    </div>
  )
}
