import { createZodDto } from "nestjs-zod"
import {
  teacherAttendanceOverviewQuerySchema,
  type TeacherAttendanceOverviewQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherAttendanceOverviewQueryDtoBase = createZodDto(
  teacherAttendanceOverviewQuerySchema
) as ZodDtoClass

export class TeacherAttendanceOverviewQueryDto extends TeacherAttendanceOverviewQueryDtoBase {}
export interface TeacherAttendanceOverviewQueryDto extends TeacherAttendanceOverviewQueryInput {}
