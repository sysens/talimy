import type { CreateTeacherDto } from "./dto/create-teacher.dto"
import type { ListTeachersQueryDto } from "./dto/list-teachers-query.dto"
import type { UpdateTeacherDto } from "./dto/update-teacher.dto"
import type { TeacherCreateFormOptions } from "@talimy/shared"
import { Injectable } from "@nestjs/common"

import { TeachersCreateRepository } from "./teachers-create.repository"
import { TeachersFormService } from "./teachers-form.service"
import { TeachersRepository } from "./teachers.repository"

type FormGenderScope = "all" | "female" | "male"

@Injectable()
export class TeachersService {
  constructor(
    private readonly createRepository: TeachersCreateRepository,
    private readonly formService: TeachersFormService,
    private readonly repository: TeachersRepository
  ) {}

  list(query: ListTeachersQueryDto) {
    return this.repository.list(query)
  }

  getById(tenantId: string, id: string) {
    return this.repository.getById(tenantId, id)
  }

  getFormOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<TeacherCreateFormOptions> {
    return this.formService.getFormOptions(tenantId, genderScope)
  }

  create(payload: CreateTeacherDto) {
    return this.createRepository.create(payload)
  }

  update(tenantId: string, id: string, payload: UpdateTeacherDto) {
    return this.repository.update(tenantId, id, payload)
  }

  delete(tenantId: string, id: string) {
    return this.repository.delete(tenantId, id)
  }

  getSchedule(tenantId: string, id: string) {
    return this.repository.getSchedule(tenantId, id)
  }

  getClasses(tenantId: string, id: string) {
    return this.repository.getClasses(tenantId, id)
  }

  getSubjects(tenantId: string, id: string) {
    return this.repository.getSubjects(tenantId, id)
  }
}
