import { AuthPanelHeader } from "@/components/auth/auth-panel-header"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { enforceAuthPageWorkspaceAccess } from "@/lib/server/auth-workspace"

export default async function Page() {
  const scope = await enforceAuthPageWorkspaceAccess({
    allowedScopes: ["platform", "public", "school"],
    fallbackPath: AUTH_ROUTE_PATHS.forgotPassword,
  })

  return (
    <div className="mx-auto w-full max-w-md">
      <AuthPanelHeader
        title="Parolni tiklash"
        description={
          scope.kind === "platform"
            ? "Platform admin reset magic linkni platform workspace orqali yuboradi."
            : "Maktab foydalanuvchilari reset magic linkni o'z maktab subdomenidan yuboradi."
        }
      />
      <ForgotPasswordForm />
    </div>
  )
}
