import { createZodDto } from "nestjs-zod"
import { teacherWorkloadQuerySchema, type TeacherWorkloadQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherWorkloadQueryDtoBase = createZodDto(teacherWorkloadQuerySchema) as ZodDtoClass

export class TeacherWorkloadQueryDto extends TeacherWorkloadQueryDtoBase {}
export interface TeacherWorkloadQueryDto extends TeacherWorkloadQueryInput {}
