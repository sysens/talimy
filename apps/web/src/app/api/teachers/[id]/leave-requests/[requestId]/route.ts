import type { NextRequest } from "next/server"

import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

type RouteContext = {
  params: Promise<{ id: string; requestId: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id, requestId } = await context.params

  return proxyTenantApiRequest(request, {
    includeGenderScope: true,
    targetPath: `/api/teachers/${id}/leave-requests/${requestId}`,
  })
}
