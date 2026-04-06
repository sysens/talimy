"use client"

import { TeachersFilterBar } from "@/components/teachers/list/teachers-filter-bar"
import type {
  TeachersFilterOption,
  TeachersFilterState,
} from "@/components/teachers/list/teachers-filter-bar.types"
import type { StudentsStatusFilter } from "@/components/students/list/students-list.types"

type StudentsFilterBarProps = {
  addStudentLabel: string
  onAddStudent: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: StudentsStatusFilter) => void
  searchPlaceholder: string
  searchValue: string
  statusOptions: readonly TeachersFilterOption[]
  statusValue: StudentsStatusFilter
}

const EMPTY_FILTERS: TeachersFilterState = {
  departments: [],
  genders: [],
  statuses: [],
}

const EMPTY_OPTIONS: readonly TeachersFilterOption[] = []
const VALID_STATUS_FILTERS: readonly StudentsStatusFilter[] = [
  "all",
  "active",
  "onLeave",
  "suspended",
]

function isStudentsStatusFilter(value: string): value is StudentsStatusFilter {
  return VALID_STATUS_FILTERS.includes(value as StudentsStatusFilter)
}

export function StudentsFilterBar({
  addStudentLabel,
  onAddStudent,
  onSearchChange,
  onStatusChange,
  searchPlaceholder,
  searchValue,
  statusOptions,
  statusValue,
}: StudentsFilterBarProps) {
  return (
    <TeachersFilterBar
      addTeacherLabel={addStudentLabel}
      departmentOptions={EMPTY_OPTIONS}
      filters={EMPTY_FILTERS}
      genderOptions={EMPTY_OPTIONS}
      onAddTeacher={onAddStudent}
      onFiltersChange={() => {}}
      onSearchChange={onSearchChange}
      onSortChange={(value) => {
        if (isStudentsStatusFilter(value)) {
          onStatusChange(value)
        }
      }}
      searchContainerClassName="md:w-[300px]"
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
      showFilterButton={false}
      sortOptions={statusOptions}
      sortValue={statusValue}
      statusOptions={EMPTY_OPTIONS}
    />
  )
}
