import { z } from "zod"

export const eventTypeSchema = z.enum([
  "academic",
  "events",
  "finance",
  "administration",
  "exam",
  "holiday",
  "sports",
  "other",
])

export const eventVisibilitySchema = z.enum(["all", "admin", "teachers", "students"])

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const timeOnlySchema = z.string().regex(/^\d{2}:\d{2}$/)

function validateEventDateRange(
  value: { endDate?: string; startDate?: string },
  ctx: z.RefinementCtx
): void {
  if (!value.startDate || !value.endDate) {
    return
  }

  if (new Date(value.endDate).getTime() < new Date(value.startDate).getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "endDate must be greater than or equal to startDate",
    })
  }
}

function validateEventTimeRange(
  value: { date: string; endTime: string; startTime: string },
  ctx: z.RefinementCtx
): void {
  const startDate = new Date(`${value.date}T${value.startTime}:00`)
  const endDate = new Date(`${value.date}T${value.endTime}:00`)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return
  }

  if (endDate.getTime() <= startDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "endTime must be greater than startTime",
    })
  }
}

const createEventBaseSchema = z.object({
  tenantId: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().trim().max(255).optional(),
  type: eventTypeSchema.default("administration"),
  visibility: eventVisibilitySchema.default("all"),
})

export const createEventSchema = createEventBaseSchema.superRefine(validateEventDateRange)

export const createEventFormSchema = z
  .object({
    date: dateOnlySchema,
    description: z.string().trim().max(1000).optional(),
    endTime: timeOnlySchema,
    location: z.string().trim().max(255).optional(),
    startTime: timeOnlySchema,
    title: z.string().trim().min(1).max(255),
    type: eventTypeSchema.default("administration"),
    visibility: eventVisibilitySchema.default("all"),
  })
  .superRefine(validateEventTimeRange)

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(1000).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    location: z.string().trim().max(255).optional().nullable(),
    type: eventTypeSchema.optional(),
    visibility: eventVisibilitySchema.optional(),
  })
  .superRefine(validateEventDateRange)

export const eventsQuerySchema = z
  .object({
    tenantId: z.string().uuid(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(20),
    search: z.string().optional(),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("asc"),
    type: eventTypeSchema.optional(),
    visibility: eventVisibilitySchema.optional(),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.month && (value.dateFrom || value.dateTo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "month cannot be combined with dateFrom/dateTo",
      })
    }

    if (!value.dateFrom || !value.dateTo) {
      return
    }

    if (new Date(value.dateTo).getTime() < new Date(value.dateFrom).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateTo"],
        message: "dateTo must be greater than or equal to dateFrom",
      })
    }
  })

export type CreateEventInput = z.infer<typeof createEventSchema>
export type CreateEventFormInput = z.infer<typeof createEventFormSchema>
export type EventsQueryInput = z.infer<typeof eventsQuerySchema>
export type EventTypeInput = z.infer<typeof eventTypeSchema>
export type EventVisibilityInput = z.infer<typeof eventVisibilitySchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
