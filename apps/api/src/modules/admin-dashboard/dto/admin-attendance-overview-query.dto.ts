import { createZodDto } from "nestjs-zod"
import {
  adminAttendanceOverviewQuerySchema,
  type AdminAttendanceOverviewQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminAttendanceOverviewQueryDtoBase = createZodDto(
  adminAttendanceOverviewQuerySchema
) as ZodDtoClass

export class AdminAttendanceOverviewQueryDto extends AdminAttendanceOverviewQueryDtoBase {}
export interface AdminAttendanceOverviewQueryDto extends AdminAttendanceOverviewQueryInput {}
