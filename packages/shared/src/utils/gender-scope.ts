import { GENDER_POLICIES, GENDER_SCOPES, type GenderPolicy, type GenderScope } from "../constants"

const ALLOWED_GENDER_SCOPES_BY_POLICY: Record<GenderPolicy, readonly GenderScope[]> = {
  [GENDER_POLICIES.BOYS_ONLY]: [GENDER_SCOPES.MALE],
  [GENDER_POLICIES.GIRLS_ONLY]: [GENDER_SCOPES.FEMALE],
  [GENDER_POLICIES.MIXED]: [GENDER_SCOPES.ALL, GENDER_SCOPES.MALE, GENDER_SCOPES.FEMALE],
}

export function resolveAllowedGenderScopes(policy: GenderPolicy): readonly GenderScope[] {
  return ALLOWED_GENDER_SCOPES_BY_POLICY[policy]
}

export function isGenderScopeAllowedForPolicy(
  policy: GenderPolicy,
  genderScope: GenderScope
): boolean {
  return resolveAllowedGenderScopes(policy).includes(genderScope)
}

export function coerceGenderScopeForPolicy(
  policy: GenderPolicy,
  genderScope: GenderScope
): GenderScope {
  if (isGenderScopeAllowedForPolicy(policy, genderScope)) {
    return genderScope
  }

  const [fallbackScope] = resolveAllowedGenderScopes(policy)
  if (!fallbackScope) {
    throw new Error(`No gender scope configured for policy: ${policy}`)
  }

  return fallbackScope
}
