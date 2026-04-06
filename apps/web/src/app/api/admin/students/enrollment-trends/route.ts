import type { NextRequest } from "next/server"

import { proxyTenantApiRequest } from "@/lib/server/tenant-api-proxy"

export async function GET(request: NextRequest) {
  return proxyTenantApiRequest(request, {
    forbiddenMessage: "Student enrollment trends are only available in school workspaces.",
    includeGenderScope: true,
    targetPath: "/api/admin/students/enrollment-trends",
  })
}
