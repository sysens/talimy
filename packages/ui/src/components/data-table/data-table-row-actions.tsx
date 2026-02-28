"use client"

import type { Row } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { EllipsisIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type DataTableRowAction<TData> = {
  label: string
  icon?: LucideIcon
  onClick: (row: TData) => void
  destructive?: boolean
  disabled?: boolean
}

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
  onView?: (row: TData) => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  actions?: DataTableRowAction<TData>[]
}

function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  const hasBuiltIns = Boolean(onView || onEdit || onDelete)
  const hasCustomActions = actions.length > 0
  const hasAnyAction = hasBuiltIns || hasCustomActions

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="size-8 p-0" disabled={!hasAnyAction}>
          <span className="sr-only">Open menu</span>
          <EllipsisIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {onView && (
          <DropdownMenuItem onClick={() => onView(row.original)}>
            <EyeIcon className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <PencilIcon className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive focus:text-destructive">
            <Trash2Icon className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        )}

        {hasBuiltIns && hasCustomActions && <DropdownMenuSeparator />}

        {actions.map((action) => {
          const Icon = action.icon
          return (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick(row.original)}
              disabled={action.disabled}
              className={action.destructive ? "text-destructive focus:text-destructive" : undefined}
            >
              {Icon && <Icon className="mr-2 size-4" />}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableRowActions }
export type { DataTableRowAction }
