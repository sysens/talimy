import { createZodDto } from "nestjs-zod"
import { financeFeesListQuerySchema, type FinanceFeesListQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object

const FinanceFeesListQueryDtoBase = createZodDto(financeFeesListQuerySchema) as ZodDtoClass

export class FinanceFeesListQueryDto extends FinanceFeesListQueryDtoBase {}
export interface FinanceFeesListQueryDto extends FinanceFeesListQueryInput {}
