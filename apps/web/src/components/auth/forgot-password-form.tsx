"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@talimy/shared"
import { Alert, AlertDescription, Button, Input, Label } from "@talimy/ui"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { AUTH_ROUTE_PATHS } from "@/lib/auth-options"
import { requestPasswordReset } from "@/lib/auth-client"

export function ForgotPasswordForm() {
  const [submitState, setSubmitState] = useState<"idle" | "success">("idle")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    try {
      await requestPasswordReset(values)
      setSubmitState("success")
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Magic link yuborilmadi. Keyinroq urinib ko'ring."
      )
    }
  })

  return (
    <div className="space-y-5">
      {submitState === "success" ? (
        <Alert className="border-[color:var(--talimy-color-sky)]/40 bg-[color:var(--talimy-color-sky)]/14 text-[color:var(--talimy-color-navy)]">
          <AlertDescription>
            Agar email tizimda mavjud bo'lsa, parolni tiklash havolasi shu manzilga yuborildi.
          </AlertDescription>
        </Alert>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            autoComplete="email"
            placeholder="school-admin@talimy.space"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
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
          Magic link yuborish
        </Button>
      </form>

      <Link
        href={AUTH_ROUTE_PATHS.login}
        className="block text-sm font-medium text-[color:var(--talimy-color-navy)] hover:underline"
      >
        Login sahifasiga qaytish
      </Link>
    </div>
  )
}
