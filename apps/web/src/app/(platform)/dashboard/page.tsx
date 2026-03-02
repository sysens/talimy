import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/nextauth"
import { resolveHostScopeFromHeaders } from "@/lib/server/request-host"

export default async function Page() {
  const requestHeaders = await headers()
  const scope = resolveHostScopeFromHeaders(requestHeaders)

  if (scope.kind === "school") {
    const session = await auth()
    const roles = session?.user?.roles ?? []

    if (roles.includes("school_admin")) {
      redirect("/admin/dashboard")
    }

    if (roles.includes("teacher")) {
      redirect("/teacher/dashboard")
    }

    if (roles.includes("student")) {
      redirect("/student/dashboard")
    }

    if (roles.includes("parent")) {
      redirect("/parent/dashboard")
    }

    redirect("/login")
  }

  return null
}
