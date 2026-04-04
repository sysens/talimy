import { createZodDto } from "nestjs-zod"
import {
  adminFinanceEarningsQuerySchema,
  type AdminFinanceEarningsQueryInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object
const AdminFinanceEarningsQueryDtoBase = createZodDto(
  adminFinanceEarningsQuerySchema
) as ZodDtoClass

export class AdminFinanceEarningsQueryDto extends AdminFinanceEarningsQueryDtoBase {}
export interface AdminFinanceEarningsQueryDto extends AdminFinanceEarningsQueryInput {}
