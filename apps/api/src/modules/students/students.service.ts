import { Injectable } from "@nestjs/common"
import type {
  CreateStudentInput,
  StudentCreateFormOptions,
  UpdateStudentInput,
} from "@talimy/shared"

import { StudentsCreateRepository } from "./students-create.repository"
import { StudentsFormService } from "./students-form.service"
import { StudentsRepository } from "./students.repository"
import { StudentsSummaryRepository } from "./students.summary.repository"

type FormGenderScope = "all" | "female" | "male"

@Injectable()
export class StudentsService {
  constructor(
    private readonly createRepository: StudentsCreateRepository,
    private readonly formService: StudentsFormService,
    private readonly repository: StudentsRepository,
    private readonly summaryRepository: StudentsSummaryRepository
  ) {}

  getById(tenantId: string, id: string) {
    return this.repository.getById(tenantId, id)
  }

  getFormOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<StudentCreateFormOptions> {
    return this.formService.getFormOptions(tenantId, genderScope)
  }

  create(payload: CreateStudentInput) {
    return this.createRepository.create(payload)
  }

  update(tenantId: string, id: string, payload: UpdateStudentInput) {
    return this.repository.update(tenantId, id, payload)
  }

  delete(tenantId: string, id: string) {
    return this.repository.delete(tenantId, id)
  }

  getGrades(tenantId: string, id: string) {
    return this.repository.getGrades(tenantId, id)
  }

  getAttendance(tenantId: string, id: string) {
    return this.repository.getAttendance(tenantId, id)
  }

  getParents(tenantId: string, id: string) {
    return this.repository.getParents(tenantId, id)
  }

  getSummary(tenantId: string, id: string) {
    return this.summaryRepository.getSummary(tenantId, id)
  }
}
