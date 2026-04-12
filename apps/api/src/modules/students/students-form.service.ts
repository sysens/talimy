import type { StudentCreateFormOptions } from "@talimy/shared"
import { Injectable } from "@nestjs/common"

import { StudentsFormRepository } from "./students-form.repository"

type FormGenderScope = "all" | "female" | "male"

@Injectable()
export class StudentsFormService {
  constructor(private readonly repository: StudentsFormRepository) {}

  getFormOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<StudentCreateFormOptions> {
    return this.repository.getFormOptions(tenantId, genderScope)
  }
}
