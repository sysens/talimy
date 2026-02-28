"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"
import {
  Badge,
  Button,
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
} from "@talimy/ui"
import { sileo } from "sileo"

type StudentRow = {
  id: string
  fullName: string
  classroom: string
  attendance: number
  status: "active" | "warning" | "inactive"
}

const STUDENT_ROWS: StudentRow[] = [
  { id: "ST-1001", fullName: "Ali Karimov", classroom: "9-A", attendance: 97, status: "active" },
  { id: "ST-1002", fullName: "Madina Usmonova", classroom: "9-A", attendance: 92, status: "warning" },
  { id: "ST-1003", fullName: "Jasur Abdugʻaniyev", classroom: "8-B", attendance: 99, status: "active" },
  { id: "ST-1004", fullName: "Ozoda Tursunova", classroom: "8-B", attendance: 83, status: "warning" },
  { id: "ST-1005", fullName: "Sardor Nurmatov", classroom: "7-C", attendance: 76, status: "inactive" },
]

const STUDENT_COLUMNS: ColumnDef<StudentRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
  },
  {
    accessorKey: "classroom",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
  },
  {
    accessorKey: "attendance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Attendance %" />,
    cell: ({ row }) => <span>{row.original.attendance}%</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      const variant = status === "active" ? "default" : status === "warning" ? "secondary" : "outline"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onView={(item) =>
          sileo.info({
            title: "View student",
            description: `${item.fullName} profile opened`,
          })
        }
        onEdit={(item) =>
          sileo.success({
            title: "Edit student",
            description: `${item.fullName} edit action triggered`,
          })
        }
        onDelete={(item) =>
          sileo.warning({
            title: "Delete request",
            description: `${item.fullName} delete confirmation pending`,
          })
        }
      />
    ),
  },
]

function DataTableShowcase42() {
  return (
    <DataTable
      columns={STUDENT_COLUMNS}
      data={STUDENT_ROWS}
      searchColumnId="fullName"
      searchPlaceholder="Student qidiring..."
      facetedFilters={[
        {
          columnId: "classroom",
          title: "Class",
          options: [
            { label: "9-A", value: "9-A" },
            { label: "8-B", value: "8-B" },
            { label: "7-C", value: "7-C" },
          ],
        },
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Warning", value: "warning" },
            { label: "Inactive", value: "inactive" },
          ],
        },
      ]}
      toolbarActions={
        <Button
          size="sm"
          onClick={() =>
            sileo.success({
              title: "Action",
              description: "New student flow opened",
            })
          }
        >
          <PlusIcon className="mr-2 size-4" />
          New student
        </Button>
      }
    />
  )
}

export { DataTableShowcase42 }
