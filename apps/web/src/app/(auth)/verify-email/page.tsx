import { AuthPanelHeader } from "@/components/auth/auth-panel-header"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { enforceAuthPageWorkspaceAccess } from "@/lib/server/auth-workspace"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  await enforceAuthPageWorkspaceAccess({
    allowedScopes: ["school"],
    fallbackPath: AUTH_ROUTE_PATHS.login,
  })

  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : null

  return (
    <div className="mx-auto w-full max-w-md">
      <AuthPanelHeader
        title="Accountni faollashtirish"
        description="School workspace magic linki orqali admin yoki foydalanuvchi uchun parol o'rnating."
      />
      <ResetPasswordForm token={token} mode="invite" />
    </div>
  )
}
