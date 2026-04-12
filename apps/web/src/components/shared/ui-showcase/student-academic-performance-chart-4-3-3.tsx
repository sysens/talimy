"use client"

import * as React from "react"

import {
  StudentAcademicPerformanceCard,
  type StudentAcademicPerformanceCardPeriod,
} from "@/components/shared/charts/student-academic-performance-card"

type Period = StudentAcademicPerformanceCardPeriod

const LAST_SIX_MONTHS_DATA = [
  { label: "Jan", value: 90 },
  { label: "Feb", value: 88 },
  { label: "Mar", value: 85 },
  { label: "Apr", value: 92 },
  { label: "May", value: 95 },
  { label: "Jun", value: 96 },
]

const THIS_SEMESTER_DATA = [
  { label: "Jul", value: 87 },
  { label: "Aug", value: 89 },
  { label: "Sep", value: 91 },
  { label: "Oct", value: 93 },
  { label: "Nov", value: 94 },
  { label: "Dec", value: 95 },
]

export function StudentAcademicPerformanceChartShowcase433() {
  const [period, setPeriod] = React.useState<Period>("last6Months")

  const data = period === "last6Months" ? LAST_SIX_MONTHS_DATA : THIS_SEMESTER_DATA

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">/student/profile</h3>

      <div className="max-w-4xl">
        <StudentAcademicPerformanceCard
          averageScoreMax={4}
          averageScoreValue={3.9}
          note="Isabella shows consistent excellence in her studies and leadership in group projects. Keep aiming high!"
          onPeriodChange={setPeriod}
          period={period}
          points={data}
          title="Academic Performance"
        />
      </div>
    </div>
  )
}
