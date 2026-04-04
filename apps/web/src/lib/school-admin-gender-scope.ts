import type { GenderPolicy, GenderScope } from "@talimy/shared"

import { webApiFetch } from "@/lib/api"

export type SchoolAdminGenderScopeSettings = {
  userId: string
  fullName: string
  email: string
  tenantId: string
  tenantName: string
  tenantGenderPolicy: GenderPolicy
  genderScope: GenderScope
  availableGenderScopes: GenderScope[]
}

export type SchoolAdminGenderScopeUpdateResult = {
  settings: SchoolAdminGenderScopeSettings
  session: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

type SuccessEnvelope<T> = {
  success: true
  data: T
}

export async function getSchoolAdminGenderScopeSettings(): Promise<SchoolAdminGenderScopeSettings> {
  const response = await webApiFetch<SuccessEnvelope<SchoolAdminGenderScopeSettings>>(
    "/users/me/gender-scope",
    {
      method: "GET",
    }
  )

  return response.data
}

export async function updateSchoolAdminGenderScope(
  genderScope: GenderScope
): Promise<SchoolAdminGenderScopeUpdateResult> {
  const response = await webApiFetch<SuccessEnvelope<SchoolAdminGenderScopeUpdateResult>>(
    "/users/me/gender-scope",
    {
      method: "PATCH",
      body: {
        genderScope,
      },
    }
  )

  return response.data
}
