import type { ReadonlyURLSearchParams } from "next/navigation"

import type {
  TeachersListDepartmentKey,
  TeachersListGender,
  TeachersListRequest,
  TeachersListSortValue,
  TeachersListStatus,
} from "@/components/teachers/list/teachers-list-api.types"
import type { TeachersFilterState } from "@/components/teachers/list/teachers-filter-bar.types"

const TEACHERS_PAGE_SIZE_OPTIONS = [8, 12, 16] as const
const TEACHERS_LIST_DEFAULT_LIMIT = 8
const DEFAULT_SORT: TeachersListSortValue = "latest"

function parseCsv(value: string | null): string[] {
  if (typeof value !== "string" || value.trim().length === 0) {
    return []
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function isDepartmentKey(value: string): value is TeachersListDepartmentKey {
  return [
    "science",
    "mathematics",
    "language",
    "social",
    "arts",
    "physicalEducation",
    "other",
  ].includes(value)
}

function isGender(value: string): value is TeachersListGender {
  return value === "male" || value === "female"
}

function isStatus(value: string): value is TeachersListStatus {
  return value === "active" || value === "inactive" || value === "on_leave"
}

function isSortValue(value: string): value is TeachersListSortValue {
  return value === "latest" || value === "oldest" || value === "nameAsc"
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (typeof value !== "string") {
    return fallback
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function getTeachersPageSizeOptions(): readonly number[] {
  return TEACHERS_PAGE_SIZE_OPTIONS
}

export function parseTeachersListRequest(
  searchParams: URLSearchParams | ReadonlyURLSearchParams
): TeachersListRequest {
  const limit = parsePositiveInt(searchParams.get("limit"), TEACHERS_LIST_DEFAULT_LIMIT)
  const page = parsePositiveInt(searchParams.get("page"), 1)
  const sortParam = searchParams.get("sort")

  return {
    departments: parseCsv(searchParams.get("departmentId")).filter(isDepartmentKey),
    genders: parseCsv(searchParams.get("gender")).filter(isGender),
    limit: TEACHERS_PAGE_SIZE_OPTIONS.some((size) => size === limit)
      ? limit
      : TEACHERS_LIST_DEFAULT_LIMIT,
    page,
    search: searchParams.get("search")?.trim() ?? "",
    sort: typeof sortParam === "string" && isSortValue(sortParam) ? sortParam : DEFAULT_SORT,
    statuses: parseCsv(searchParams.get("status")).filter(isStatus),
  }
}

export function serializeTeachersFilterState(
  filters: TeachersFilterState
): Record<string, string | null> {
  return {
    departmentId: filters.departments.length > 0 ? filters.departments.join(",") : null,
    gender: filters.genders.length > 0 ? filters.genders.join(",") : null,
    status: filters.statuses.length > 0 ? filters.statuses.join(",") : null,
  }
}

export function toTeachersFilterState(request: TeachersListRequest): TeachersFilterState {
  return {
    departments: [...request.departments],
    genders: [...request.genders],
    statuses: [...request.statuses],
  }
}

export function updateTeachersListSearchParams(
  currentSearchParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Record<string, string | null>
): string {
  const nextSearchParams = new URLSearchParams(currentSearchParams.toString())

  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "string" && value.length > 0) {
      nextSearchParams.set(key, value)
    } else {
      nextSearchParams.delete(key)
    }
  }

  const serialized = nextSearchParams.toString()
  return serialized.length > 0 ? `?${serialized}` : ""
}
