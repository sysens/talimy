import type { NextRequest } from "next/server"

import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

export async function GET(request: NextRequest) {
  return proxyTenantApiRequest(request, {
    forbiddenMessage: "Finance analytics are only available in school workspaces.",
    targetPath: "/api/admin/finance/earnings",
  })
}
