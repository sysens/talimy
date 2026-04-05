import type { TeacherCreateFormOptions } from "@talimy/shared"
import { Injectable } from "@nestjs/common"

import { TeachersFormRepository } from "./teachers-form.repository"

type FormGenderScope = "all" | "female" | "male"

@Injectable()
export class TeachersFormService {
  constructor(private readonly repository: TeachersFormRepository) {}

  getFormOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<TeacherCreateFormOptions> {
    return this.repository.getFormOptions(tenantId, genderScope)
  }
}
