import { createZodDto } from "nestjs-zod"
import { teacherPerformanceQuerySchema, type TeacherPerformanceQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherDetailPerformanceQueryDtoBase = createZodDto(
  teacherPerformanceQuerySchema
) as ZodDtoClass

export class TeacherDetailPerformanceQueryDto extends TeacherDetailPerformanceQueryDtoBase {}
export interface TeacherDetailPerformanceQueryDto extends TeacherPerformanceQueryInput {}
