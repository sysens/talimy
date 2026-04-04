"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@talimy/shared"
import { Button, Checkbox, Input, Label, Separator } from "@talimy/ui"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Session } from "next-auth"
import { getSession, signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { sileo } from "sileo"

import { AuthBrand } from "@/components/auth/auth-brand"
import {
  getAuthWorkspaceContent,
  type AuthWorkspaceKind,
} from "@/components/auth/auth-workspace-content"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"

type LoginFormProps = {
  workspaceKind: AuthWorkspaceKind
}

export function LoginForm({ workspaceKind }: LoginFormProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const t = useTranslations("authPage")
  const searchParams = useSearchParams()
  const nextPath = resolveSafeCallbackPath(searchParams.get("next"))
  const content = getAuthWorkspaceContent(t, workspaceKind)
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const isSubmitDisabled = !isHydrated || form.formState.isSubmitting

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await signIn("credentials", {
      ...values,
      callbackUrl: nextPath ?? resolveCurrentAuthCallbackUrl(),
      redirect: false,
    })

    if (!result || result.error) {
      sileo.error({
        title: t("invalidCredentials"),
        description: t("invalidCredentialsDescription"),
        position: "top-center",
        fill: "#171717",
        roundness: 18,
        styles: {
          title: "text-white!",
          description: "text-white/75! leading-7",
          badge: "bg-white/10!",
        },
      })
      return
    }

    const session = await getSession()
    const destination = resolvePostLoginDestination(session, window.location.origin)
    window.location.assign(destination ?? result.url ?? AUTH_ROUTE_PATHS.login)
  })

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <AuthBrand />
        <div className="space-y-3">
          <p className="inline-flex rounded-full bg-talimy-pink/24 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.22em] text-talimy-navy uppercase">
            {content.workspaceBadge}
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-talimy-navy sm:text-[2.15rem]">
              {content.loginTitle}
            </h1>
            <p className="max-w-md text-sm leading-7 text-slate-600">{content.loginDescription}</p>
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <fieldset disabled={!isHydrated} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email">{t("emailLabel")}</Label>
            <Input
              id="login-email"
              autoComplete="email"
              placeholder={
                workspaceKind === "platform"
                  ? t("emailPlaceholderPlatform")
                  : t("emailPlaceholderSchool")
              }
              className="h-11 border-slate-200 bg-white shadow-none focus-visible:ring-talimy-navy/18"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">{t("passwordLabel")}</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={t("passwordPlaceholder")}
                className="h-11 border-slate-200 bg-white pr-12 shadow-none focus-visible:ring-talimy-navy/18"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-1 my-auto text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {form.formState.errors.password ? (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                className="border-slate-300 data-checked:bg-talimy-navy data-checked:border-talimy-navy"
              />
              <Label htmlFor="remember-me" className="text-sm font-medium text-slate-600">
                {t("rememberMe")}
              </Label>
            </div>
            <Link
              href={AUTH_ROUTE_PATHS.forgotPassword}
              className="text-sm font-medium text-talimy-navy hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-talimy-navy text-white shadow-none hover:bg-talimy-navy/92"
            disabled={isSubmitDisabled}
          >
            {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {t("signInButton")}
          </Button>
        </fieldset>
      </form>

      <p className="text-center text-sm leading-7 text-slate-500">{content.loginFooter}</p>
    </div>
  )
}

function resolvePostLoginDestination(
  session: Session | null,
  currentOrigin: string
): string | null {
  const roles = session?.user?.roles ?? []
  if (roles.includes("platform_admin")) {
    return `${currentOrigin}/dashboard`
  }

  if (roles.includes("school_admin")) {
    return `${currentOrigin}/admin/dashboard`
  }

  if (roles.includes("teacher")) {
    return `${currentOrigin}/teacher/dashboard`
  }

  if (roles.includes("student")) {
    return `${currentOrigin}/student/dashboard`
  }

  if (roles.includes("parent")) {
    return `${currentOrigin}/parent/dashboard`
  }

  return null
}

function resolveCurrentAuthCallbackUrl(): string | undefined {
  if (typeof window === "undefined") {
    return undefined
  }

  return new URL(AUTH_ROUTE_PATHS.login, window.location.origin).toString()
}

function resolveSafeCallbackPath(value: string | null): string | undefined {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return undefined
  }

  return trimmed
}
