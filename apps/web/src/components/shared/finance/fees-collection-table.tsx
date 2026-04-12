"use client"

import type { ReactNode } from "react"
import { ArrowUpDown } from "lucide-react"
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@talimy/ui"

import type {
  FinanceFeeCategory,
  FinanceFeeStatus,
  FinanceFeesListResponse,
} from "@/components/finance/admin/finance-fees-api.types"
import { FinanceFeesStatusBadge } from "@/components/shared/finance/finance-fees-status-badge"

type FeesCollectionTableProps = {
  columns: {
    classLabel: string
    dueDate: string
    feeCategory: string
    status: string
    student: string
    totalAmount: string
  }
  emptyLabel: string
  filters: ReactNode
  formatDueDate: (value: string) => string
  formatMoney: (value: number) => string
  getCategoryLabel: (categoryId: FinanceFeeCategory) => string
  getStatusLabel: (status: FinanceFeeStatus) => string
  rows: FinanceFeesListResponse["rows"]
  title: string
}

function SortableHeader({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{children}</span>
      <ArrowUpDown className="size-3 text-slate-400" />
    </span>
  )
}

export function FeesCollectionTable({
  columns,
  emptyLabel,
  filters,
  formatDueDate,
  formatMoney,
  getCategoryLabel,
  getStatusLabel,
  rows,
  title,
}: FeesCollectionTableProps) {
  return (
    <Card className="rounded-[28px] border border-slate-100 bg-white shadow-none">
      <CardContent className="space-y-5 p-5 py-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-[18px] font-semibold text-talimy-navy">{title}</h3>
          {filters}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-[#fbfbfb] hover:bg-[#fbfbfb]">
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500 first:rounded-l-[18px]">
                  <SortableHeader>{columns.student}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.classLabel}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.feeCategory}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.totalAmount}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.dueDate}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500 last:rounded-r-[18px]">
                  <SortableHeader>{columns.status}</SortableHeader>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.flatMap((group) =>
                  group.items.map((item, index) => (
                    <TableRow
                      className="border-b border-[#eef1f5] hover:bg-transparent"
                      key={`${group.studentId}-${item.categoryId}`}
                    >
                      {index === 0 ? (
                        <TableCell className="align-top px-5 py-4" rowSpan={group.items.length}>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-6 items-center rounded-[8px] bg-[var(--talimy-color-sky)]/45 px-2 text-[11px] font-medium text-[#2da4d3]">
                              {group.studentCode}
                            </span>
                            <span className="text-[13px] font-medium text-slate-700">
                              {group.studentName}
                            </span>
                          </div>
                        </TableCell>
                      ) : null}
                      {index === 0 ? (
                        <TableCell
                          className="align-top px-5 py-4 text-[13px] text-slate-700"
                          rowSpan={group.items.length}
                        >
                          {group.classLabel}
                        </TableCell>
                      ) : null}
                      <TableCell className="px-5 py-4 text-[13px] text-slate-700">
                        {getCategoryLabel(item.categoryId)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] text-slate-700">
                        {formatMoney(item.totalAmount)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] text-slate-700">
                        {formatDueDate(item.dueDate)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <FinanceFeesStatusBadge
                          label={getStatusLabel(item.status)}
                          status={item.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell className="px-5 py-10 text-center text-sm text-slate-500" colSpan={6}>
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
