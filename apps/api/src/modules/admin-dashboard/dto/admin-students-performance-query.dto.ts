import { createZodDto } from "nestjs-zod"
import {
  adminStudentsPerformanceQuerySchema,
  type AdminStudentsPerformanceQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminStudentsPerformanceQueryDtoBase = createZodDto(
  adminStudentsPerformanceQuerySchema
) as ZodDtoClass

export class AdminStudentsPerformanceQueryDto extends AdminStudentsPerformanceQueryDtoBase {}
export interface AdminStudentsPerformanceQueryDto extends AdminStudentsPerformanceQueryInput {}
