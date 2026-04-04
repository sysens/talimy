import { createZodDto } from "nestjs-zod"
import { adminActivityQuerySchema, type AdminActivityQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminActivityQueryDtoBase = createZodDto(adminActivityQuerySchema) as ZodDtoClass

export class AdminActivityQueryDto extends AdminActivityQueryDtoBase {}
export interface AdminActivityQueryDto extends AdminActivityQueryInput {}
