import { createZodDto } from "nestjs-zod"
import { financeFeesProgressQuerySchema, type FinanceFeesProgressQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object

const FinanceFeesProgressQueryDtoBase = createZodDto(financeFeesProgressQuerySchema) as ZodDtoClass

export class FinanceFeesProgressQueryDto extends FinanceFeesProgressQueryDtoBase {}
export interface FinanceFeesProgressQueryDto extends FinanceFeesProgressQueryInput {}
