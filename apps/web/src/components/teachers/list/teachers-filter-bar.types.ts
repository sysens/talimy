export type TeachersFilterOption = {
  label: string
  value: string
}

export type TeachersFilterState = {
  departments: string[]
  genders: string[]
  statuses: string[]
}

export type TeachersFilterBarProps = {
  addTeacherLabel?: string
  applyFiltersLabel?: string
  clearFiltersLabel?: string
  addButtonClassName?: string
  departmentOptions: readonly TeachersFilterOption[]
  filters: TeachersFilterState
  filterButtonLabel?: string
  filterTitle?: string
  genderLabel?: string
  genderOptions: readonly TeachersFilterOption[]
  onAddTeacher?: () => void
  onFiltersChange: (filters: TeachersFilterState) => void
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  searchContainerClassName?: string
  searchPlaceholder?: string
  searchValue: string
  showFilterButton?: boolean
  statusLabel?: string
  sortLabel?: string
  sortOptions: readonly TeachersFilterOption[]
  sortValue: string
  statusOptions: readonly TeachersFilterOption[]
  departmentLabel?: string
}
