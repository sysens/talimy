import type { NextRequest } from "next/server"

import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  return proxyTenantApiRequest(request, {
    includeGenderScope: true,
    targetPath: `/api/teachers/${id}/performance`,
  })
}
