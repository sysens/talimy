import { CalendarDays, GraduationCap, Mail, Phone } from "lucide-react"
import type { AppLocale } from "@/config/site"
import type {
  StudentDashboardAdviceRecord,
  StudentDashboardAgendaRecord,
  StudentDashboardAssignmentStatus,
  StudentDashboardAssignmentsRecord,
  StudentDashboardAttendanceCalendarRecord,
  StudentDashboardLessonsRecord,
  StudentDashboardScoreActivityRecord,
  StudentDashboardSubjectGradesRecord,
} from "@/components/student/dashboard/student-dashboard-api.types"
import type { AgendaListItem } from "@/components/shared/events/agenda-list-card"
import type { RadarMetricsChartDatum } from "@/components/shared/charts/radar-metrics-chart-card"
import type { WelcomeProfileMetaItem } from "@/components/shared/cards/welcome-profile-card"
import type { LessonsOverviewSection } from "@/components/shared/schedule/lessons-overview-card"
import { formatCalendarMonth, formatMonthDayYear } from "@/lib/dashboard/dashboard-formatters"
import { mapStudentAttendanceCalendarMonths } from "@/components/students/detail/student-detail.mappers"

export function buildWelcomeMetaItems(
  locale: AppLocale,
  labels: {
    classLabel: string
    dateOfBirthLabel: string
    emailLabel: string
    phoneLabel: string
  },
  record: StudentDashboardAdviceRecord
): WelcomeProfileMetaItem[] {
  return [
    {
      icon: GraduationCap,
      label: labels.classLabel,
      value: record.classLabel ?? "—",
    },
    {
      icon: CalendarDays,
      label: labels.dateOfBirthLabel,
      value: record.dateOfBirth ? formatMonthDayYear(locale, record.dateOfBirth) : "—",
    },
    {
      icon: Mail,
      label: labels.emailLabel,
      value: record.email,
    },
    {
      icon: Phone,
      label: labels.phoneLabel,
      value: record.phone ?? "—",
    },
  ]
}

export function mapStudentScoreActivityPoints(
  locale: AppLocale,
  record: StudentDashboardScoreActivityRecord
) {
  return record.points.map((point) => ({
    id: point.id,
    label: new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
      new Date(point.recordedAt)
    ),
    value: point.value,
  }))
}

export function mapStudentLessonSections(
  labels: { today: string; tomorrow: string },
  record: StudentDashboardLessonsRecord
): readonly LessonsOverviewSection[] {
  return record.sections.map((section) => ({
    id: section.id,
    items: section.lessons.map((lesson) => ({
      id: lesson.id,
      subtitle: [lesson.teacherName, lesson.roomLabel].filter(Boolean).join(" • "),
      timeLabel: `${lesson.startTime} – ${lesson.endTime}`,
      title: lesson.subjectName,
    })),
    label: section.id === "today" ? labels.today : labels.tomorrow,
  }))
}

export function mapStudentSubjectRadarData(record: StudentDashboardSubjectGradesRecord) {
  return record.subjects.map((subject) => ({
    label: subject.subjectName,
    value: subject.score,
  })) as readonly RadarMetricsChartDatum[]
}

export function mapStudentAgendaItems(
  locale: AppLocale,
  labels: {
    academic: string
    administration: string
    events: string
    exam: string
    finance: string
    holiday: string
    other: string
    sports: string
  },
  record: StudentDashboardAgendaRecord
): readonly AgendaListItem[] {
  return record.data.map((event) => ({
    accentClassName: resolveAgendaAccentClassName(event.type),
    dateLabel: buildAgendaDateLabel(locale, event.startDate),
    id: event.id,
    subtitle: event.location ?? resolveAgendaFallbackLocation(labels, event.type),
    tagLabel: resolveAgendaTagLabel(labels, event.type),
    title: event.title,
  }))
}

export function formatAssignmentDueDate(locale: AppLocale, value: string) {
  return formatMonthDayYear(locale, value)
}

export function formatAssignmentTime(locale: AppLocale, value: string) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value)
  )
}

export function mapAssignmentStatusLabel(
  labels: {
    inProgress: string
    notStarted: string
    submitted: string
  },
  value: StudentDashboardAssignmentStatus
) {
  if (value === "submitted") {
    return labels.submitted
  }

  if (value === "notStarted") {
    return labels.notStarted
  }

  return labels.inProgress
}

export function mapStudentAssignmentsRows(
  locale: AppLocale,
  labels: {
    inProgress: string
    notStarted: string
    submitted: string
  },
  record: StudentDashboardAssignmentsRecord
) {
  return record.rows.map((row) => ({
    dueDateLabel: formatAssignmentDueDate(locale, row.dueAt),
    id: row.id,
    order: row.order.toString().padStart(2, "0"),
    statusLabel: mapAssignmentStatusLabel(labels, row.status),
    statusTone: row.status,
    subjectName: row.subjectName,
    taskTitle: row.taskTitle,
    timeLabel: formatAssignmentTime(locale, row.dueAt),
  }))
}

export function mapStudentDashboardCalendarMonths(
  labels: {
    absent: string
    late: string
    present: string
    sick: string
  },
  record: StudentDashboardAttendanceCalendarRecord
) {
  return mapStudentAttendanceCalendarMonths(record).map((month) => ({
    ...month,
    summary: month.summary.map((item) => ({
      ...item,
      label:
        item.label === "Absent"
          ? labels.absent
          : item.label === "Late"
            ? labels.late
            : item.label === "Sick"
              ? labels.sick
              : labels.present,
    })),
  }))
}

export function buildDashboardMonth(value: string) {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function formatDashboardMonthTitle(locale: AppLocale, value: string) {
  const date = new Date(value)
  return formatCalendarMonth(locale, date.getMonth() + 1, date.getFullYear())
}

function buildAgendaDateLabel(locale: AppLocale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  }).format(new Date(value))
}

function resolveAgendaTagLabel(
  labels: {
    academic: string
    administration: string
    events: string
    exam: string
    finance: string
    holiday: string
    other: string
    sports: string
  },
  type: StudentDashboardAgendaRecord["data"][number]["type"]
) {
  return labels[type]
}

function resolveAgendaFallbackLocation(
  labels: {
    academic: string
    administration: string
    events: string
    exam: string
    finance: string
    holiday: string
    other: string
    sports: string
  },
  type: StudentDashboardAgendaRecord["data"][number]["type"]
) {
  return labels[type]
}

function resolveAgendaAccentClassName(type: StudentDashboardAgendaRecord["data"][number]["type"]) {
  if (type === "academic") {
    return "bg-[var(--talimy-color-sky)]"
  }

  if (type === "exam") {
    return "bg-[var(--talimy-color-pink)]"
  }

  if (type === "finance") {
    return "bg-[var(--talimy-color-navy)]"
  }

  if (type === "administration") {
    return "bg-[#ffe066]"
  }

  return "bg-[#e7ecf1]"
}
