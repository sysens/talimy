import { createZodDto } from "nestjs-zod"
import {
  adminStudentsByGenderQuerySchema,
  type AdminStudentsByGenderQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminStudentsByGenderQueryDtoBase = createZodDto(
  adminStudentsByGenderQuerySchema
) as ZodDtoClass

export class AdminStudentsByGenderQueryDto extends AdminStudentsByGenderQueryDtoBase {}
export interface AdminStudentsByGenderQueryDto extends AdminStudentsByGenderQueryInput {}
