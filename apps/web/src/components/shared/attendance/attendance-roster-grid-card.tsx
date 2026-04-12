"use client"

import type {
  AttendanceRosterGridCell,
  AttendanceRosterGridCellChange,
  AttendanceRosterGridColumn,
  AttendanceRosterGridEditableStatus,
  AttendanceRosterGridRow,
  AttendanceRosterGridStatus,
  AttendanceRosterGridStatusLabelMap,
} from "@/components/shared/attendance/attendance-roster-grid-card.types"

import { Table } from "@heroui/react"
import {
  Button,
  Card,
  CardContent,
  Input,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  cn,
} from "@talimy/ui"
import { Check, Clock3, X } from "lucide-react"
import { useEffect, useState } from "react"

import { PersonAvatar } from "@/components/shared/avatar/person-avatar"
import { getAttendanceRosterGridStatusTokens } from "@/components/shared/attendance/attendance-roster-grid-card.utils"

type AttendanceRosterGridCardProps = {
  ariaLabel?: string
  className?: string
  columns: readonly AttendanceRosterGridColumn[]
  emptyState?: string
  labels?: Partial<AttendanceRosterGridLabels>
  locale?: string
  onCellChange?: (change: AttendanceRosterGridCellChange) => void
  profileColumnLabel?: string
  rows: readonly AttendanceRosterGridRow[]
  statusLabels?: Partial<AttendanceRosterGridStatusLabelMap>
}

type AttendanceRosterGridLabels = {
  cancel: string
  editorDescription: string
  editorTitle: string
  reasonPlaceholder: string
  save: string
}

type AttendanceRosterGridEditableCellProps = {
  cell: AttendanceRosterGridCell
  labels: AttendanceRosterGridLabels
  onCellChange?: (change: AttendanceRosterGridCellChange) => void
  rowId: string
  statusLabels: AttendanceRosterGridStatusLabelMap
}

type AttendanceRosterGridStatusVisualProps = {
  cell: AttendanceRosterGridCell
  statusLabels: AttendanceRosterGridStatusLabelMap
}

type EditableOption = {
  icon: typeof Check
  value: AttendanceRosterGridEditableStatus
}

const DEFAULT_LABELS: AttendanceRosterGridLabels = {
  cancel: "Bekor qilish",
  editorDescription: "Holatni yangilang va kerak bo'lsa sabab kiriting.",
  editorTitle: "Davomat",
  reasonPlaceholder: "Sababni kiriting",
  save: "Saqlash",
}

const DEFAULT_STATUS_LABELS: AttendanceRosterGridStatusLabelMap = {
  absent: "Absent",
  holiday: "Holiday",
  late: "Late",
  on_time: "On time",
  weekend: "—",
}

const EDITABLE_OPTIONS: readonly EditableOption[] = [
  { icon: Check, value: "on_time" },
  { icon: Clock3, value: "late" },
  { icon: X, value: "absent" },
]

function formatWeekdayLabel(column: AttendanceRosterGridColumn, locale: string): string {
  const date = new Date(`${column.id}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    return column.weekdayLabel
  }

  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "short" }).format(date)
}

function AttendanceRosterGridHeader({
  column,
  locale,
}: {
  column: AttendanceRosterGridColumn
  locale: string
}) {
  return (
    <div className="flex flex-col gap-0.5 text-center">
      <span className="text-sm font-semibold leading-none text-slate-700">{column.dateLabel}</span>
      <span className="text-[11px] text-slate-400">{formatWeekdayLabel(column, locale)}</span>
    </div>
  )
}

function AttendanceRosterGridProfileCell({ row }: { row: AttendanceRosterGridRow }) {
  return (
    <div className="flex items-center gap-3">
      <PersonAvatar
        alt={row.profile.name}
        className="size-9 rounded-full"
        fallback={row.profile.avatarFallback}
        fallbackClassName="bg-[var(--talimy-color-pink)]/35 text-[11px] font-semibold text-talimy-navy"
        src={row.profile.avatarSrc}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700">{row.profile.name}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{row.profile.idLabel}</p>
      </div>
    </div>
  )
}

function AttendanceRosterGridStatusVisual({
  cell,
  statusLabels,
}: AttendanceRosterGridStatusVisualProps) {
  const tokens = getAttendanceRosterGridStatusTokens(cell.status, statusLabels)

  return (
    <div
      className={cn(
        "flex min-h-[74px] w-full flex-col items-center justify-center gap-1 px-3 py-2 text-center",
        tokens.cellClassName
      )}
    >
      <span className={cn("text-[12px] font-medium leading-none", tokens.labelClassName)}>
        {tokens.label}
      </span>
      {cell.note ? (
        <span className={cn("line-clamp-2 text-[10px] leading-4", tokens.noteClassName)}>
          {cell.note}
        </span>
      ) : null}
    </div>
  )
}

function resolveEditableStatus(
  status: AttendanceRosterGridStatus
): AttendanceRosterGridEditableStatus {
  if (status === "late" || status === "absent") {
    return status
  }

  return "on_time"
}

function isEditableCell(cell: AttendanceRosterGridCell): boolean {
  if (cell.editable === false) {
    return false
  }

  return cell.status !== "holiday" && cell.status !== "weekend"
}

function AttendanceRosterGridEditableCell({
  cell,
  labels,
  onCellChange,
  rowId,
  statusLabels,
}: AttendanceRosterGridEditableCellProps) {
  const [draftNote, setDraftNote] = useState(cell.note ?? "")
  const [draftStatus, setDraftStatus] = useState<AttendanceRosterGridEditableStatus>(
    resolveEditableStatus(cell.status)
  )
  const [open, setOpen] = useState(false)

  const editable = typeof onCellChange === "function" && isEditableCell(cell)

  useEffect(() => {
    setDraftNote(cell.note ?? "")
    setDraftStatus(resolveEditableStatus(cell.status))
  }, [cell.note, cell.status])

  if (!editable) {
    return <AttendanceRosterGridStatusVisual cell={cell} statusLabels={statusLabels} />
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-full overflow-hidden rounded-none border-0 p-0 hover:bg-transparent"
          type="button"
          variant="ghost"
        >
          <AttendanceRosterGridStatusVisual cell={cell} statusLabels={statusLabels} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-[256px] rounded-[20px] border border-slate-100 p-3 shadow-sm"
      >
        <PopoverHeader>
          <PopoverTitle className="text-sm font-semibold text-talimy-navy">
            {labels.editorTitle}
          </PopoverTitle>
        </PopoverHeader>
        <div className="grid grid-cols-3 gap-2">
          {EDITABLE_OPTIONS.map((option) => {
            const Icon = option.icon
            const selected = draftStatus === option.value

            return (
              <Button
                className={cn(
                  "h-9 rounded-[14px] border-slate-200 px-2 text-[11px] font-medium",
                  selected
                    ? "border-[var(--talimy-color-sky)] bg-[var(--talimy-color-sky)]/20 text-talimy-navy"
                    : "text-slate-600"
                )}
                key={option.value}
                size="sm"
                type="button"
                variant="outline"
                onClick={() => setDraftStatus(option.value)}
              >
                <Icon className="size-3.5" />
                {statusLabels[option.value]}
              </Button>
            )
          })}
        </div>
        <PopoverDescription className="text-xs text-slate-500">
          {labels.editorDescription}
        </PopoverDescription>
        <Input
          placeholder={labels.reasonPlaceholder}
          value={draftNote}
          onChange={(event) => setDraftNote(event.target.value)}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button size="sm" type="button" variant="outline" onClick={() => setOpen(false)}>
            {labels.cancel}
          </Button>
          <Button
            className="bg-talimy-navy text-white hover:bg-talimy-navy/90"
            size="sm"
            type="button"
            onClick={() => {
              onCellChange?.({
                columnId: cell.columnId,
                note: draftNote.trim().length > 0 ? draftNote.trim() : undefined,
                rowId,
                status: draftStatus,
              })
              setOpen(false)
            }}
          >
            {labels.save}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function resolveFallbackStatus(column: AttendanceRosterGridColumn): AttendanceRosterGridStatus {
  const date = new Date(`${column.id}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    return /sat|sun/i.test(column.weekdayLabel) ? "weekend" : "on_time"
  }

  const weekday = date.getUTCDay()
  return weekday === 0 || weekday === 6 ? "weekend" : "on_time"
}

function resolveCell(
  row: AttendanceRosterGridRow,
  column: AttendanceRosterGridColumn
): AttendanceRosterGridCell {
  const matchedCell = row.cells.find((cell) => cell.columnId === column.id)

  if (matchedCell) {
    return matchedCell
  }

  return {
    columnId: column.id,
    editable: false,
    status: resolveFallbackStatus(column),
  }
}

export function AttendanceRosterGridCard({
  ariaLabel = "Attendance roster grid",
  className,
  columns,
  emptyState = "Ma'lumot topilmadi.",
  labels,
  locale = "en",
  onCellChange,
  profileColumnLabel = "Student Profile",
  rows,
  statusLabels,
}: AttendanceRosterGridCardProps) {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels }
  const mergedStatusLabels = { ...DEFAULT_STATUS_LABELS, ...statusLabels }

  return (
    <Card
      className={cn(
        "w-full rounded-[28px] border border-slate-100 bg-white py-0 shadow-none",
        className
      )}
    >
      <CardContent className="p-4">
        <Table className="bg-transparent" variant="secondary">
          <Table.ScrollContainer>
            {rows.length === 0 ? (
              <div className="flex min-h-56 items-center justify-center rounded-[22px] border border-dashed border-slate-200 text-sm text-slate-400">
                {emptyState}
              </div>
            ) : (
              <Table.Content
                aria-label={ariaLabel}
                className="min-w-[1120px] [&_tbody_tr:last-child_td]:border-b-0"
              >
                <Table.Header>
                  <Table.Column
                    className="sticky left-0 z-30 min-w-[260px] border-r border-slate-200 bg-white px-4 py-4 text-left first:rounded-l-[20px]"
                    isRowHeader
                  >
                    <span className="text-xs font-medium text-slate-500">{profileColumnLabel}</span>
                  </Table.Column>
                  {columns.map((column) => (
                    <Table.Column
                      className="min-w-[122px] border-b border-slate-100 bg-white px-0 py-3 text-center last:rounded-r-[20px]"
                      id={column.id}
                      key={column.id}
                    >
                      <AttendanceRosterGridHeader column={column} locale={locale} />
                    </Table.Column>
                  ))}
                </Table.Header>
                <Table.Body>
                  {rows.map((row) => (
                    <Table.Row id={row.id} key={row.id}>
                      <Table.Cell className="sticky left-0 z-20 border-b border-r border-slate-200 bg-white px-4 py-3 align-middle">
                        <AttendanceRosterGridProfileCell row={row} />
                      </Table.Cell>
                      {columns.map((column) => (
                        <Table.Cell
                          className="overflow-hidden border-b border-slate-100 px-0 py-0 align-stretch"
                          key={column.id}
                        >
                          <AttendanceRosterGridEditableCell
                            cell={resolveCell(row, column)}
                            labels={mergedLabels}
                            onCellChange={onCellChange}
                            rowId={row.id}
                            statusLabels={mergedStatusLabels}
                          />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            )}
          </Table.ScrollContainer>
        </Table>
      </CardContent>
    </Card>
  )
}
