import type { CalendarAttendanceMonthData } from "@/components/shared/calendar/calendar-widget.types"
import type {
  StudentDetailAttendanceCalendarMonthRecord,
  StudentDetailDocumentRecord,
  StudentDetailHealthRecord,
  StudentDetailScholarshipRecord,
  StudentGuardianRecord,
} from "@/components/students/detail/student-detail-api.types"
import { formatMonthDayYear } from "@/lib/dashboard/dashboard-formatters"

export function formatDocumentSize(sizeBytes: number): string {
  return `${(sizeBytes / 1_000_000).toFixed(1)} MB`
}

export function mapStudentDocumentsToCardItems(records: readonly StudentDetailDocumentRecord[]) {
  return records.map((record) => ({
    fileName: record.fileName,
    formatLabel: record.mimeType === "application/pdf" ? "PDF" : record.mimeType.toUpperCase(),
    sizeLabel: formatDocumentSize(record.sizeBytes),
  }))
}

export function mapStudentAttendanceCalendarMonths(
  records: readonly StudentDetailAttendanceCalendarMonthRecord[]
): readonly CalendarAttendanceMonthData[] {
  return records.map((record) => ({
    key: record.key,
    kind: "attendance",
    month: "",
    monthNumber: record.monthNumber,
    selectedDay: record.selectedDay,
    statuses: record.statuses,
    summary: record.summary.map((item) => ({
      colorClassName: resolveAttendanceSummaryColor(item.status),
      label: item.label,
      value: item.value,
    })),
    year: record.year,
  }))
}

export function mapStudentGuardians(records: readonly StudentGuardianRecord[]) {
  const byRelationship = new Map(records.map((record) => [record.relationship, record] as const))
  const father = byRelationship.get("father") ?? null
  const mother = byRelationship.get("mother") ?? null
  const alternativeGuardian =
    records.find(
      (record) => record.relationship !== "father" && record.relationship !== "mother"
    ) ?? null

  return {
    alternativeGuardian,
    father,
    mother,
  }
}

export function mapStudentHealthToneToClasses(record: StudentDetailHealthRecord): {
  badgeClassName: string
  panelClassName: string
} {
  if (record.tone === "danger") {
    return {
      badgeClassName: "bg-[#ffe1e1] text-[#cb4d4d]",
      panelClassName: "bg-[#f7f7f5]",
    }
  }

  if (record.tone === "warning") {
    return {
      badgeClassName: "bg-[#fff0c7] text-[#9a7014]",
      panelClassName: "bg-[#f7f7f5]",
    }
  }

  return {
    badgeClassName: "bg-[#d6eef2] text-[#476881]",
    panelClassName: "bg-[#f7f7f5]",
  }
}

export function mapStudentScholarshipTone(
  record: StudentDetailScholarshipRecord
): "finance" | "enrichment" {
  return record.scholarshipType
}

export function mapBehaviorRecordDate(locale: string, value: string): string {
  return formatMonthDayYear(locale, value)
}

function resolveAttendanceSummaryColor(
  status: StudentDetailAttendanceCalendarMonthRecord["summary"][number]["status"]
): string {
  if (status === "present") {
    return "bg-[#d4f1ff]"
  }

  if (status === "late") {
    return "bg-[#f6b5ff]"
  }

  if (status === "sick") {
    return "bg-[#1f4b7b]"
  }

  return "bg-[#dfe3e6]"
}
