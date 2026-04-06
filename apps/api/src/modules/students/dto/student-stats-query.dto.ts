import { createZodDto } from "nestjs-zod"
import { studentStatsQuerySchema, type StudentStatsQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const StudentStatsQueryDtoBase = createZodDto(studentStatsQuerySchema) as ZodDtoClass

export class StudentStatsQueryDto extends StudentStatsQueryDtoBase {}
export interface StudentStatsQueryDto extends StudentStatsQueryInput {}
