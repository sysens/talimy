import { createZodDto } from "nestjs-zod"
import { teacherStatsQuerySchema, type TeacherStatsQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherStatsQueryDtoBase = createZodDto(teacherStatsQuerySchema) as ZodDtoClass

export class TeacherStatsQueryDto extends TeacherStatsQueryDtoBase {}
export interface TeacherStatsQueryDto extends TeacherStatsQueryInput {}
