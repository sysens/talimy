import type { TeachersListRequest } from "@/components/teachers/list/teachers-list-api.types"

export const teacherListQueryKeys = {
  list: (locale: string, request: TeachersListRequest) =>
    [
      "teacher-list",
      locale,
      request.page,
      request.limit,
      request.search,
      request.sort,
      request.departments.join(","),
      request.statuses.join(","),
      request.genders.join(","),
    ] as const,
} as const
