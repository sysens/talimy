"use client"

import type { Table } from "@tanstack/react-table"
import type { ReactNode } from "react"
import { XIcon } from "lucide-react"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import type { DataTableFacetedFilterOption } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"

type DataTableToolbarFilter<TData> = {
  columnId: keyof TData & string
  title: string
  options: DataTableFacetedFilterOption[]
}

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchColumnId?: keyof TData & string
  searchPlaceholder?: string
  facetedFilters?: DataTableToolbarFilter<TData>[]
  children?: ReactNode
}

function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = "Search...",
  facetedFilters = [],
  children,
}: DataTableToolbarProps<TData>) {
  const hasFilters = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {searchColumnId && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchColumnId)?.getFilterValue() as string | undefined) ?? ""}
            onChange={(event) =>
              table.getColumn(searchColumnId)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {facetedFilters.map((filter) => (
          <DataTableFacetedFilter
            key={filter.columnId}
            column={table.getColumn(filter.columnId)}
            title={filter.title}
            options={filter.options}
          />
        ))}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <XIcon className="ml-2 size-4" />
          </Button>
        )}

        {children}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

export { DataTableToolbar }
export type { DataTableToolbarFilter }
