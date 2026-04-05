import { createZodDto } from "nestjs-zod"
import {
  teacherWorkloadDetailQuerySchema,
  type TeacherWorkloadDetailQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherDetailWorkloadQueryDtoBase = createZodDto(
  teacherWorkloadDetailQuerySchema
) as ZodDtoClass

export class TeacherDetailWorkloadQueryDto extends TeacherDetailWorkloadQueryDtoBase {}
export interface TeacherDetailWorkloadQueryDto extends TeacherWorkloadDetailQueryInput {}
