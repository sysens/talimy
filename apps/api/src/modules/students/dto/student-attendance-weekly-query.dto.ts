import { createZodDto } from "nestjs-zod"
import {
  studentAttendanceWeeklyQuerySchema,
  type StudentAttendanceWeeklyQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const StudentAttendanceWeeklyQueryDtoBase = createZodDto(
  studentAttendanceWeeklyQuerySchema
) as ZodDtoClass

export class StudentAttendanceWeeklyQueryDto extends StudentAttendanceWeeklyQueryDtoBase {}
export interface StudentAttendanceWeeklyQueryDto extends StudentAttendanceWeeklyQueryInput {}
