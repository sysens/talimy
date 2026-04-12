import { createZodDto } from "nestjs-zod"
import { financeFeesTrendQuerySchema, type FinanceFeesTrendQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object

const FinanceFeesTrendQueryDtoBase = createZodDto(financeFeesTrendQuerySchema) as ZodDtoClass

export class FinanceFeesTrendQueryDto extends FinanceFeesTrendQueryDtoBase {}
export interface FinanceFeesTrendQueryDto extends FinanceFeesTrendQueryInput {}
