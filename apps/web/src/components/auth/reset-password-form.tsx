"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription, Button, Input, Label } from "@talimy/ui"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"

import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import {
  acceptInviteWithMagicLink,
  resetPasswordWithMagicLink,
} from "@/lib/auth-client"

const passwordSetupSchema = z
  .object({
    password: z.string().min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak."),
    confirmPassword: z.string().min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Parollar mos emas.",
  })

type PasswordSetupInput = {
  confirmPassword: string
  password: string
}

const passwordSetupResolver: Resolver<PasswordSetupInput> = async (values) => {
  const result = passwordSetupSchema.safeParse(values)
  if (result.success) {
    return {
      errors: {},
      values: result.data,
    }
  }

  const fieldErrors = result.error.flatten().fieldErrors
  return {
    values: {},
    errors: {
      confirmPassword: fieldErrors.confirmPassword?.[0]
        ? {
            message: fieldErrors.confirmPassword[0],
            type: "custom",
          }
        : undefined,
      password: fieldErrors.password?.[0]
        ? {
            message: fieldErrors.password[0],
            type: "custom",
          }
        : undefined,
    },
  }
}

type ResetPasswordFormProps = {
  token: string | null
  mode: "invite" | "password_reset"
}

export function ResetPasswordForm({ token, mode }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()
  const form = useForm<PasswordSetupInput>({
    resolver: passwordSetupResolver,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const heading = useMemo(
    () =>
      mode === "invite"
        ? "Admin sahifasi uchun parol o'rnating"
        : "Yangi parol o'rnating",
    [mode]
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!token) {
      setSubmitError("Magic link topilmadi yoki noto'g'ri.")
      return
    }

    setSubmitError(null)

    try {
      if (mode === "invite") {
        await acceptInviteWithMagicLink({
          token,
          password: values.password,
        })
      } else {
        await resetPasswordWithMagicLink({
          token,
          password: values.password,
        })
      }

      router.replace(AUTH_ROUTE_PATHS.login)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Magic link muddati tugagan yoki noto'g'ri."
      )
    }
  })

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {heading}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">Yangi parol</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="pr-12"
            {...form.register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            className="absolute inset-y-0 right-1 my-auto text-slate-500 hover:text-slate-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.password ? (
          <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Parolni tasdiqlang</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            className="pr-12"
            {...form.register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowConfirmPassword((value) => !value)}
            aria-label={showConfirmPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            className="absolute inset-y-0 right-1 my-auto text-slate-500 hover:text-slate-700"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {submitError ? (
        <Alert className="border-red-200 bg-red-50 text-red-700">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full bg-[color:var(--talimy-color-navy)] text-white hover:bg-[color:var(--talimy-color-navy)]/92"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        Parolni saqlash
      </Button>

      <Link
        href={AUTH_ROUTE_PATHS.login}
        className="block text-sm font-medium text-[color:var(--talimy-color-navy)] hover:underline"
      >
        Login sahifasiga qaytish
      </Link>
    </form>
  )
}
