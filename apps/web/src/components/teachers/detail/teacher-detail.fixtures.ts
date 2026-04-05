import type { StackedExpandedAreaPoint } from "@talimy/ui"

import type { MetricProgressCardItem } from "@/components/shared/performance/metric-progress-card.types"

type DetailPeriodOption = {
  label: string
  value: string
}

export type TeacherTrainingRecord = {
  dateLabel: string
  id: string
  locationLabel: string
  status: "cancelled" | "completed" | "upcoming"
  subtitle: string
  title: string
}

export const TEACHER_DETAIL_WORKLOAD_PERIOD_OPTIONS: readonly DetailPeriodOption[] = [
  { label: "Last 8 months", value: "last8Months" },
  { label: "This Semester", value: "thisSemester" },
] as const

export const TEACHER_DETAIL_TRAINING_PERIOD_OPTIONS: readonly DetailPeriodOption[] = [
  { label: "This Semester", value: "thisSemester" },
  { label: "Last Semester", value: "lastSemester" },
] as const

export const TEACHER_DETAIL_PERFORMANCE_PERIOD_OPTIONS: readonly DetailPeriodOption[] = [
  { label: "Last Month", value: "lastMonth" },
  { label: "Last Quarter", value: "lastQuarter" },
] as const

export const TEACHER_DETAIL_WORKLOAD_LAST_EIGHT_MONTHS: readonly StackedExpandedAreaPoint[] = [
  { label: "Jul", extraDuties: 32, teachingHours: 104, totalClasses: 122 },
  { label: "Aug", extraDuties: 36, teachingHours: 96, totalClasses: 136 },
  { label: "Sep", extraDuties: 24, teachingHours: 98, totalClasses: 118 },
  { label: "Oct", extraDuties: 32, teachingHours: 134, totalClasses: 149 },
  { label: "Nov", extraDuties: 18, teachingHours: 110, totalClasses: 109 },
  { label: "Dec", extraDuties: 28, teachingHours: 104, totalClasses: 123 },
  { label: "Jan", extraDuties: 42, teachingHours: 128, totalClasses: 134 },
  { label: "Feb", extraDuties: 38, teachingHours: 96, totalClasses: 142 },
] as const

export const TEACHER_DETAIL_WORKLOAD_THIS_SEMESTER: readonly StackedExpandedAreaPoint[] = [
  { label: "Sep", extraDuties: 26, teachingHours: 102, totalClasses: 118 },
  { label: "Oct", extraDuties: 32, teachingHours: 134, totalClasses: 149 },
  { label: "Nov", extraDuties: 24, teachingHours: 116, totalClasses: 128 },
  { label: "Dec", extraDuties: 22, teachingHours: 108, totalClasses: 121 },
  { label: "Jan", extraDuties: 37, teachingHours: 126, totalClasses: 138 },
  { label: "Feb", extraDuties: 34, teachingHours: 118, totalClasses: 132 },
  { label: "Mar", extraDuties: 36, teachingHours: 122, totalClasses: 140 },
  { label: "Apr", extraDuties: 31, teachingHours: 120, totalClasses: 136 },
] as const

export const TEACHER_DETAIL_TRAINING_THIS_SEMESTER: readonly TeacherTrainingRecord[] = [
  {
    dateLabel: "Apr 2, 2035",
    id: "training-1",
    locationLabel: "Zoom - International Education Network",
    status: "upcoming",
    subtitle: "Training",
    title: "Digital Learning Tools Training",
  },
  {
    dateLabel: "Feb 8, 2035",
    id: "training-2",
    locationLabel: "Cambridge University Online (UK)",
    status: "completed",
    subtitle: "Certification",
    title: "Classroom Management Certification",
  },
  {
    dateLabel: "Jan 12, 2035",
    id: "training-3",
    locationLabel: "London, UK - British Council",
    status: "completed",
    subtitle: "Workshop",
    title: "Advanced English Teaching Methods",
  },
] as const

export const TEACHER_DETAIL_TRAINING_LAST_SEMESTER: readonly TeacherTrainingRecord[] = [
  {
    dateLabel: "Nov 19, 2034",
    id: "training-4",
    locationLabel: "Singapore - Teaching Future Forum",
    status: "completed",
    subtitle: "Conference",
    title: "Inclusive Classroom Strategies",
  },
  {
    dateLabel: "Oct 2, 2034",
    id: "training-5",
    locationLabel: "Oxford Online Campus",
    status: "completed",
    subtitle: "Certification",
    title: "Assessment Design Fundamentals",
  },
  {
    dateLabel: "Sep 15, 2034",
    id: "training-6",
    locationLabel: "Talimy Academy Hub",
    status: "cancelled",
    subtitle: "Workshop",
    title: "STEM Lesson Planning Intensive",
  },
] as const

export const TEACHER_DETAIL_PERFORMANCE_LAST_MONTH: readonly MetricProgressCardItem[] = [
  {
    helperText: "Excellent",
    id: "grading-timeliness",
    label: "Grading Timeliness",
    maxValue: 100,
    targetLabel: "90%",
    targetValue: 90,
    valueLabel: "95%",
    valueValue: 95,
  },
  {
    helperText: "Good",
    id: "student-average-grade",
    label: "Student Avg. Grade",
    maxValue: 100,
    targetLabel: "90",
    targetValue: 90,
    valueLabel: "85",
    valueValue: 85,
  },
  {
    helperText: "Needs Improvement",
    id: "student-attendance",
    label: "Student Attendance",
    maxValue: 100,
    targetLabel: "90%",
    targetValue: 90,
    valueLabel: "76%",
    valueValue: 76,
  },
  {
    helperText: "Below Standard",
    id: "parent-feedback",
    label: "Parent Feedback",
    maxValue: 100,
    targetLabel: "85%",
    targetValue: 85,
    valueLabel: "65%",
    valueValue: 65,
  },
] as const

export const TEACHER_DETAIL_PERFORMANCE_LAST_QUARTER: readonly MetricProgressCardItem[] = [
  {
    helperText: "Excellent",
    id: "grading-timeliness",
    label: "Grading Timeliness",
    maxValue: 100,
    targetLabel: "90%",
    targetValue: 90,
    valueLabel: "93%",
    valueValue: 93,
  },
  {
    helperText: "Good",
    id: "student-average-grade",
    label: "Student Avg. Grade",
    maxValue: 100,
    targetLabel: "90",
    targetValue: 90,
    valueLabel: "84",
    valueValue: 84,
  },
  {
    helperText: "Good",
    id: "student-attendance",
    label: "Student Attendance",
    maxValue: 100,
    targetLabel: "88%",
    targetValue: 88,
    valueLabel: "82%",
    valueValue: 82,
  },
  {
    helperText: "Good",
    id: "parent-feedback",
    label: "Parent Feedback",
    maxValue: 100,
    targetLabel: "85%",
    targetValue: 85,
    valueLabel: "79%",
    valueValue: 79,
  },
] as const
