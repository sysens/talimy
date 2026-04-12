import type { NextRequest } from "next/server"

import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

export async function GET(request: NextRequest) {
  return proxyTenantApiRequest(request, {
    forbiddenMessage: "Finance expense breakdown is only available in school workspaces.",
    targetPath: "/api/finance/expenses/breakdown",
  })
}
