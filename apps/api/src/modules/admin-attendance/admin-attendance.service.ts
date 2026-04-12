import { Injectable } from "@nestjs/common"

import type {
  AdminAttendanceMarkInput,
  AdminAttendanceGridQueryInput,
  AdminAttendanceOptionsQueryInput,
  AdminAttendanceSummaryQueryInput,
  AdminAttendanceTrendQueryInput,
} from "@talimy/shared"

import { AdminAttendanceRepository } from "./admin-attendance.repository"

type ScopedGender = "female" | "male" | undefined

@Injectable()
export class AdminAttendanceService {
  constructor(private readonly repository: AdminAttendanceRepository) {}

  getSummary(query: AdminAttendanceSummaryQueryInput, scopedGender: ScopedGender) {
    return this.repository.getSummary(query, scopedGender)
  }

  getTrends(query: AdminAttendanceTrendQueryInput, scopedGender: ScopedGender) {
    return this.repository.getTrends(query, scopedGender)
  }

  getOptions(query: AdminAttendanceOptionsQueryInput, scopedGender: ScopedGender) {
    return this.repository.getOptions(query, scopedGender)
  }

  getGrid(query: AdminAttendanceGridQueryInput, scopedGender: ScopedGender) {
    return this.repository.getGrid(query, scopedGender)
  }

  mark(payload: AdminAttendanceMarkInput) {
    return this.repository.mark(payload)
  }
}
