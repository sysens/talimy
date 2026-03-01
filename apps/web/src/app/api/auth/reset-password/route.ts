import type { NextRequest } from "next/server"

import { proxyToBackendApi } from "@/lib/server/api-proxy"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  return proxyToBackendApi(request, {
    targetPath: "/api/auth/reset-password",
    allowedHostScopes: ["platform", "school"],
    forbiddenMessage:
      "Reset password magic link faqat platform workspace yoki maktab subdomenida ishlaydi.",
  })
}
