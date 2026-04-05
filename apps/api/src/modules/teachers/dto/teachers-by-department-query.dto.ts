import { createZodDto } from "nestjs-zod"
import {
  teachersByDepartmentQuerySchema,
  type TeachersByDepartmentQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeachersByDepartmentQueryDtoBase = createZodDto(
  teachersByDepartmentQuerySchema
) as ZodDtoClass

export class TeachersByDepartmentQueryDto extends TeachersByDepartmentQueryDtoBase {}
export interface TeachersByDepartmentQueryDto extends TeachersByDepartmentQueryInput {}
