import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createEventSchema } from "@talimy/shared"

import { proxyToBackendApi } from "@/lib/server/api-proxy"
import { getOptionalSession } from "@/lib/server/get-optional-session"
import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

export async function GET(request: NextRequest) {
  return proxyTenantApiRequest(request, {
    forbiddenMessage: "Events are only available in school workspaces.",
    targetPath: "/api/events",
  })
}

export async function POST(request: NextRequest) {
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

  const payload = createEventSchema.parse({
    ...(await request.json()),
    tenantId,
  })
  const headers = new Headers()
  headers.set("content-type", "application/json")

  return proxyToBackendApi(request, {
    allowedHostScopes: ["school"],
    extraHeaders: headers,
    forbiddenMessage: "Events are only available in school workspaces.",
    overrideBody: JSON.stringify(payload),
    targetPath: "/api/events",
  })
}
