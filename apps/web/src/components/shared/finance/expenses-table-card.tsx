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

import type { FinanceExpensesListResponse } from "@/components/finance/admin/finance-expenses-api.types"
import { FinanceExpenseCategoryBadge } from "@/components/shared/finance/finance-expense-category-badge"

type ExpensesTableCardProps = {
  columns: {
    amount: string
    category: string
    date: string
    department: string
    description: string
    quantity: string
  }
  emptyLabel: string
  filters: ReactNode
  formatAmount: (value: number) => string
  formatDate: (value: string) => string
  getCategoryLabel: (
    categoryId: FinanceExpensesListResponse["rows"][number]["categoryId"]
  ) => string
  getDepartmentLabel: (value: string) => string
  rows: FinanceExpensesListResponse["rows"]
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

export function ExpensesTableCard({
  columns,
  emptyLabel,
  filters,
  formatAmount,
  formatDate,
  getCategoryLabel,
  getDepartmentLabel,
  rows,
  title,
}: ExpensesTableCardProps) {
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
                  <SortableHeader>{columns.date}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.department}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.category}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500">
                  <SortableHeader>{columns.description}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500 text-center">
                  <SortableHeader>{columns.quantity}</SortableHeader>
                </TableHead>
                <TableHead className="h-11 px-5 text-[12px] font-medium text-slate-500 text-right last:rounded-r-[18px]">
                  <SortableHeader>{columns.amount}</SortableHeader>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow className="border-b border-[#eef1f5] hover:bg-transparent" key={row.id}>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-700">
                      {formatDate(row.expenseDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-700">
                      {getDepartmentLabel(row.department)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <FinanceExpenseCategoryBadge
                        category={row.categoryId}
                        label={row.categoryLabel ?? getCategoryLabel(row.categoryId)}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-slate-700">
                      {row.description}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-[13px] text-slate-500">
                      {row.quantity ?? "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-[13px] font-semibold text-[#ff5a5f]">
                      {formatAmount(row.amount)}
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
