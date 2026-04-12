import { Module } from "@nestjs/common"

import { PermifyModule } from "../authz/permify/permify.module"
import { AuthModule } from "../auth/auth.module"
import { StudentsController } from "./students.controller"
import { StudentsCreateRepository } from "./students-create.repository"
import { StudentsDetailController } from "./students-detail.controller"
import { StudentsDetailRepository } from "./students-detail.repository"
import { StudentsDetailService } from "./students-detail.service"
import { StudentsDirectoryController } from "./students-directory.controller"
import { StudentsDirectoryRepository } from "./students-directory.repository"
import { StudentsDirectoryService } from "./students-directory.service"
import { StudentsFormRepository } from "./students-form.repository"
import { StudentsFormService } from "./students-form.service"
import { StudentsRepository } from "./students.repository"
import { StudentsService } from "./students.service"
import { StudentsSummaryRepository } from "./students.summary.repository"

@Module({
  imports: [AuthModule, PermifyModule],
  controllers: [StudentsDirectoryController, StudentsDetailController, StudentsController],
  providers: [
    StudentsService,
    StudentsCreateRepository,
    StudentsFormRepository,
    StudentsFormService,
    StudentsRepository,
    StudentsSummaryRepository,
    StudentsDirectoryRepository,
    StudentsDirectoryService,
    StudentsDetailRepository,
    StudentsDetailService,
  ],
  exports: [StudentsService, StudentsDetailRepository, StudentsDetailService],
})
export class StudentsModule {}
