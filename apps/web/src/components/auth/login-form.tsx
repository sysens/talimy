"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@talimy/shared"
import { Alert, AlertDescription, Button, Checkbox, Input, Label, Separator } from "@talimy/ui"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { AuthBrand } from "@/components/auth/auth-brand"
import {
  getAuthWorkspaceContent,
  type AuthWorkspaceKind,
} from "@/components/auth/auth-workspace-copy"
import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"

type LoginFormProps = {
  workspaceKind: AuthWorkspaceKind
}

export function LoginForm({ workspaceKind }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const nextPath = resolveSafeCallbackPath(searchParams.get("next"))
  const content = getAuthWorkspaceContent(workspaceKind)
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    const result = await signIn("credentials", {
      ...values,
      callbackUrl: nextPath,
      redirect: false,
    })

    if (!result || result.error) {
      setSubmitError("Email yoki parol noto'g'ri.")
      return
    }

    window.location.assign(result.url ?? AUTH_ROUTE_PATHS.login)
  })

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <AuthBrand />
        <div className="space-y-3">
          <p className="inline-flex rounded-full bg-[color:var(--talimy-color-pink)]/32 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-[color:var(--talimy-color-navy)] uppercase">
            {content.workspaceBadge}
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--talimy-color-navy)] sm:text-[2.3rem]">
              Welcome back
            </h1>
            <p className="text-sm leading-7 text-slate-600">{content.loginDescription}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {content.audiences.map((audience) => (
            <div
              key={audience.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <p className="text-sm font-semibold text-[color:var(--talimy-color-navy)]">
                {audience.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-slate-200" />
        <span className="text-sm font-medium text-slate-500">Continue with email</span>
        <Separator className="flex-1 bg-slate-200" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email address</Label>
          <Input
            id="login-email"
            autoComplete="email"
            placeholder={workspaceKind === "platform" ? "platform.admin@talimy.space" : "admin@mezana.talimy.space"}
            className="h-11 border-slate-200 bg-white shadow-none focus-visible:ring-[color:var(--talimy-color-navy)]/18"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-11 border-slate-200 bg-white pr-12 shadow-none focus-visible:ring-[color:var(--talimy-color-navy)]/18"
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
              className="border-slate-300 data-checked:bg-[color:var(--talimy-color-navy)] data-checked:border-[color:var(--talimy-color-navy)]"
            />
            <Label htmlFor="remember-me" className="text-sm font-medium text-slate-600">
              Remember me
            </Label>
          </div>
          <Link
            href={AUTH_ROUTE_PATHS.forgotPassword}
            className="text-sm font-medium text-[color:var(--talimy-color-navy)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {submitError ? (
          <Alert className="border-red-200 bg-red-50 text-red-700">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="submit"
          className="h-11 w-full bg-[color:var(--talimy-color-pink)] text-[color:var(--talimy-color-navy)] shadow-none hover:bg-[color:var(--talimy-color-pink)]/92"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          Sign in to Talimy
        </Button>
      </form>

      <p className="text-center text-sm leading-6 text-slate-500">{content.loginFooter}</p>
    </div>
  )
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
