import { useAuthStore } from "@/stores/auth-store"

export type AuthTokens = {
  accessToken: string
  refreshToken?: string | null
}

export function getStoredAuthTokens(): AuthTokens | null {
  const { accessToken, refreshToken } = useAuthStore.getState()
  if (!accessToken) {
    return null
  }

  return { accessToken, refreshToken }
}

export function setStoredAuthTokens(tokens: AuthTokens): void {
  useAuthStore.setState({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  })
}

export function clearStoredAuthTokens(): void {
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
  })
}
