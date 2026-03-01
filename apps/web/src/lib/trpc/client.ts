import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@talimy/trpc"
import { trpcTransformer } from "@talimy/trpc/src/transformer"

import { APP_LOCALE_COOKIE, RESERVED_SUBDOMAINS, getWebOrigin } from "@/config/site"
import { getStoredAuthTokens } from "@/lib/auth"

const RESERVED_SUBDOMAIN_SET = new Set<string>(RESERVED_SUBDOMAINS)

export function getTrpcHttpUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/trpc`
  }
  return `${getWebOrigin()}/api/trpc`
}

export function createBrowserTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getTrpcHttpUrl(),
        transformer: trpcTransformer,
        headers() {
          const tokens = getStoredAuthTokens()
          const tenantSlug = resolveTenantSlugFromLocation()
          const locale = readCookie(APP_LOCALE_COOKIE)
          const headers: Record<string, string> = {}

          if (!tokens?.accessToken) {
            if (tenantSlug) {
              headers["x-tenant-slug"] = tenantSlug
            }
            if (locale) {
              headers["x-locale"] = locale
            }
            return headers
          }

          headers.authorization = `Bearer ${tokens.accessToken}`
          if (tenantSlug) {
            headers["x-tenant-slug"] = tenantSlug
          }
          if (locale) {
            headers["x-locale"] = locale
          }
          return headers
        },
      }),
    ],
  })
}

function resolveTenantSlugFromLocation(): string | undefined {
  if (typeof window === "undefined") {
    return undefined
  }

  const hostname = window.location.hostname.trim().toLowerCase()
  if (!hostname) {
    return undefined
  }

  if (hostname.endsWith(".localhost")) {
    const slug = hostname.slice(0, -".localhost".length)
    return slug && !RESERVED_SUBDOMAIN_SET.has(slug) ? slug : undefined
  }

  if (hostname.endsWith(".talimy.space")) {
    const slug = hostname.slice(0, -".talimy.space".length)
    return slug && !RESERVED_SUBDOMAIN_SET.has(slug) ? slug : undefined
  }

  return undefined
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }

  const prefix = `${name}=`
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  if (!value) {
    return undefined
  }

  const raw = value.slice(prefix.length)
  return raw.length > 0 ? decodeURIComponent(raw) : undefined
}
