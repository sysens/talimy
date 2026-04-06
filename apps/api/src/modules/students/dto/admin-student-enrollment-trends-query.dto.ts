import { createZodDto } from "nestjs-zod"
import {
  studentEnrollmentTrendsQuerySchema,
  type StudentEnrollmentTrendsQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminStudentEnrollmentTrendsQueryDtoBase = createZodDto(
  studentEnrollmentTrendsQuerySchema
) as ZodDtoClass

export class AdminStudentEnrollmentTrendsQueryDto extends AdminStudentEnrollmentTrendsQueryDtoBase {}
export interface AdminStudentEnrollmentTrendsQueryDto extends StudentEnrollmentTrendsQueryInput {}
