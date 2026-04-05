import type { StackedExpandedAreaPoint } from "@talimy/ui"

import type {
  CalendarAttendanceMonthData,
  CalendarAttendanceStatus,
} from "@/components/shared/calendar/calendar-widget.types"
import type { MetricProgressCardItem } from "@/components/shared/performance/metric-progress-card.types"
import type {
  TeacherDetailAttendanceCalendarMonthRecord,
  TeacherDetailDocumentRecord,
  TeacherDetailLeaveRequestRecord,
  TeacherDetailPerformanceRecord,
  TeacherDetailTrainingRecord,
  TeacherDetailWorkloadRecord,
} from "@/components/teachers/detail/teacher-detail-api.types"
import { formatMonthDayYear, formatMonthShort } from "@/lib/dashboard/dashboard-formatters"

export function formatDocumentSize(sizeBytes: number): string {
  return `${(sizeBytes / 1_000_000).toFixed(1)} MB`
}

export function mapDocumentsToCardItems(records: readonly TeacherDetailDocumentRecord[]) {
  return records.map((record) => ({
    fileName: record.fileName,
    formatLabel: resolveDocumentFormatLabel(record.mimeType),
    sizeLabel: formatDocumentSize(record.sizeBytes),
  }))
}

export function mapWorkloadRecordsToChartPoints(
  locale: string,
  records: readonly TeacherDetailWorkloadRecord[]
): readonly StackedExpandedAreaPoint[] {
  return records.map((record) => ({
    extraDuties: record.extraDuties,
    label:
      record.label.length > 0
        ? record.label
        : formatMonthShort(locale, getMonthNumber(record.periodDate)),
    teachingHours: record.teachingHours,
    totalClasses: record.totalClasses,
  }))
}

export function mapTrainingRecordsToRows(
  locale: string,
  records: readonly TeacherDetailTrainingRecord[]
) {
  return records.map((record) => ({
    dateLabel: formatMonthDayYear(locale, record.eventDate),
    id: record.id,
    locationLabel: record.locationLabel,
    status: record.status,
    subtitle: record.subtitle,
    title: record.title,
  }))
}

export function mapAttendanceCalendarMonths(
  records: readonly TeacherDetailAttendanceCalendarMonthRecord[]
): readonly CalendarAttendanceMonthData[] {
  return records.map((record) => ({
    key: record.key,
    kind: "attendance",
    month: "",
    monthNumber: record.monthNumber,
    selectedDay: record.selectedDay,
    statuses: record.statuses as Partial<Record<number, CalendarAttendanceStatus>>,
    summary: record.summary.map((item) => ({
      colorClassName: resolveAttendanceSummaryColor(item.status),
      label: item.label,
      value: item.value,
    })),
    year: record.year,
  }))
}

export function mapLeaveRequestToCardState(record: TeacherDetailLeaveRequestRecord | null): {
  badgeLabel: string
  description: string
} {
  if (!record) {
    return {
      badgeLabel: "No Request",
      description: "No pending leave requests for this teacher.",
    }
  }

  return {
    badgeLabel: resolveLeaveRequestBadgeLabel(record.requestType),
    description: record.reason,
  }
}

export function mapPerformanceRecordToCardItems(
  record: TeacherDetailPerformanceRecord
): readonly MetricProgressCardItem[] {
  return [
    {
      helperText: resolvePerformanceHelperText(
        record.gradingTimelinessValue,
        record.gradingTimelinessTarget,
        true
      ),
      id: "grading-timeliness",
      label: "Grading Timeliness",
      maxValue: 100,
      targetLabel: `${record.gradingTimelinessTarget}%`,
      targetValue: record.gradingTimelinessTarget,
      valueLabel: `${record.gradingTimelinessValue}%`,
      valueValue: record.gradingTimelinessValue,
    },
    {
      helperText: resolvePerformanceHelperText(
        record.studentAverageGradeValue,
        record.studentAverageGradeTarget,
        false
      ),
      id: "student-average-grade",
      label: "Student Avg. Grade",
      maxValue: 100,
      targetLabel: `${record.studentAverageGradeTarget}`,
      targetValue: record.studentAverageGradeTarget,
      valueLabel: `${record.studentAverageGradeValue}`,
      valueValue: record.studentAverageGradeValue,
    },
    {
      helperText: resolvePerformanceHelperText(
        record.studentFeedbackValue,
        record.studentFeedbackTarget,
        true
      ),
      id: "student-feedback",
      label: "Student Feedback",
      maxValue: 100,
      targetLabel: `${record.studentFeedbackTarget}%`,
      targetValue: record.studentFeedbackTarget,
      valueLabel: `${record.studentFeedbackValue}%`,
      valueValue: record.studentFeedbackValue,
    },
  ] as const
}

function getMonthNumber(value: string): number {
  return Number(value.slice(5, 7))
}

function resolveAttendanceSummaryColor(
  status: TeacherDetailAttendanceCalendarMonthRecord["summary"][number]["status"]
): string {
  if (status === "present") {
    return "bg-[#b8ebff]"
  }

  if (status === "late") {
    return "bg-[#f6b5ff]"
  }

  return "bg-[#1f4b7b]"
}

function resolveDocumentFormatLabel(mimeType: string): string {
  if (mimeType === "application/pdf") {
    return "PDF"
  }

  return mimeType.toUpperCase()
}

function resolveLeaveRequestBadgeLabel(
  requestType: TeacherDetailLeaveRequestRecord["requestType"]
): string {
  switch (requestType) {
    case "annual_leave":
      return "Annual Leave"
    case "personal_leave":
      return "Personal Leave"
    case "sick_leave":
      return "Sick Leave"
    case "unpaid_leave":
      return "Unpaid Leave"
  }
}

function resolvePerformanceHelperText(value: number, target: number, isPercent: boolean): string {
  const difference = value - target

  if (difference >= 5) {
    return "Excellent"
  }

  if (difference >= -10) {
    return "Good"
  }

  return isPercent ? "Needs Improvement" : "Below Standard"
}
