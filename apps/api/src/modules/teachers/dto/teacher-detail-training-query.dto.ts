import { createZodDto } from "nestjs-zod"
import { teacherTrainingQuerySchema, type TeacherTrainingQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherDetailTrainingQueryDtoBase = createZodDto(teacherTrainingQuerySchema) as ZodDtoClass

export class TeacherDetailTrainingQueryDto extends TeacherDetailTrainingQueryDtoBase {}
export interface TeacherDetailTrainingQueryDto extends TeacherTrainingQueryInput {}
