"use client"

import { Edit3, Plus, Search, Trash2 } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@talimy/ui"

import { cn } from "@/lib/utils"

export type AssignmentsPreviewStatusTone = "inProgress" | "notStarted" | "submitted"

export type AssignmentsPreviewTableRow = {
  actionHref?: string
  dueDateLabel: string
  id: string
  order: string
  statusLabel: string
  statusTone: AssignmentsPreviewStatusTone
  subjectName: string
  taskTitle: string
  timeLabel: string
}

type AssignmentsPreviewTableCardProps = {
  actionLabel: string
  className?: string
  columns: {
    action: string
    dueDate: string
    no: string
    status: string
    subject: string
    task: string
    time: string
  }
  emptyLabel: string
  onActionPress?: () => void
  onDelete?: (rowId: string) => void
  onEdit?: (rowId: string) => void
  onSearchChange?: (value: string) => void
  searchPlaceholder: string
  searchValue: string
  rows: readonly AssignmentsPreviewTableRow[]
  title: string
}

function StatusBadge({ label, tone }: { label: string; tone: AssignmentsPreviewStatusTone }) {
  const className =
    tone === "submitted"
      ? "bg-[#e7fbef] text-[#1e9c63]"
      : tone === "inProgress"
        ? "bg-[#eaf7ff] text-[#38a0d8]"
        : "bg-[#fff2f4] text-[#ff5e73]"

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-medium", className)}>
      {label}
    </span>
  )
}

export function AssignmentsPreviewTableCard({
  actionLabel,
  className,
  columns,
  emptyLabel,
  onActionPress,
  onDelete,
  onEdit,
  onSearchChange,
  searchPlaceholder,
  searchValue,
  rows,
  title,
}: AssignmentsPreviewTableCardProps) {
  return (
    <Card
      className={cn("rounded-[28px] border border-slate-100 bg-white py-0 shadow-none", className)}
    >
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-[18px] font-semibold text-talimy-navy">{title}</h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 md:w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-9 rounded-[12px] border border-slate-100 bg-white pl-10 pr-3 text-[12px] text-slate-600 placeholder:text-slate-400"
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                type="search"
                value={searchValue}
              />
            </div>
            <Button
              className="size-9 rounded-full bg-[#ffe066] p-0 text-talimy-navy shadow-none hover:bg-[#ffd84a]"
              onClick={onActionPress}
              type="button"
            >
              <Plus className="size-4" />
              <span className="sr-only">{actionLabel}</span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-slate-100">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-[#e9f8ff] hover:bg-[#e9f8ff]">
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500">
                  {columns.no}
                </TableHead>
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500">
                  {columns.task}
                </TableHead>
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500">
                  {columns.subject}
                </TableHead>
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500">
                  {columns.dueDate}
                </TableHead>
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500">
                  {columns.time}
                </TableHead>
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500">
                  {columns.status}
                </TableHead>
                <TableHead className="h-11 px-4 text-[12px] font-medium text-slate-500 text-right">
                  {columns.action}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow className="border-b border-slate-100 hover:bg-transparent" key={row.id}>
                    <TableCell className="px-4 py-4 text-[13px] text-slate-500">
                      {row.order}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-[13px] font-medium text-slate-700">
                      {row.taskTitle}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-[13px] text-slate-600">
                      {row.subjectName}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-[13px] text-slate-600">
                      {row.dueDateLabel}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-[13px] text-slate-600">
                      {row.timeLabel}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          className="transition-colors hover:text-talimy-navy"
                          onClick={() => onEdit?.(row.id)}
                          type="button"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          className="transition-colors hover:text-[#ff5e73]"
                          onClick={() => onDelete?.(row.id)}
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell className="px-4 py-10 text-center text-sm text-slate-400" colSpan={7}>
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
