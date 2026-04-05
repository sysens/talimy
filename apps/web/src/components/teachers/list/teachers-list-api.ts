import { webApiFetch } from "@/lib/api"

import type {
  TeachersListRequest,
  TeachersListResponse,
} from "@/components/teachers/list/teachers-list-api.types"

type SuccessEnvelope<T> = {
  success: true
  data: T
}

function buildSearch(request: TeachersListRequest): string {
  const searchParams = new URLSearchParams()

  searchParams.set("page", String(request.page))
  searchParams.set("limit", String(request.limit))

  if (request.search.trim().length > 0) {
    searchParams.set("search", request.search.trim())
  }

  if (request.departments.length > 0) {
    searchParams.set("departmentId", request.departments.join(","))
  }

  if (request.genders.length > 0) {
    searchParams.set("gender", request.genders.join(","))
  }

  if (request.statuses.length > 0) {
    searchParams.set("status", request.statuses.join(","))
  }

  switch (request.sort) {
    case "oldest":
      searchParams.set("sort", "createdAt")
      searchParams.set("order", "asc")
      break
    case "nameAsc":
      searchParams.set("sort", "fullName")
      searchParams.set("order", "asc")
      break
    case "latest":
    default:
      searchParams.set("sort", "createdAt")
      searchParams.set("order", "desc")
      break
  }

  return `?${searchParams.toString()}`
}

export function getTeachersList(request: TeachersListRequest): Promise<TeachersListResponse> {
  return webApiFetch<SuccessEnvelope<TeachersListResponse>>(
    `/teachers${buildSearch(request)}`
  ).then((response) => response.data)
}
