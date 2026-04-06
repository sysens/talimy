import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { proxyToBackendApi } from "@/lib/server/api-proxy"
import { getOptionalSession } from "@/lib/server/get-optional-session"

type TenantApiProxyOptions = {
  allowedHostScopes?: Array<"api" | "platform" | "public" | "school">
  extraSearchParams?: Record<string, string | undefined>
  forbiddenMessage?: string
  includeGenderScope?: boolean
  targetPath: string
}

export async function proxyTenantApiRequest(
  request: NextRequest,
  options: TenantApiProxyOptions
): Promise<NextResponse> {
  const session = await getOptionalSession()
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

  if (options.includeGenderScope === true) {
    const genderScope =
      typeof session?.user?.genderScope === "string" ? session.user.genderScope : undefined

    if (typeof genderScope === "string" && genderScope.length > 0) {
      searchParams.set("genderScope", genderScope)
    }
  }

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
