import { createZodDto } from "nestjs-zod"
import { listTeachersQuerySchema, type ListTeachersQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const ListTeachersQueryDtoBase = createZodDto(listTeachersQuerySchema) as ZodDtoClass

export class ListTeachersQueryDto extends ListTeachersQueryDtoBase {}
export interface ListTeachersQueryDto extends Omit<
  ListTeachersQueryInput,
  "departmentId" | "gender" | "status"
> {
  departmentId: string[]
  gender: Array<"male" | "female">
  genderScope?: "male" | "female" | "all"
  status: Array<"active" | "inactive" | "on_leave">
}
