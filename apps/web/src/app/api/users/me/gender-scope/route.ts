import type { NextRequest } from "next/server"

import { proxyToBackendApi } from "@/lib/server/api-proxy"

const BACKEND_PATH = "/api/users/me/gender-scope"

export async function GET(request: NextRequest) {
  return proxyToBackendApi(request, {
    targetPath: BACKEND_PATH,
    allowedHostScopes: ["school"],
    forbiddenMessage: "Gender scope settings are only available in school workspaces.",
  })
}

export async function PATCH(request: NextRequest) {
  return proxyToBackendApi(request, {
    targetPath: BACKEND_PATH,
    allowedHostScopes: ["school"],
    forbiddenMessage: "Gender scope settings are only available in school workspaces.",
  })
}
