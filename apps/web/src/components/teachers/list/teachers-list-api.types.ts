export type TeachersListDepartmentKey =
  | "science"
  | "mathematics"
  | "language"
  | "social"
  | "arts"
  | "physicalEducation"
  | "other"

export type TeachersListGender = "male" | "female"
export type TeachersListStatus = "active" | "inactive" | "on_leave"
export type TeachersListSortValue = "latest" | "oldest" | "nameAsc"

export type TeachersListItem = {
  avatar: string | null
  departmentKey: TeachersListDepartmentKey
  email: string
  employeeId: string
  fullName: string
  id: string
  phone: string | null
  subject: string
}

export type TeachersListMeta = {
  limit: number
  page: number
  total: number
  totalPages: number
}

export type TeachersListResponse = {
  data: readonly TeachersListItem[]
  meta: TeachersListMeta
}

export type TeachersListRequest = {
  departments: readonly TeachersListDepartmentKey[]
  genders: readonly TeachersListGender[]
  limit: number
  page: number
  search: string
  sort: TeachersListSortValue
  statuses: readonly TeachersListStatus[]
}
