export type UserRole = "platform_admin" | "school_admin" | "teacher" | "student" | "parent"
export type UserGenderScope = "male" | "female" | "all"

export type UserView = {
  id: string
  tenantId: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  genderScope: UserGenderScope
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}
