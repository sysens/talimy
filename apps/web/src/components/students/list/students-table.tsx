"use client"

import type { ReactNode } from "react"
import { Chip, Table, cn, type SortDescriptor } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { PersonAvatar } from "@/components/shared/avatar/person-avatar"
import { StateBadge } from "@/components/shared/badges/state-badge"
import type {
  StudentListItem,
  StudentPerformanceLevel,
  StudentListStatus,
  StudentsTableSortDescriptor,
} from "@/components/students/list/students-list.types"

type StudentsTableProps = {
  items: readonly StudentListItem[]
  onSortChange: (descriptor: StudentsTableSortDescriptor) => void
  sortDescriptor: StudentsTableSortDescriptor
}

type AttendanceCircleProps = {
  value: number
}

type SortableColumnHeaderProps = {
  children: ReactNode
  sortDirection?: "ascending" | "descending"
}

const PERFORMANCE_BADGE_TONE: Record<
  StudentPerformanceLevel,
  "approved" | "cancelled" | "pending"
> = {
  atRisk: "cancelled",
  good: "approved",
  needsSupport: "pending",
}

const STATUS_CHIP_CLASS_NAMES: Record<StudentListStatus, string> = {
  active: "bg-emerald-400 text-white",
  onLeave: "bg-talimy-navy text-white",
  suspended: "bg-rose-500 text-white",
}

function AttendanceCircle({ value }: AttendanceCircleProps) {
  const radius = 8
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (value / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg aria-hidden="true" className="size-5 -rotate-90" viewBox="0 0 20 20">
        <circle cx="10" cy="10" fill="none" r={radius} stroke="#f5d7f7" strokeWidth="3" />
        <circle
          cx="10"
          cy="10"
          fill="none"
          r={radius}
          stroke="#f1aef6"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className="text-[13px] font-medium text-slate-700">{value}%</span>
    </div>
  )
}

function SortableColumnHeader({ children, sortDirection }: SortableColumnHeaderProps) {
  return (
    <span className="flex items-center gap-1">
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "text-[10px] text-slate-400 transition-transform duration-100 ease-out",
          sortDirection === "descending" ? "rotate-180" : ""
        )}
      >
        ↑
      </span>
    </span>
  )
}

function getGpaClassName(value: number): string {
  if (value >= 3.5) {
    return "font-semibold text-talimy-navy"
  }

  if (value < 2.5) {
    return "font-semibold text-rose-500"
  }

  return "font-medium text-sky-500"
}

function toSortDescriptor(descriptor: StudentsTableSortDescriptor): SortDescriptor {
  return descriptor
}

export function StudentsTable({ items, onSortChange, sortDescriptor }: StudentsTableProps) {
  const router = useRouter()
  const t = useTranslations("adminStudents.list.table")
  const statusT = useTranslations("adminStudents.list.filters.status")
  const performanceT = useTranslations("adminStudents.list.performance")

  function getAvatarFallback(name: string): string {
    return name
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-transparent">
      <Table className="bg-transparent" variant="secondary">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Students table"
            className="min-w-[920px] [&_tbody_tr:last-child_td]:border-b-0"
            onRowAction={(key) => router.push(`/admin/students/${String(key)}`)}
            sortDescriptor={toSortDescriptor(sortDescriptor)}
            onSortChange={(descriptor) => {
              if (
                descriptor.column === "student" ||
                descriptor.column === "class" ||
                descriptor.column === "gpa" ||
                descriptor.column === "performance" ||
                descriptor.column === "attendance" ||
                descriptor.column === "status"
              ) {
                onSortChange({
                  column: descriptor.column,
                  direction: descriptor.direction,
                })
              }
            }}
          >
            <Table.Header>
              <Table.Column
                allowsSorting
                className="w-[38%] bg-[#fbfbfb] px-4 py-3 text-[12px] font-medium text-slate-500 first:rounded-l-2xl"
                id="student"
                isRowHeader
              >
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    {t("student")}
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="w-[11%] bg-[#fbfbfb] px-4 py-3 text-[12px] font-medium text-slate-500"
                id="class"
              >
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    {t("class")}
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="w-[10%] bg-[#fbfbfb] px-4 py-3 text-[12px] font-medium text-slate-500"
                id="gpa"
              >
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    {t("gpa")}
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="w-[23%] bg-[#fbfbfb] px-4 py-3 text-[12px] font-medium text-slate-500"
                id="performance"
              >
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    {t("performance")}
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="w-[10%] bg-[#fbfbfb] px-4 py-3 text-[12px] font-medium text-slate-500"
                id="attendance"
              >
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    {t("attendance")}
                  </SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="w-[12%] bg-[#fbfbfb] px-4 py-3 text-[12px] font-medium text-slate-500 last:rounded-r-2xl"
                id="status"
              >
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>
                    {t("status")}
                  </SortableColumnHeader>
                )}
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {items.map((student) => (
                <Table.Row
                  className="cursor-pointer outline-none transition-colors hover:bg-slate-50"
                  id={student.id}
                  key={student.id}
                >
                  <Table.Cell className="border-b border-[#eef1f5] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <PersonAvatar
                        alt={student.name}
                        className="size-10 rounded-full"
                        fallback={getAvatarFallback(student.name)}
                        fallbackClassName="bg-[var(--talimy-color-pink)]/45 text-[11px] font-semibold text-talimy-navy"
                        src={student.avatarUrl}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium leading-none text-slate-700">
                          {student.name}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">{student.studentCode}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="border-b border-[#eef1f5] px-4 py-4 text-[13px] text-slate-700">
                    {student.classLabel}
                  </Table.Cell>
                  <Table.Cell
                    className={cn(
                      "border-b border-[#eef1f5] px-4 py-4 text-[13px]",
                      getGpaClassName(student.gpa)
                    )}
                  >
                    {student.gpa.toFixed(1)}
                  </Table.Cell>
                  <Table.Cell className="border-b border-[#eef1f5] px-4 py-4">
                    <StateBadge
                      className="h-7 rounded-xl px-2.5 text-[11px]"
                      label={
                        student.performance === "good"
                          ? performanceT("good")
                          : student.performance === "needsSupport"
                            ? performanceT("needsSupport")
                            : performanceT("atRisk")
                      }
                      tone={PERFORMANCE_BADGE_TONE[student.performance]}
                    />
                  </Table.Cell>
                  <Table.Cell className="border-b border-[#eef1f5] px-4 py-4">
                    <AttendanceCircle value={student.attendancePercentage} />
                  </Table.Cell>
                  <Table.Cell className="border-b border-[#eef1f5] px-4 py-4">
                    <Chip
                      className={cn(
                        "h-6 rounded-full px-2.5 text-[11px] font-medium shadow-none",
                        STATUS_CHIP_CLASS_NAMES[student.status]
                      )}
                      size="sm"
                      variant="soft"
                    >
                      {student.status === "active"
                        ? statusT("active")
                        : student.status === "onLeave"
                          ? statusT("onLeave")
                          : statusT("suspended")}
                    </Chip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  )
}
