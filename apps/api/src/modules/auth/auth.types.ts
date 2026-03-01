export type AuthSession = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthRequestContext = {
  clientIp?: string | null
  tenantId?: string | null
  tenantSlug?: string | null
  forwardedHost?: string | null
  forwardedProto?: string | null
}

export type TokenPayload = {
  sub: string
  email: string
  tenantId: string
  tenantSlug?: string | null
  roles: string[]
  genderScope: "male" | "female" | "all"
  type: "access" | "refresh"
  jti: string
  iat: number
  exp: number
}

export type StoredUser = {
  id: string
  fullName: string
  email: string
  tenantId: string
  tenantSlug?: string | null
  passwordHash: string
  roles: string[]
  genderScope: "male" | "female" | "all"
}

export type StoredRole =
  | "platform_admin"
  | "school_admin"
  | "teacher"
  | "student"
  | "parent"

export type AuthIdentity = Omit<TokenPayload, "iat" | "exp" | "jti" | "type">

export type MagicLinkRecord = {
  email: string
  host: string
  issuedAtEpochSeconds: number
  purpose: "invite" | "password_reset"
  tenantId: string
  tenantSlug: string | null
  userId: string
}

export type ResolvedHostScope =
  | { host: string; kind: "platform"; origin: string }
  | { host: string; kind: "public"; origin: string }
  | { host: string; kind: "school"; origin: string; tenantId: string; tenantSlug: string }
