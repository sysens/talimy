import type { NextRequest } from "next/server"

import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  return proxyTenantApiRequest(request, {
    forbiddenMessage: "Finance reimbursements are only available in school workspaces.",
    targetPath: `/api/finance/reimbursements/${id}/status`,
  })
}
