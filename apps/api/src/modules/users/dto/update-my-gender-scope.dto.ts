import { createZodDto } from "nestjs-zod"
import { type UpdateMyGenderScopeInput, updateMyGenderScopeSchema } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object

const UpdateMyGenderScopeDtoBase = createZodDto(updateMyGenderScopeSchema) as ZodDtoClass

export class UpdateMyGenderScopeDto extends UpdateMyGenderScopeDtoBase {}
export interface UpdateMyGenderScopeDto extends UpdateMyGenderScopeInput {}
