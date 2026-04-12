"use client"

type ForgotPasswordPayload = {
  email: string
}

type PasswordPayload = {
  token: string
  password: string
}

type ErrorEnvelope = {
  error?: {
    message?: string
  }
}

export async function requestPasswordReset(payload: ForgotPasswordPayload): Promise<void> {
  await postAuthJson("/api/auth/forgot-password", payload, "Magic link yuborilmadi")
}

export async function resetPasswordWithMagicLink(payload: PasswordPayload): Promise<void> {
  await postAuthJson("/api/auth/reset-password", payload, "Parolni saqlab bo'lmadi")
}

export async function acceptInviteWithMagicLink(payload: PasswordPayload): Promise<void> {
  await postAuthJson(
    "/api/auth/invite/accept",
    payload,
    "Taklif havolasi bilan parol o'rnatib bo'lmadi"
  )
}

async function postAuthJson(
  pathname: string,
  payload: Record<string, unknown>,
  fallbackMessage: string
): Promise<void> {
  const response = await fetch(pathname, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  if (response.ok) {
    return
  }

  let message = fallbackMessage
  try {
    const body = (await response.json()) as ErrorEnvelope
    if (typeof body.error?.message === "string" && body.error.message.trim()) {
      message = body.error.message
    }
  } catch {
    // Keep fallback message.
  }

  throw new Error(message)
}
