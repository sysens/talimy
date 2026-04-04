import { createZodDto } from "nestjs-zod"
import { adminDashboardStatsQuerySchema, type AdminDashboardStatsQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminDashboardStatsQueryDtoBase = createZodDto(adminDashboardStatsQuerySchema) as ZodDtoClass

export class AdminDashboardStatsQueryDto extends AdminDashboardStatsQueryDtoBase {}
export interface AdminDashboardStatsQueryDto extends AdminDashboardStatsQueryInput {}
