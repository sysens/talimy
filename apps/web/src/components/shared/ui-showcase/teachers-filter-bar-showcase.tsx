"use client"

import * as React from "react"

import { TeachersFilterBar } from "@/components/teachers/list/teachers-filter-bar"
import type {
  TeachersFilterOption,
  TeachersFilterState,
} from "@/components/teachers/list/teachers-filter-bar.types"

const DEPARTMENT_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "Mathematics", value: "mathematics" },
  { label: "Science", value: "science" },
  { label: "Language", value: "language" },
] as const

const STATUS_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "Active", value: "active" },
  { label: "On Leave", value: "on_leave" },
  { label: "Substitute", value: "substitute" },
] as const

const GENDER_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
] as const

const SORT_OPTIONS: readonly TeachersFilterOption[] = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name A-Z", value: "nameAsc" },
] as const

const DEFAULT_FILTERS: TeachersFilterState = {
  departments: [],
  genders: [],
  statuses: [],
}

export function TeachersFilterBarShowcase() {
  const [searchValue, setSearchValue] = React.useState("")
  const [sortValue, setSortValue] = React.useState("latest")
  const [filters, setFilters] = React.useState<TeachersFilterState>(DEFAULT_FILTERS)

  return (
    <TeachersFilterBar
      departmentOptions={DEPARTMENT_OPTIONS}
      filters={filters}
      genderOptions={GENDER_OPTIONS}
      onAddTeacher={() => undefined}
      onFiltersChange={setFilters}
      onSearchChange={setSearchValue}
      onSortChange={setSortValue}
      searchValue={searchValue}
      sortOptions={SORT_OPTIONS}
      sortValue={sortValue}
      statusOptions={STATUS_OPTIONS}
    />
  )
}
