"use client"

import { useState } from "react"

import { AttendanceRosterGridCard } from "@/components/shared/attendance/attendance-roster-grid-card"
import type {
  AttendanceRosterGridCell,
  AttendanceRosterGridColumn,
  AttendanceRosterGridRow,
} from "@/components/shared/attendance/attendance-roster-grid-card.types"

const SHOWCASE_COLUMNS: readonly AttendanceRosterGridColumn[] = [
  { dateLabel: "23", id: "2025-03-23", weekdayLabel: "Monday" },
  { dateLabel: "24", id: "2025-03-24", weekdayLabel: "Tuesday" },
  { dateLabel: "25", id: "2025-03-25", weekdayLabel: "Wednesday" },
  { dateLabel: "26", id: "2025-03-26", weekdayLabel: "Thursday" },
  { dateLabel: "27", id: "2025-03-27", weekdayLabel: "Friday" },
  { dateLabel: "28", id: "2025-03-28", weekdayLabel: "Saturday" },
  { dateLabel: "29", id: "2025-03-29", weekdayLabel: "Sunday" },
]

const SHOWCASE_ROWS: readonly AttendanceRosterGridRow[] = [
  {
    cells: [
      { columnId: "2025-03-23", status: "on_time" },
      { columnId: "2025-03-24", status: "on_time" },
      { columnId: "2025-03-25", editable: false, note: "Annual Book Fair", status: "holiday" },
      { columnId: "2025-03-26", status: "on_time" },
      { columnId: "2025-03-27", status: "on_time" },
      { columnId: "2025-03-28", editable: false, status: "weekend" },
      { columnId: "2025-03-29", editable: false, status: "weekend" },
    ],
    id: "student-1",
    profile: {
      avatarFallback: "MA",
      avatarSrc: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
      idLabel: "S-2001 · 9A",
      name: "Marta Adams",
    },
  },
  {
    cells: [
      { columnId: "2025-03-23", note: "Health Problem", status: "absent" },
      { columnId: "2025-03-24", status: "on_time" },
      { columnId: "2025-03-25", editable: false, note: "Annual Book Fair", status: "holiday" },
      { columnId: "2025-03-26", status: "on_time" },
      { columnId: "2025-03-27", status: "on_time" },
      { columnId: "2025-03-28", editable: false, status: "weekend" },
      { columnId: "2025-03-29", editable: false, status: "weekend" },
    ],
    id: "student-2",
    profile: {
      avatarFallback: "RL",
      avatarSrc: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
      idLabel: "S-2002 · 9A",
      name: "Rocin Logan",
    },
  },
  {
    cells: [
      { columnId: "2025-03-23", status: "on_time" },
      { columnId: "2025-03-24", note: "Traffic Jam", status: "late" },
      { columnId: "2025-03-25", editable: false, note: "Annual Book Fair", status: "holiday" },
      { columnId: "2025-03-26", status: "on_time" },
      { columnId: "2025-03-27", status: "on_time" },
      { columnId: "2025-03-28", editable: false, status: "weekend" },
      { columnId: "2025-03-29", editable: false, status: "weekend" },
    ],
    id: "student-3",
    profile: {
      avatarFallback: "CF",
      avatarSrc: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
      idLabel: "S-2003 · 9A",
      name: "Cuzt French",
    },
  },
  {
    cells: [
      { columnId: "2025-03-23", status: "on_time" },
      { columnId: "2025-03-24", status: "on_time" },
      { columnId: "2025-03-25", editable: false, note: "Annual Book Fair", status: "holiday" },
      { columnId: "2025-03-26", status: "on_time" },
      { columnId: "2025-03-27", note: "Health Problem", status: "absent" },
      { columnId: "2025-03-28", editable: false, status: "weekend" },
      { columnId: "2025-03-29", editable: false, status: "weekend" },
    ],
    id: "student-4",
    profile: {
      avatarFallback: "MC",
      avatarSrc: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
      idLabel: "S-2004 · 9A",
      name: "Claude Cherry",
    },
  },
  {
    cells: [
      { columnId: "2025-03-23", status: "on_time" },
      { columnId: "2025-03-24", status: "on_time" },
      { columnId: "2025-03-25", editable: false, note: "Annual Book Fair", status: "holiday" },
      { columnId: "2025-03-26", note: "Family Problem", status: "late" },
      { columnId: "2025-03-27", status: "on_time" },
      { columnId: "2025-03-28", editable: false, status: "weekend" },
      { columnId: "2025-03-29", editable: false, status: "weekend" },
    ],
    id: "student-5",
    profile: {
      avatarFallback: "MH",
      avatarSrc: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
      idLabel: "S-2005 · 9A",
      name: "Mitch Hiper",
    },
  },
  {
    cells: [
      { columnId: "2025-03-23", note: "Traffic Jam", status: "late" },
      { columnId: "2025-03-24", status: "on_time" },
      { columnId: "2025-03-25", editable: false, note: "Annual Book Fair", status: "holiday" },
      { columnId: "2025-03-26", status: "on_time" },
      { columnId: "2025-03-27", status: "on_time" },
      { columnId: "2025-03-28", editable: false, status: "weekend" },
      { columnId: "2025-03-29", editable: false, status: "weekend" },
    ],
    id: "student-6",
    profile: {
      avatarFallback: "EF",
      avatarSrc: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/pink.jpg",
      idLabel: "S-2006 · 9A",
      name: "Essie Fry",
    },
  },
]

export function AttendanceRosterGridCardShowcase() {
  const [rows, setRows] = useState<readonly AttendanceRosterGridRow[]>(SHOWCASE_ROWS)

  return (
    <AttendanceRosterGridCard
      ariaLabel="Attendance roster grid showcase"
      columns={SHOWCASE_COLUMNS}
      rows={rows}
      onCellChange={({ columnId, note, rowId, status }) => {
        setRows((currentRows) =>
          currentRows.map((row) => {
            if (row.id !== rowId) {
              return row
            }

            const hasCell = row.cells.some((cell) => cell.columnId === columnId)
            const nextCell: AttendanceRosterGridCell = {
              columnId,
              note,
              status,
            }

            return {
              ...row,
              cells: hasCell
                ? row.cells.map((cell) =>
                    cell.columnId === columnId ? { ...cell, note, status } : cell
                  )
                : [...row.cells, nextCell],
            }
          })
        )
      }}
    />
  )
}
