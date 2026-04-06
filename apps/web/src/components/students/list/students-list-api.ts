import { webApiFetch } from "@/lib/api"

import type {
  StudentsListRequest,
  StudentsListResponse,
} from "@/components/students/list/students-list-api.types"

type SuccessEnvelope<T> = {
  success: true
  data: T
}

function buildSearch(request: StudentsListRequest): string {
  const searchParams = new URLSearchParams()

  searchParams.set("page", String(request.page))
  searchParams.set("limit", String(request.limit))

  if (request.search.trim().length > 0) {
    searchParams.set("search", request.search.trim())
  }

  if (request.status === "active") {
    searchParams.set("status", "active")
  } else if (request.status === "onLeave") {
    searchParams.set("status", "on_leave")
  } else if (request.status === "suspended") {
    searchParams.set("status", "suspended")
  }

  const sort =
    request.sortDescriptor.column === "student"
      ? "fullName"
      : request.sortDescriptor.column === "class"
        ? "classLabel"
        : request.sortDescriptor.column === "gpa"
          ? "gpa"
          : request.sortDescriptor.column === "performance"
            ? "performance"
            : request.sortDescriptor.column === "attendance"
              ? "attendance"
              : "status"

  searchParams.set("sort", sort)
  searchParams.set("order", request.sortDescriptor.direction === "ascending" ? "asc" : "desc")

  return `?${searchParams.toString()}`
}

export function getStudentsList(request: StudentsListRequest): Promise<StudentsListResponse> {
  return webApiFetch<SuccessEnvelope<StudentsListResponse>>(
    `/students${buildSearch(request)}`
  ).then((response) => response.data)
}
