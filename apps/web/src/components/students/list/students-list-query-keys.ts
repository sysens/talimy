import type { StudentsListRequest } from "@/components/students/list/students-list-api.types"

export const studentsListQueryKeys = {
  list: (request: StudentsListRequest) => ["students-list", request] as const,
}
