import { createZodDto } from "nestjs-zod"
import { teacherDocumentsQuerySchema, type TeacherDocumentsQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherDetailDocumentsQueryDtoBase = createZodDto(teacherDocumentsQuerySchema) as ZodDtoClass

export class TeacherDetailDocumentsQueryDto extends TeacherDetailDocumentsQueryDtoBase {}
export interface TeacherDetailDocumentsQueryDto extends TeacherDocumentsQueryInput {}
