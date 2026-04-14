import { Module } from "@nestjs/common"

import { PermifyModule } from "../authz/permify/permify.module"
import { AuthModule } from "../auth/auth.module"
import { StudentsController } from "./students.controller"
import { StudentsCreateRepository } from "./students-create.repository"
import { StudentsDashboardController } from "./students-dashboard.controller"
import { StudentsDashboardRepository } from "./students-dashboard.repository"
import { StudentsDashboardService } from "./students-dashboard.service"
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
  controllers: [
    StudentsDashboardController,
    StudentsDirectoryController,
    StudentsDetailController,
    StudentsController,
  ],
  providers: [
    StudentsService,
    StudentsCreateRepository,
    StudentsFormRepository,
    StudentsFormService,
    StudentsRepository,
    StudentsSummaryRepository,
    StudentsDashboardRepository,
    StudentsDashboardService,
    StudentsDirectoryRepository,
    StudentsDirectoryService,
    StudentsDetailRepository,
    StudentsDetailService,
  ],
  exports: [
    StudentsService,
    StudentsDetailRepository,
    StudentsDetailService,
    StudentsDashboardRepository,
    StudentsDashboardService,
  ],
})
export class StudentsModule {}
