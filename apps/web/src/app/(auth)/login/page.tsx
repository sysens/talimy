import { LoginForm } from "@/components/auth/login-form"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { enforceAuthPageWorkspaceAccess } from "@/lib/server/auth-workspace"

export default async function Page() {
  const scope = await enforceAuthPageWorkspaceAccess({
    allowedScopes: ["platform", "public", "school"],
    fallbackPath: AUTH_ROUTE_PATHS.login,
  })
  const workspaceKind = scope.kind === "platform" ? "platform" : "school"

  return <LoginForm workspaceKind={workspaceKind} />
}
