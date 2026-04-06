import { Injectable } from "@nestjs/common"

import type { AdminStudentEnrollmentTrendsQueryDto } from "./dto/admin-student-enrollment-trends-query.dto"
import type { ListStudentsQueryDto } from "./dto/list-students-query.dto"
import type { StudentAttendanceWeeklyQueryDto } from "./dto/student-attendance-weekly-query.dto"
import type { StudentSpecialProgramsQueryDto } from "./dto/student-special-programs-query.dto"
import { StudentsDirectoryRepository } from "./students-directory.repository"

@Injectable()
export class StudentsDirectoryService {
  constructor(private readonly repository: StudentsDirectoryRepository) {}

  getStats(tenantId: string, gender: "male" | "female" | undefined) {
    return this.repository.getStats(tenantId, gender)
  }

  getEnrollmentTrends(
    query: AdminStudentEnrollmentTrendsQueryDto,
    gender: "male" | "female" | undefined
  ) {
    return this.repository.getEnrollmentTrends(query, gender)
  }

  getSpecialPrograms(query: StudentSpecialProgramsQueryDto, gender: "male" | "female" | undefined) {
    return this.repository.getSpecialPrograms(query, gender)
  }

  getAttendanceWeekly(
    query: StudentAttendanceWeeklyQueryDto,
    gender: "male" | "female" | undefined
  ) {
    return this.repository.getAttendanceWeekly(query, gender)
  }

  list(query: ListStudentsQueryDto) {
    return this.repository.list(query)
  }
}
