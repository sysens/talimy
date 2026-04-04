import type { AuthSession } from "@/modules/auth/auth.types"

export type UserRole = "platform_admin" | "school_admin" | "teacher" | "student" | "parent"
export type UserGenderScope = "male" | "female" | "all"
export type TenantGenderPolicy = "boys_only" | "girls_only" | "mixed"

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

export type SchoolAdminGenderScopeSettingsView = {
  userId: string
  fullName: string
  email: string
  tenantId: string
  tenantName: string
  tenantGenderPolicy: TenantGenderPolicy
  genderScope: UserGenderScope
  availableGenderScopes: UserGenderScope[]
}

export type SchoolAdminGenderScopeUpdateView = {
  settings: SchoolAdminGenderScopeSettingsView
  session: AuthSession
}
