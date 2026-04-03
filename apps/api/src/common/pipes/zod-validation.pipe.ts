import {
  type ArgumentMetadata,
  BadRequestException,
  Injectable,
  type PipeTransform,
} from "@nestjs/common"
import type { ZodIssue, ZodType } from "zod"

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    const result = this.schema.safeParse(value)

    if (result.success) {
      return result.data
    }

    throw new BadRequestException({
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: result.error.issues.map((item: ZodIssue) => ({
        field: item.path?.join("."),
        message: item.message,
      })),
    })
  }
}
