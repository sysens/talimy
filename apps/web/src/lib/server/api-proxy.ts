import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getApiProxyOrigin } from "@/config/site"
import { resolveHostScopeFromHeaders } from "@/lib/server/request-host"

type ProxyToBackendOptions = {
  targetPath: string
  appendSearch?: string
  extraHeaders?: Headers
  overrideBody?: BodyInit
  allowedHostScopes?: Array<"api" | "platform" | "public" | "school">
  forbiddenMessage?: string
}

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
])

export async function proxyToBackendApi(
  request: NextRequest,
  options: ProxyToBackendOptions
): Promise<NextResponse> {
  try {
    const hostScope = resolveHostScopeFromHeaders(request.headers)
    if (options.allowedHostScopes && !options.allowedHostScopes.includes(hostScope.kind)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message:
              options.forbiddenMessage ??
              "This auth action is not available on the current workspace.",
          },
        },
        { status: 403 }
      )
    }

    const upstreamUrl = new URL(`${getApiProxyOrigin()}${options.targetPath}`)
    if (options.appendSearch) {
      upstreamUrl.search = options.appendSearch
    } else {
      upstreamUrl.search = request.nextUrl.search
    }

    const upstreamHeaders = cloneForwardHeaders(request.headers)
    applyTenantContextHeaders(request, upstreamHeaders)

    if (options.extraHeaders) {
      for (const [key, value] of options.extraHeaders.entries()) {
        upstreamHeaders.set(key, value)
      }
    }

    const init: RequestInit = {
      method: request.method,
      headers: upstreamHeaders,
      redirect: "manual",
      cache: "no-store",
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      if (typeof options.overrideBody !== "undefined") {
        init.body = options.overrideBody
      } else {
        const body = await request.arrayBuffer()
        if (body.byteLength > 0) {
          init.body = body
        }
      }
    }

    const upstreamResponse = await fetch(upstreamUrl, init)
    const responseHeaders = new Headers(upstreamResponse.headers)
    for (const header of HOP_BY_HOP_HEADERS) {
      responseHeaders.delete(header)
    }

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BAD_GATEWAY",
          message: "Backend API proxy request failed",
          details: error instanceof Error ? error.message : "unknown error",
        },
      },
      { status: 502 }
    )
  }
}

function cloneForwardHeaders(source: Headers): Headers {
  const headers = new Headers()
  for (const [key, value] of source.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  }
  return headers
}

function applyTenantContextHeaders(request: NextRequest, headers: Headers): void {
  if (!headers.has("x-tenant-slug")) {
    const tenantSlug = resolveTenantSlug(request)
    if (tenantSlug) {
      headers.set("x-tenant-slug", tenantSlug)
    }
  }

  if (!headers.has("x-forwarded-host")) {
    const host = request.headers.get("host")
    if (host) {
      headers.set("x-forwarded-host", host)
    }
  }

  if (!headers.has("x-forwarded-proto")) {
    const protocol = request.nextUrl.protocol.replace(":", "")
    if (protocol) {
      headers.set("x-forwarded-proto", protocol)
    }
  }
}

function resolveTenantSlug(request: NextRequest): string | null {
  const hostScope = resolveHostScopeFromHeaders(request.headers)
  return hostScope.kind === "school" ? hostScope.tenantSlug : null
}
