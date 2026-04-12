"use client"

import type { ReactNode } from "react"
import { ArrowUpDown, FileText } from "lucide-react"
import {
  Button,
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
  FinanceReimbursementsResponse,
  FinanceReimbursementStatus,
} from "@/components/finance/admin/finance-expenses-api.types"
import { FinanceReimbursementStatusBadge } from "@/components/shared/finance/finance-reimbursement-status-badge"

type ReimbursementsTableCardProps = {
  actionLabels: {
    approve: string
    decline: string
    viewFile: string
  }
  columns: {
    amount: string
    datePaid: string
    proof: string
    requestName: string
    staffName: string
    status: string
  }
  emptyLabel: string
  filters: ReactNode
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
  getDepartmentLabel: (value: string) => string
  getStatusLabel: (status: Exclude<FinanceReimbursementStatus, "pending">) => string
  onStatusChange: (id: string, status: Exclude<FinanceReimbursementStatus, "pending">) => void
  rows: FinanceReimbursementsResponse["rows"]
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

export function ReimbursementsTableCard({
  actionLabels,
  columns,
  emptyLabel,
  filters,
  formatCurrency,
  formatDate,
  getDepartmentLabel,
  getStatusLabel,
  onStatusChange,
  rows,
  title,
}: ReimbursementsTableCardProps) {
  return (
    <Card className="rounded-[28px] border border-slate-100 bg-white py-0 shadow-none">
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-[18px] font-semibold text-talimy-navy">{title}</h3>
          {filters}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-[#fbfbfb] hover:bg-[#fbfbfb]">
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500 first:rounded-l-[18px]">
                  <SortableHeader>{columns.requestName}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.staffName}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.amount}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.datePaid}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  {columns.proof}
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500 last:rounded-r-[18px]">
                  {columns.status}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow className="border-b border-[#eef1f5] hover:bg-transparent" key={row.id}>
                    <TableCell className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="text-[13px] font-medium text-[#2da4d3]">{row.purpose}</div>
                        <div className="text-[12px] text-slate-500">
                          {getDepartmentLabel(row.department)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="text-[13px] font-medium text-slate-700">
                          {row.staffName}
                        </div>
                        <div className="text-[12px] text-slate-500">{row.department}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="text-[13px] font-semibold text-[#2da4d3]">
                          {formatCurrency(row.amount)}
                        </div>
                        <div className="text-[12px] text-slate-500">{row.purpose}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] font-medium text-slate-700">
                      {formatDate(row.submittedDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Button
                        className="h-7 rounded-[8px] border border-slate-100 bg-[#f7fbfd] px-3 text-[11px] font-medium text-slate-600 shadow-none hover:bg-[#eef7fb]"
                        type="button"
                        variant="ghost"
                      >
                        <FileText className="mr-1 size-3.5" />
                        {actionLabels.viewFile}
                      </Button>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {row.status === "pending" ? (
                        <div className="flex items-center gap-3 text-[13px] font-medium">
                          <button
                            className="text-[#2da4d3]"
                            onClick={() => onStatusChange(row.id, "approved")}
                            type="button"
                          >
                            {actionLabels.approve}
                          </button>
                          <button
                            className="text-[#ff5a5f]"
                            onClick={() => onStatusChange(row.id, "declined")}
                            type="button"
                          >
                            {actionLabels.decline}
                          </button>
                        </div>
                      ) : (
                        <FinanceReimbursementStatusBadge
                          label={getStatusLabel(row.status)}
                          status={row.status}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
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
