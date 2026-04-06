import { Module } from "@nestjs/common"

import { PermifyModule } from "../authz/permify/permify.module"
import { AuthModule } from "../auth/auth.module"
import { StudentsController } from "./students.controller"
import { StudentsDirectoryController } from "./students-directory.controller"
import { StudentsDirectoryRepository } from "./students-directory.repository"
import { StudentsDirectoryService } from "./students-directory.service"
import { StudentsRepository } from "./students.repository"
import { StudentsService } from "./students.service"
import { StudentsSummaryRepository } from "./students.summary.repository"

@Module({
  imports: [AuthModule, PermifyModule],
  controllers: [StudentsDirectoryController, StudentsController],
  providers: [
    StudentsService,
    StudentsRepository,
    StudentsSummaryRepository,
    StudentsDirectoryRepository,
    StudentsDirectoryService,
  ],
  exports: [StudentsService],
})
export class StudentsModule {}
