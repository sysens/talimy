import type {
  AttendanceRosterGridStatus,
  AttendanceRosterGridStatusLabelMap,
} from "@/components/shared/attendance/attendance-roster-grid-card.types"

export type AttendanceRosterGridStatusTokens = {
  cellClassName: string
  label: string
  labelClassName: string
  noteClassName: string
}

const STATUS_TOKEN_STYLES: Record<
  AttendanceRosterGridStatus,
  Omit<AttendanceRosterGridStatusTokens, "label">
> = {
  absent: {
    cellClassName: "border-l-[3px] border-l-talimy-navy bg-talimy-navy/10",
    labelClassName: "text-talimy-navy",
    noteClassName: "text-talimy-navy/70",
  },
  holiday: {
    cellClassName: "border-l-[3px] border-l-slate-300 bg-slate-100",
    labelClassName: "text-slate-600",
    noteClassName: "text-slate-500",
  },
  late: {
    cellClassName:
      "border-l-[3px] border-l-[var(--talimy-color-pink)] bg-[var(--talimy-color-pink)]/16",
    labelClassName: "text-talimy-navy",
    noteClassName: "text-talimy-navy/70",
  },
  on_time: {
    cellClassName:
      "border-l-[3px] border-l-[var(--talimy-color-sky)] bg-[var(--talimy-color-sky)]/16",
    labelClassName: "text-talimy-navy",
    noteClassName: "text-talimy-navy/70",
  },
  weekend: {
    cellClassName: "border-l-[3px] border-l-slate-200 bg-slate-50",
    labelClassName: "text-slate-300",
    noteClassName: "text-slate-300",
  },
}

const DEFAULT_STATUS_LABELS: AttendanceRosterGridStatusLabelMap = {
  absent: "Absent",
  holiday: "Holiday",
  late: "Late",
  on_time: "On time",
  weekend: "—",
}

export function getAttendanceRosterGridStatusTokens(
  status: AttendanceRosterGridStatus,
  statusLabels?: Partial<AttendanceRosterGridStatusLabelMap>
): AttendanceRosterGridStatusTokens {
  const styles = STATUS_TOKEN_STYLES[status]

  return {
    ...styles,
    label: statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status],
  }
}
