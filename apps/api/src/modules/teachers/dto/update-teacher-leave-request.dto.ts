import { createZodDto } from "nestjs-zod"
import {
  updateTeacherLeaveRequestSchema,
  type UpdateTeacherLeaveRequestInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const UpdateTeacherLeaveRequestDtoBase = createZodDto(
  updateTeacherLeaveRequestSchema
) as ZodDtoClass

export class UpdateTeacherLeaveRequestDto extends UpdateTeacherLeaveRequestDtoBase {}
export interface UpdateTeacherLeaveRequestDto extends UpdateTeacherLeaveRequestInput {}
