import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/nextauth"
import { proxyToBackendApi } from "@/lib/server/api-proxy"

type TenantApiProxyOptions = {
  allowedHostScopes?: Array<"api" | "platform" | "public" | "school">
  extraSearchParams?: Record<string, string | undefined>
  forbiddenMessage?: string
  targetPath: string
}

export async function proxyTenantApiRequest(
  request: NextRequest,
  options: TenantApiProxyOptions
): Promise<NextResponse> {
  const session = await auth()
  const tenantId = typeof session?.user?.tenantId === "string" ? session.user.tenantId : null

  if (!tenantId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authenticated tenant context is required for this request.",
        },
      },
      { status: 401 }
    )
  }

  const searchParams = new URLSearchParams(request.nextUrl.search)
  searchParams.set("tenantId", tenantId)

  for (const [key, value] of Object.entries(options.extraSearchParams ?? {})) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }
  }

  return proxyToBackendApi(request, {
    targetPath: options.targetPath,
    appendSearch: `?${searchParams.toString()}`,
    allowedHostScopes: options.allowedHostScopes ?? ["school"],
    forbiddenMessage: options.forbiddenMessage,
  })
}
