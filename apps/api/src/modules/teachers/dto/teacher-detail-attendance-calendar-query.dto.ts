import { createZodDto } from "nestjs-zod"
import {
  teacherAttendanceCalendarQuerySchema,
  type TeacherAttendanceCalendarQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherDetailAttendanceCalendarQueryDtoBase = createZodDto(
  teacherAttendanceCalendarQuerySchema
) as ZodDtoClass

export class TeacherDetailAttendanceCalendarQueryDto extends TeacherDetailAttendanceCalendarQueryDtoBase {}
export interface TeacherDetailAttendanceCalendarQueryDto extends TeacherAttendanceCalendarQueryInput {}
