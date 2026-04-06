import type {
  StudentListItem,
  StudentsStatusFilter,
  StudentsTableSortDescriptor,
} from "@/components/students/list/students-list.types"

export type StudentsListRequest = {
  limit: number
  page: number
  search: string
  sortDescriptor: StudentsTableSortDescriptor
  status: StudentsStatusFilter
}

export type StudentsListResponse = {
  data: readonly StudentListItem[]
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
  }
}
