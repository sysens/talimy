import { AuthPanelHeader } from "@/components/auth/auth-panel-header"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { enforceAuthPageWorkspaceAccess } from "@/lib/server/auth-workspace"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  await enforceAuthPageWorkspaceAccess({
    allowedScopes: ["platform", "public", "school"],
    fallbackPath: AUTH_ROUTE_PATHS.login,
  })

  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : null

  return (
    <div className="mx-auto w-full max-w-md">
      <AuthPanelHeader
        title="Yangi parol"
        description="Magic link orqali kelgan havola asosida yangi parolni o'rnating."
      />
      <ResetPasswordForm token={token} mode="password_reset" />
    </div>
  )
}
