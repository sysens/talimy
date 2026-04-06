import { createZodDto } from "nestjs-zod"
import {
  studentSpecialProgramsQuerySchema,
  type StudentSpecialProgramsQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const StudentSpecialProgramsQueryDtoBase = createZodDto(
  studentSpecialProgramsQuerySchema
) as ZodDtoClass

export class StudentSpecialProgramsQueryDto extends StudentSpecialProgramsQueryDtoBase {}
export interface StudentSpecialProgramsQueryDto extends StudentSpecialProgramsQueryInput {}
