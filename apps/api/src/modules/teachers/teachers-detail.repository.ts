import {
  db,
  teacherAttendanceRecords,
  teacherDocuments,
  teacherLeaveRequests,
  teacherPerformanceSnapshots,
  teacherTrainingRecords,
  teacherWorkloadSnapshots,
  teachers,
} from "@talimy/database"
import { and, asc, desc, eq, gte, inArray, isNull, lte } from "drizzle-orm"
import { Injectable, NotFoundException } from "@nestjs/common"

import type {
  TeacherAttendanceCalendarMonthSummaryView,
  TeacherAttendanceCalendarMonthView,
  TeacherAttendanceCalendarStatusView,
  TeacherDocumentDetailView,
  TeacherLeaveRequestDetailView,
  TeacherPerformanceDetailView,
  TeacherTrainingDetailView,
  TeacherWorkloadDetailDataset,
  TeacherWorkloadSnapshotDetailView,
} from "./teachers-detail.types"

type AttendanceMonthKey = `${number}-${string}`

@Injectable()
export class TeachersDetailRepository {
  async getDocuments(tenantId: string, teacherId: string): Promise<TeacherDocumentDetailView[]> {
    await this.assertTeacherExists(tenantId, teacherId)

    return db
      .select({
        id: teacherDocuments.id,
        fileName: teacherDocuments.fileName,
        mimeType: teacherDocuments.mimeType,
        sizeBytes: teacherDocuments.sizeBytes,
        storageKey: teacherDocuments.storageKey,
      })
      .from(teacherDocuments)
      .where(
        and(
          eq(teacherDocuments.tenantId, tenantId),
          eq(teacherDocuments.teacherId, teacherId),
          isNull(teacherDocuments.deletedAt)
        )
      )
      .orderBy(asc(teacherDocuments.fileName))
  }

  async getWorkload(
    tenantId: string,
    teacherId: string,
    dataset: TeacherWorkloadDetailDataset
  ): Promise<TeacherWorkloadSnapshotDetailView[]> {
    await this.assertTeacherExists(tenantId, teacherId)

    const persistedDataset = dataset === "last8Months" ? "last_8_months" : "this_semester"

    return db
      .select({
        extraDuties: teacherWorkloadSnapshots.extraDuties,
        id: teacherWorkloadSnapshots.id,
        label: teacherWorkloadSnapshots.label,
        periodDate: teacherWorkloadSnapshots.periodDate,
        teachingHours: teacherWorkloadSnapshots.teachingHours,
        totalClasses: teacherWorkloadSnapshots.totalClasses,
      })
      .from(teacherWorkloadSnapshots)
      .where(
        and(
          eq(teacherWorkloadSnapshots.tenantId, tenantId),
          eq(teacherWorkloadSnapshots.teacherId, teacherId),
          eq(teacherWorkloadSnapshots.dataset, persistedDataset),
          isNull(teacherWorkloadSnapshots.deletedAt)
        )
      )
      .orderBy(asc(teacherWorkloadSnapshots.sortOrder))
  }

  async getTraining(
    tenantId: string,
    teacherId: string,
    semester: "current" | "previous"
  ): Promise<TeacherTrainingDetailView[]> {
    await this.assertTeacherExists(tenantId, teacherId)

    return db
      .select({
        eventDate: teacherTrainingRecords.eventDate,
        id: teacherTrainingRecords.id,
        locationLabel: teacherTrainingRecords.locationLabel,
        status: teacherTrainingRecords.status,
        subtitle: teacherTrainingRecords.subtitle,
        title: teacherTrainingRecords.title,
      })
      .from(teacherTrainingRecords)
      .where(
        and(
          eq(teacherTrainingRecords.tenantId, tenantId),
          eq(teacherTrainingRecords.teacherId, teacherId),
          eq(teacherTrainingRecords.semester, semester),
          isNull(teacherTrainingRecords.deletedAt)
        )
      )
      .orderBy(desc(teacherTrainingRecords.eventDate))
  }

  async getAttendanceCalendar(
    tenantId: string,
    teacherId: string,
    month: string
  ): Promise<readonly TeacherAttendanceCalendarMonthView[]> {
    await this.assertTeacherExists(tenantId, teacherId)

    const focusMonth = this.parseMonth(month)
    const monthKeys = this.buildMonthKeys(focusMonth.year, focusMonth.monthNumber)
    const monthRanges = monthKeys.map((key) => this.getMonthRange(key.year, key.monthNumber))
    const firstRange = monthRanges[0]
    const lastRange = monthRanges[monthRanges.length - 1]

    if (!firstRange || !lastRange) {
      return []
    }

    const rows = await db
      .select({
        date: teacherAttendanceRecords.date,
        status: teacherAttendanceRecords.status,
      })
      .from(teacherAttendanceRecords)
      .where(
        and(
          eq(teacherAttendanceRecords.tenantId, tenantId),
          eq(teacherAttendanceRecords.teacherId, teacherId),
          gte(teacherAttendanceRecords.date, firstRange.start),
          lte(teacherAttendanceRecords.date, lastRange.end),
          isNull(teacherAttendanceRecords.deletedAt)
        )
      )
      .orderBy(asc(teacherAttendanceRecords.date))

    const groupedByMonth = new Map<
      AttendanceMonthKey,
      Array<{ date: string; status: "late" | "on_leave" | "present" }>
    >()

    for (const row of rows) {
      const date = new Date(`${row.date}T00:00:00.000Z`)
      const year = date.getUTCFullYear()
      const monthNumber = date.getUTCMonth() + 1
      const key = this.toMonthKey(year, monthNumber)
      const monthRows = groupedByMonth.get(key) ?? []
      monthRows.push({ date: row.date, status: row.status })
      groupedByMonth.set(key, monthRows)
    }

    return monthKeys.map((monthKey) => {
      const key = this.toMonthKey(monthKey.year, monthKey.monthNumber)
      const monthRows = groupedByMonth.get(key) ?? []
      const statuses: Partial<Record<number, TeacherAttendanceCalendarStatusView>> = {}
      const counts: Record<TeacherAttendanceCalendarStatusView, number> = {
        late: 0,
        onLeave: 0,
        present: 0,
      }

      for (const row of monthRows) {
        const day = Number(row.date.slice(-2))
        const status = this.toAttendanceStatus(row.status)
        statuses[day] = status
        counts[status] += 1
      }

      const selectedDay =
        monthRows.find((row) => row.status === "on_leave")?.date.slice(-2) ??
        monthRows[0]?.date.slice(-2) ??
        null

      return {
        key: `${key}-attendance`,
        monthNumber: monthKey.monthNumber,
        selectedDay: selectedDay === null ? null : Number(selectedDay),
        statuses,
        summary: this.buildAttendanceSummary(counts),
        year: monthKey.year,
      }
    })
  }

  async getLeaveRequests(
    tenantId: string,
    teacherId: string
  ): Promise<TeacherLeaveRequestDetailView[]> {
    await this.assertTeacherExists(tenantId, teacherId)

    return db
      .select({
        endDate: teacherLeaveRequests.endDate,
        id: teacherLeaveRequests.id,
        reason: teacherLeaveRequests.reason,
        requestType: teacherLeaveRequests.requestType,
        startDate: teacherLeaveRequests.startDate,
        status: teacherLeaveRequests.status,
      })
      .from(teacherLeaveRequests)
      .where(
        and(
          eq(teacherLeaveRequests.tenantId, tenantId),
          eq(teacherLeaveRequests.teacherId, teacherId),
          isNull(teacherLeaveRequests.deletedAt)
        )
      )
      .orderBy(
        asc(teacherLeaveRequests.status),
        desc(teacherLeaveRequests.startDate),
        desc(teacherLeaveRequests.createdAt)
      )
  }

  async updateLeaveRequest(
    tenantId: string,
    teacherId: string,
    requestId: string,
    status: "approved" | "declined",
    decidedByUserId: string | null
  ): Promise<TeacherLeaveRequestDetailView> {
    await this.assertTeacherExists(tenantId, teacherId)

    const [updated] = await db
      .update(teacherLeaveRequests)
      .set({
        decidedAt: new Date(),
        decidedByUserId,
        status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(teacherLeaveRequests.id, requestId),
          eq(teacherLeaveRequests.tenantId, tenantId),
          eq(teacherLeaveRequests.teacherId, teacherId),
          isNull(teacherLeaveRequests.deletedAt)
        )
      )
      .returning({
        endDate: teacherLeaveRequests.endDate,
        id: teacherLeaveRequests.id,
        reason: teacherLeaveRequests.reason,
        requestType: teacherLeaveRequests.requestType,
        startDate: teacherLeaveRequests.startDate,
        status: teacherLeaveRequests.status,
      })

    if (!updated) {
      throw new NotFoundException("Teacher leave request not found")
    }

    return updated
  }

  async getPerformance(
    tenantId: string,
    teacherId: string,
    period: "lastMonth" | "lastQuarter"
  ): Promise<TeacherPerformanceDetailView> {
    await this.assertTeacherExists(tenantId, teacherId)

    const persistedPeriod = period === "lastMonth" ? "last_month" : "last_quarter"
    const [row] = await db
      .select({
        gradingTimelinessTarget: teacherPerformanceSnapshots.gradingTimelinessTarget,
        gradingTimelinessValue: teacherPerformanceSnapshots.gradingTimelinessValue,
        studentAverageGradeTarget: teacherPerformanceSnapshots.studentAverageGradeTarget,
        studentAverageGradeValue: teacherPerformanceSnapshots.studentAverageGradeValue,
        studentFeedbackTarget: teacherPerformanceSnapshots.studentFeedbackTarget,
        studentFeedbackValue: teacherPerformanceSnapshots.studentFeedbackValue,
      })
      .from(teacherPerformanceSnapshots)
      .where(
        and(
          eq(teacherPerformanceSnapshots.tenantId, tenantId),
          eq(teacherPerformanceSnapshots.teacherId, teacherId),
          eq(teacherPerformanceSnapshots.period, persistedPeriod),
          isNull(teacherPerformanceSnapshots.deletedAt)
        )
      )
      .limit(1)

    if (!row) {
      throw new NotFoundException("Teacher performance snapshot not found")
    }

    return {
      ...row,
      period,
    }
  }

  private async assertTeacherExists(tenantId: string, teacherId: string): Promise<void> {
    const [row] = await db
      .select({ id: teachers.id })
      .from(teachers)
      .where(
        and(eq(teachers.id, teacherId), eq(teachers.tenantId, tenantId), isNull(teachers.deletedAt))
      )
      .limit(1)

    if (!row) {
      throw new NotFoundException("Teacher not found")
    }
  }

  private buildAttendanceSummary(
    counts: Record<TeacherAttendanceCalendarStatusView, number>
  ): readonly TeacherAttendanceCalendarMonthSummaryView[] {
    return [
      { label: "Present", status: "present", value: counts.present },
      { label: "Late", status: "late", value: counts.late },
      { label: "On Leave", status: "onLeave", value: counts.onLeave },
    ] as const
  }

  private buildMonthKeys(
    year: number,
    monthNumber: number
  ): ReadonlyArray<{ monthNumber: number; year: number }> {
    const focusDate = new Date(Date.UTC(year, monthNumber - 1, 1))
    const months: Array<{ monthNumber: number; year: number }> = []

    for (const offset of [-1, 0, 1] as const) {
      const value = new Date(
        Date.UTC(focusDate.getUTCFullYear(), focusDate.getUTCMonth() + offset, 1)
      )
      months.push({ monthNumber: value.getUTCMonth() + 1, year: value.getUTCFullYear() })
    }

    return months
  }

  private getMonthRange(year: number, monthNumber: number): { end: string; start: string } {
    const start = new Date(Date.UTC(year, monthNumber - 1, 1))
    const end = new Date(Date.UTC(year, monthNumber, 0))

    return {
      end: end.toISOString().slice(0, 10),
      start: start.toISOString().slice(0, 10),
    }
  }

  private parseMonth(value: string): { monthNumber: number; year: number } {
    const [yearPart, monthPart] = value.split("-")
    const year = Number(yearPart)
    const monthNumber = Number(monthPart)

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(monthNumber) ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      throw new NotFoundException("Invalid attendance calendar month")
    }

    return { monthNumber, year }
  }

  private toAttendanceStatus(
    status: "late" | "on_leave" | "present"
  ): TeacherAttendanceCalendarStatusView {
    if (status === "on_leave") {
      return "onLeave"
    }

    return status
  }

  private toMonthKey(year: number, monthNumber: number): AttendanceMonthKey {
    return `${year}-${String(monthNumber).padStart(2, "0")}`
  }
}
