import { Injectable } from "@nestjs/common"

import type { AuthRequestContext, ResolvedHostScope } from "./auth.types"

@Injectable()
export class AuthWorkspaceService {
  resolveHostScope(context: AuthRequestContext): ResolvedHostScope {
    const forwardedHost = this.normalizeForwardedHost(context.forwardedHost)
    const protocol = this.normalizeProtocol(context.forwardedProto)

    if (!forwardedHost) {
      return {
        host: "talimy.space",
        kind: "public",
        origin: `${protocol}://talimy.space`,
      }
    }

    if (context.tenantSlug && context.tenantId) {
      return {
        host: forwardedHost,
        kind: "school",
        origin: `${protocol}://${forwardedHost}`,
        tenantId: context.tenantId,
        tenantSlug: context.tenantSlug,
      }
    }

    const hostname = forwardedHost.split(":")[0] ?? ""
    if (hostname === "platform.talimy.space" || hostname === "platform.localhost") {
      return {
        host: forwardedHost,
        kind: "platform",
        origin: `${protocol}://${forwardedHost}`,
      }
    }

    return {
      host: forwardedHost,
      kind: "public",
      origin: `${protocol}://${forwardedHost}`,
    }
  }

  buildPlatformOrigin(context: AuthRequestContext): string {
    const host = this.normalizeForwardedHost(context.forwardedHost)
    const protocol = this.normalizeProtocol(context.forwardedProto)
    const portSuffix = this.extractPortSuffix(host)
    const hostname = host?.split(":")[0] ?? ""

    if (hostname === "platform.localhost" || hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}://platform.localhost${portSuffix || ":3000"}`
    }

    return `${protocol}://platform.talimy.space${portSuffix}`
  }

  buildTenantOrigin(tenantSlug: string, context: AuthRequestContext): string {
    const host = this.normalizeForwardedHost(context.forwardedHost)
    const protocol = this.normalizeProtocol(context.forwardedProto)
    const portSuffix = this.extractPortSuffix(host)
    const hostname = host?.split(":")[0] ?? ""

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "platform.localhost" ||
      hostname.endsWith(".localhost")
    ) {
      return `${protocol}://${tenantSlug}.localhost${portSuffix || ":3000"}`
    }

    return `${protocol}://${tenantSlug}.talimy.space${portSuffix}`
  }

  normalizeForwardedHost(value: string | null | undefined): string | null {
    if (!value) {
      return null
    }

    const firstHost = value.split(",")[0]?.trim().toLowerCase()
    return firstHost ? firstHost : null
  }

  normalizeProtocol(value: string | null | undefined): string {
    if (value === "http" || value === "https") {
      return value
    }

    return process.env.NODE_ENV === "development" ? "http" : "https"
  }

  extractPortSuffix(host: string | null): string {
    if (!host) {
      return ""
    }

    const match = host.match(/:(\d+)$/)
    return match?.[0] ?? ""
  }
}
