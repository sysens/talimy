"use client"

import type { ReactNode } from "react"
import { ArrowUpDown } from "lucide-react"
import { Table } from "@heroui/react"

import { Card, CardContent, ChartFilterSelect, cn } from "@talimy/ui"

import type {
  RecordsTableCardColumn,
  RecordsTableCardFilterOption,
} from "@/components/shared/records/records-table-card.types"

type RecordsTableCardProps<TItem> = {
  className?: string
  columns: readonly RecordsTableCardColumn<TItem>[]
  emptyState?: string
  filterAriaLabel?: string
  getRowKey: (item: TItem) => string
  headerEnd?: ReactNode
  filterOptions?: readonly RecordsTableCardFilterOption[]
  filterValue?: string
  onFilterChange?: (value: string) => void
  rows: readonly TItem[]
  tableContentClassName?: string
  title: string
}

const DEFAULT_COLUMN_CLASS_NAMES = [
  "w-[38%] min-w-[240px]",
  "w-[16%] min-w-[120px]",
  "w-[28%] min-w-[210px]",
  "w-[18%] min-w-[120px]",
] as const

function resolveColumnClassName<TItem>(
  column: RecordsTableCardColumn<TItem>,
  index: number
): string {
  return column.columnClassName ?? DEFAULT_COLUMN_CLASS_NAMES[index] ?? "min-w-[120px]"
}

export function RecordsTableCard<TItem>({
  className,
  columns,
  emptyState = "No records found.",
  filterAriaLabel = "Records table filter",
  getRowKey,
  headerEnd,
  filterOptions,
  filterValue,
  onFilterChange,
  rows,
  tableContentClassName,
  title,
}: RecordsTableCardProps<TItem>) {
  const shouldShowFilter =
    Array.isArray(filterOptions) && filterOptions.length > 0 && typeof filterValue === "string"

  return (
    <Card
      className={cn(
        "w-full rounded-[28px] border border-slate-100 bg-white shadow-none py-0",
        className
      )}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[16px] font-semibold leading-none text-talimy-navy">{title}</h3>

          {shouldShowFilter ? (
            <ChartFilterSelect
              ariaLabel={filterAriaLabel}
              className="shrink-0"
              onValueChange={onFilterChange}
              options={[...filterOptions]}
              triggerClassName="h-10 min-w-[144px] rounded-2xl px-3 text-sm font-semibold"
              value={filterValue}
            />
          ) : (
            (headerEnd ?? null)
          )}
        </div>

        <Table className="bg-transparent" variant="secondary">
          <Table.ScrollContainer>
            {rows.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
                {emptyState}
              </div>
            ) : (
              <Table.Content
                aria-label={title}
                className={cn(
                  "min-w-[820px] [&_tbody_tr:last-child_td]:border-b-0",
                  tableContentClassName
                )}
              >
                <Table.Header>
                  {columns.map((column, index) => (
                    <Table.Column
                      className={cn(
                        "bg-[#f8fafc] px-3 py-3 text-[12px] font-medium text-slate-500 first:rounded-l-2xl last:rounded-r-2xl",
                        resolveColumnClassName(column, index),
                        column.headerClassName
                      )}
                      isRowHeader={index === 0}
                      key={column.key}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{column.label}</span>
                        {column.sortable ? <ArrowUpDown className="size-3 text-slate-400" /> : null}
                      </div>
                    </Table.Column>
                  ))}
                </Table.Header>

                <Table.Body>
                  {rows.map((row) => (
                    <Table.Row id={getRowKey(row)} key={getRowKey(row)}>
                      {columns.map((column, index) => (
                        <Table.Cell
                          className={cn(
                            "border-b border-[#e9edf2] px-3 py-4 align-top text-[14px] leading-6 text-slate-700",
                            resolveColumnClassName(column, index),
                            column.cellClassName
                          )}
                          key={column.key}
                        >
                          {column.render(row)}
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
