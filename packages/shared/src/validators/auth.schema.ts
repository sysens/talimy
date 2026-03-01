import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  tenantId: z.string().uuid().optional(),
  role: z.literal("platform_admin").optional(),
  bootstrapKey: z.string().min(8),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10),
})

export const logoutSchema = z.object({
  refreshToken: z.string().min(10).optional(),
})

export const magicLinkPurposeSchema = z.enum(["invite", "password_reset"])

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8),
})

export const acceptInviteSchema = resetPasswordSchema

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type LogoutInput = z.infer<typeof logoutSchema>
export type MagicLinkPurpose = z.infer<typeof magicLinkPurposeSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>
