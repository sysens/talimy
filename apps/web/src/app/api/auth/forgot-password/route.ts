import type { NextRequest } from "next/server"

import { proxyToBackendApi } from "@/lib/server/api-proxy"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  return proxyToBackendApi(request, {
    targetPath: "/api/auth/forgot-password",
    allowedHostScopes: ["platform", "school"],
    forbiddenMessage:
      "Magic link only from platform workspace or a school subdomain yuborilishi mumkin.",
  })
}
