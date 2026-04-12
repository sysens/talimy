import { createZodDto } from "nestjs-zod"
import { studentFormOptionsQuerySchema, type StudentFormOptionsQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const StudentFormOptionsQueryDtoBase = createZodDto(studentFormOptionsQuerySchema) as ZodDtoClass

export class StudentFormOptionsQueryDto extends StudentFormOptionsQueryDtoBase {}
export interface StudentFormOptionsQueryDto extends StudentFormOptionsQueryInput {}
