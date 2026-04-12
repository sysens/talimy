import { createZodDto } from "nestjs-zod"
import { financeFeesSummaryQuerySchema, type FinanceFeesSummaryQueryInput } from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object

const FinanceFeesSummaryQueryDtoBase = createZodDto(financeFeesSummaryQuerySchema) as ZodDtoClass

export class FinanceFeesSummaryQueryDto extends FinanceFeesSummaryQueryDtoBase {}
export interface FinanceFeesSummaryQueryDto extends FinanceFeesSummaryQueryInput {}
