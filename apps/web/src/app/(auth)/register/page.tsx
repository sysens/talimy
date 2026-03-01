import { redirect } from "next/navigation"

import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"

export default function Page() {
  redirect(AUTH_ROUTE_PATHS.login)
}
