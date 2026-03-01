import type { NextRequest } from "next/server"

import { proxyToBackendApi } from "@/lib/server/api-proxy"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  return proxyToBackendApi(request, {
    targetPath: "/api/auth/invite/accept",
    allowedHostScopes: ["school"],
    forbiddenMessage:
      "Taklif magic link faqat maktabning o'z subdomenida faollashtiriladi.",
  })
}
