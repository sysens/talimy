import { createZodDto } from "nestjs-zod"
import {
  teacherLeaveRequestsQuerySchema,
  type TeacherLeaveRequestsQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const TeacherDetailLeaveRequestsQueryDtoBase = createZodDto(
  teacherLeaveRequestsQuerySchema
) as ZodDtoClass

export class TeacherDetailLeaveRequestsQueryDto extends TeacherDetailLeaveRequestsQueryDtoBase {}
export interface TeacherDetailLeaveRequestsQueryDto extends TeacherLeaveRequestsQueryInput {}
