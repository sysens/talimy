"use client"

import * as React from "react"
import { Chip } from "@heroui/react"

import { RecordsTableCard } from "@/components/shared/records/records-table-card"
import type {
  RecordsTableCardColumn,
  RecordsTableCardFilterOption,
} from "@/components/shared/records/records-table-card.types"

type TrainingStatus = "cancelled" | "completed" | "upcoming"

type TrainingRow = {
  dateLabel: string
  eventSubtitle: string
  eventTitle: string
  id: string
  locationLabel: string
  status: TrainingStatus
}

const FILTER_OPTIONS: readonly RecordsTableCardFilterOption[] = [
  { label: "This Semester", value: "currentSemester" },
  { label: "Last Semester", value: "lastSemester" },
] as const

const CURRENT_SEMESTER_ROWS: readonly TrainingRow[] = [
  {
    dateLabel: "Apr 2, 2035",
    eventSubtitle: "Training",
    eventTitle: "Digital Learning Tools Training",
    id: "training-1",
    locationLabel: "Zoom - International Education Network",
    status: "upcoming",
  },
  {
    dateLabel: "Feb 8, 2035",
    eventSubtitle: "Certification",
    eventTitle: "Classroom Management Certification",
    id: "training-2",
    locationLabel: "Cambridge University Online (UK)",
    status: "completed",
  },
  {
    dateLabel: "Jan 12, 2035",
    eventSubtitle: "Workshop",
    eventTitle: "Advanced English Teaching Methods",
    id: "training-3",
    locationLabel: "London, UK - British Council",
    status: "completed",
  },
] as const

const LAST_SEMESTER_ROWS: readonly TrainingRow[] = [
  {
    dateLabel: "Nov 18, 2034",
    eventSubtitle: "Workshop",
    eventTitle: "Inclusive Classroom Practice",
    id: "training-4",
    locationLabel: "Cambridge Regional Hub",
    status: "completed",
  },
  {
    dateLabel: "Oct 4, 2034",
    eventSubtitle: "Training",
    eventTitle: "Digital Assessment Tools",
    id: "training-5",
    locationLabel: "Zoom - Global Teacher Lab",
    status: "completed",
  },
  {
    dateLabel: "Sep 14, 2034",
    eventSubtitle: "Certification",
    eventTitle: "Student Engagement Certification",
    id: "training-6",
    locationLabel: "Tashkent Education Forum",
    status: "cancelled",
  },
] as const

const ROWS_BY_FILTER = {
  currentSemester: CURRENT_SEMESTER_ROWS,
  lastSemester: LAST_SEMESTER_ROWS,
} as const

function getStatusChipClassName(status: TrainingStatus): string {
  if (status === "completed") {
    return "bg-[#d9f1f7] text-talimy-navy"
  }

  if (status === "cancelled") {
    return "bg-[#ffd8d8] text-[#b94343]"
  }

  return "bg-[#f6c9f8] text-talimy-navy"
}

const COLUMNS: readonly RecordsTableCardColumn<TrainingRow>[] = [
  {
    columnClassName: "w-[38%] min-w-[240px]",
    key: "event",
    label: "Event",
    render: (row) => (
      <div className="min-w-0 space-y-0.5">
        <p className="text-[14px] font-medium leading-5 text-slate-700">{row.eventTitle}</p>
        <p className="text-[13px] leading-5 text-slate-400">{row.eventSubtitle}</p>
      </div>
    ),
    sortable: true,
  },
  {
    columnClassName: "w-[16%] min-w-[120px]",
    key: "date",
    label: "Date",
    render: (row) => <span className="font-medium text-[#1f8ccd]">{row.dateLabel}</span>,
    sortable: true,
  },
  {
    columnClassName: "w-[28%] min-w-[210px]",
    key: "location",
    label: "Loc/Platform",
    render: (row) => <span className="leading-6 text-slate-700">{row.locationLabel}</span>,
    sortable: true,
  },
  {
    cellClassName: "justify-start",
    columnClassName: "w-[18%] min-w-[120px]",
    key: "status",
    label: "Status",
    render: (row) => (
      <Chip
        className={`h-7 rounded-full px-2.5 text-[13px] font-medium shadow-none ${getStatusChipClassName(row.status)}`}
        size="sm"
      >
        {row.status === "completed"
          ? "Completed"
          : row.status === "cancelled"
            ? "Cancelled"
            : "Upcoming"}
      </Chip>
    ),
    sortable: true,
  },
] as const

export function RecordsTableCardShowcase() {
  const [filterValue, setFilterValue] =
    React.useState<keyof typeof ROWS_BY_FILTER>("currentSemester")

  return (
    <RecordsTableCard
      className="max-w-4xl"
      columns={COLUMNS}
      filterAriaLabel="Development and training filter"
      filterOptions={FILTER_OPTIONS}
      filterValue={filterValue}
      getRowKey={(row) => row.id}
      onFilterChange={(value) => {
        if (value === "currentSemester" || value === "lastSemester") {
          setFilterValue(value)
        }
      }}
      rows={ROWS_BY_FILTER[filterValue]}
      title="Development & Training"
    />
  )
}
