import { createZodDto } from "nestjs-zod"
import { teacherFormOptionsQuerySchema, type TeacherFormOptionsQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherFormOptionsQueryDtoBase = createZodDto(teacherFormOptionsQuerySchema) as ZodDtoClass

export class TeacherFormOptionsQueryDto extends TeacherFormOptionsQueryDtoBase {}
export interface TeacherFormOptionsQueryDto extends TeacherFormOptionsQueryInput {}
