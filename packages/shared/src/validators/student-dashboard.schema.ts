import { z } from "zod"

export const studentDashboardMeQuerySchema = z.object({
  tenantId: z.string().uuid(),
})

export const studentDashboardScoreActivityQuerySchema = z.object({
  tenantId: z.string().uuid(),
  period: z.enum(["weekly"]).default("weekly"),
})

export const studentDashboardAssignmentsQuerySchema = z.object({
  tenantId: z.string().uuid(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(5),
  search: z.string().trim().optional(),
})

export type StudentDashboardAssignmentsQueryInput = z.infer<
  typeof studentDashboardAssignmentsQuerySchema
>
export type StudentDashboardMeQueryInput = z.infer<typeof studentDashboardMeQuerySchema>
export type StudentDashboardScoreActivityQueryInput = z.infer<
  typeof studentDashboardScoreActivityQuerySchema
>
