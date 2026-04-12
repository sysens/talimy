import {
  attendance,
  db,
  grades,
  studentBehaviorLogs,
  studentDocuments,
  studentExtracurricularRecords,
  studentHealthRecords,
  studentScholarships,
  students,
} from "@talimy/database"
import { and, asc, eq, gte, isNull, lte, sql } from "drizzle-orm"
import { Injectable, NotFoundException } from "@nestjs/common"

import type {
  StudentAcademicPerformanceDetailView,
  StudentAttendanceCalendarMonthSummaryView,
  StudentAttendanceCalendarMonthView,
  StudentAttendanceCalendarStatusView,
  StudentBehaviorLogDetailView,
  StudentDocumentDetailView,
  StudentExtracurricularRecordDetailView,
  StudentHealthRecordDetailView,
  StudentScholarshipDetailView,
} from "./students-detail.types"

type AttendanceMonthKey = `${number}-${string}`

@Injectable()
export class StudentsDetailRepository {
  async getDocuments(tenantId: string, studentId: string): Promise<StudentDocumentDetailView[]> {
    await this.assertStudentExists(tenantId, studentId)

    return db
      .select({
        fileName: studentDocuments.fileName,
        id: studentDocuments.id,
        mimeType: studentDocuments.mimeType,
        sizeBytes: studentDocuments.sizeBytes,
        storageKey: studentDocuments.storageKey,
      })
      .from(studentDocuments)
      .where(
        and(
          eq(studentDocuments.tenantId, tenantId),
          eq(studentDocuments.studentId, studentId),
          isNull(studentDocuments.deletedAt)
        )
      )
      .orderBy(asc(studentDocuments.fileName))
  }

  async getAttendanceCalendar(
    tenantId: string,
    studentId: string,
    month: string
  ): Promise<readonly StudentAttendanceCalendarMonthView[]> {
    await this.assertStudentExists(tenantId, studentId)

    const focusMonth = this.parseMonth(month)
    const monthKeys = this.buildMonthKeys(focusMonth.year, focusMonth.monthNumber)
    const monthRanges = monthKeys.map((item) => this.getMonthRange(item.year, item.monthNumber))
    const firstRange = monthRanges[0]
    const lastRange = monthRanges[monthRanges.length - 1]

    if (!firstRange || !lastRange) {
      return []
    }

    const rows = await db
      .select({
        date: attendance.date,
        status: attendance.status,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          eq(attendance.studentId, studentId),
          gte(attendance.date, firstRange.start),
          lte(attendance.date, lastRange.end),
          isNull(attendance.deletedAt)
        )
      )
      .orderBy(asc(attendance.date))

    const groupedByMonth = new Map<
      AttendanceMonthKey,
      Array<{
        date: string
        status: "absent" | "excused" | "late" | "present"
      }>
    >()

    for (const row of rows) {
      const date = new Date(`${row.date}T00:00:00.000Z`)
      const key = this.toMonthKey(date.getUTCFullYear(), date.getUTCMonth() + 1)
      const monthRows = groupedByMonth.get(key) ?? []
      monthRows.push(row)
      groupedByMonth.set(key, monthRows)
    }

    return monthKeys.map((monthKey) => {
      const key = this.toMonthKey(monthKey.year, monthKey.monthNumber)
      const monthRows = groupedByMonth.get(key) ?? []
      const statuses: Partial<Record<number, StudentAttendanceCalendarStatusView>> = {}
      const counts: Record<StudentAttendanceCalendarStatusView, number> = {
        absent: 0,
        late: 0,
        present: 0,
        sick: 0,
      }

      for (const row of monthRows) {
        const day = Number(row.date.slice(-2))
        const status = this.toAttendanceStatus(row.status)
        statuses[day] = status
        counts[status] += 1
      }

      return {
        key: `${key}-attendance`,
        monthNumber: monthKey.monthNumber,
        selectedDay: this.resolveSelectedDay(monthRows),
        statuses,
        summary: this.buildAttendanceSummary(counts),
        year: monthKey.year,
      }
    })
  }

  async getScholarships(
    tenantId: string,
    studentId: string
  ): Promise<readonly StudentScholarshipDetailView[]> {
    await this.assertStudentExists(tenantId, studentId)

    return db
      .select({
        id: studentScholarships.id,
        scholarshipType: studentScholarships.scholarshipType,
        title: studentScholarships.title,
      })
      .from(studentScholarships)
      .where(
        and(
          eq(studentScholarships.tenantId, tenantId),
          eq(studentScholarships.studentId, studentId),
          isNull(studentScholarships.deletedAt)
        )
      )
      .orderBy(asc(studentScholarships.createdAt))
  }

  async getHealth(
    tenantId: string,
    studentId: string
  ): Promise<readonly StudentHealthRecordDetailView[]> {
    await this.assertStudentExists(tenantId, studentId)

    return db
      .select({
        description: studentHealthRecords.description,
        id: studentHealthRecords.id,
        label: studentHealthRecords.label,
        tone: studentHealthRecords.tone,
      })
      .from(studentHealthRecords)
      .where(
        and(
          eq(studentHealthRecords.tenantId, tenantId),
          eq(studentHealthRecords.studentId, studentId),
          isNull(studentHealthRecords.deletedAt)
        )
      )
      .orderBy(asc(studentHealthRecords.createdAt))
  }

  async getAcademicPerformance(
    tenantId: string,
    studentId: string,
    period: "last6Months" | "thisSemester"
  ): Promise<StudentAcademicPerformanceDetailView> {
    await this.assertStudentExists(tenantId, studentId)

    const rows = await db
      .select({
        averageScore: sql<number>`round(avg((${grades.score})::numeric), 0)::int`.as(
          "average_score"
        ),
        monthKey: sql<string>`to_char(${grades.createdAt} at time zone 'UTC', 'YYYY-MM')`.as(
          "month_key"
        ),
        monthLabel: sql<string>`trim(to_char(${grades.createdAt} at time zone 'UTC', 'Mon'))`.as(
          "month_label"
        ),
      })
      .from(grades)
      .where(
        and(
          eq(grades.tenantId, tenantId),
          eq(grades.studentId, studentId),
          isNull(grades.deletedAt)
        )
      )
      .groupBy(
        sql`to_char(${grades.createdAt} at time zone 'UTC', 'YYYY-MM')`,
        sql`trim(to_char(${grades.createdAt} at time zone 'UTC', 'Mon'))`
      )
      .orderBy(asc(sql`to_char(${grades.createdAt} at time zone 'UTC', 'YYYY-MM')`))

    const selectedRows = period === "last6Months" ? rows.slice(-6) : rows.slice(0, 6)
    const points = selectedRows.map((row) => ({
      label: row.monthLabel,
      monthKey: row.monthKey,
      value: row.averageScore,
    }))
    const averageScore =
      points.length > 0 ? points.reduce((sum, point) => sum + point.value, 0) / points.length : 0

    return {
      averageScoreMax: 4,
      averageScoreValue: Math.round((averageScore / 25) * 10) / 10,
      note: resolveAcademicPerformanceNote(averageScore),
      period,
      points,
    }
  }

  async getExtracurricular(
    tenantId: string,
    studentId: string
  ): Promise<readonly StudentExtracurricularRecordDetailView[]> {
    await this.assertStudentExists(tenantId, studentId)

    const rows = await db
      .select({
        achievement: studentExtracurricularRecords.achievement,
        advisorName: studentExtracurricularRecords.advisorName,
        clubName: studentExtracurricularRecords.clubName,
        endDate: studentExtracurricularRecords.endDate,
        iconKey: studentExtracurricularRecords.iconKey,
        id: studentExtracurricularRecords.id,
        roleLabel: studentExtracurricularRecords.roleLabel,
        startDate: studentExtracurricularRecords.startDate,
      })
      .from(studentExtracurricularRecords)
      .where(
        and(
          eq(studentExtracurricularRecords.tenantId, tenantId),
          eq(studentExtracurricularRecords.studentId, studentId),
          isNull(studentExtracurricularRecords.deletedAt)
        )
      )
      .orderBy(asc(studentExtracurricularRecords.startDate))

    return rows.map((row) => ({
      achievement: row.achievement,
      advisorName: row.advisorName,
      clubName: row.clubName,
      durationLabel:
        row.endDate === null
          ? `${row.startDate.slice(0, 4)} - Present`
          : `${row.startDate.slice(0, 4)} - ${row.endDate.slice(0, 4)}`,
      iconKey: row.iconKey,
      id: row.id,
      roleLabel: row.roleLabel,
    }))
  }

  async getBehaviorLog(
    tenantId: string,
    studentId: string
  ): Promise<readonly StudentBehaviorLogDetailView[]> {
    await this.assertStudentExists(tenantId, studentId)

    return db
      .select({
        actionStatus: studentBehaviorLogs.actionStatus,
        details: studentBehaviorLogs.details,
        entryType: studentBehaviorLogs.entryType,
        id: studentBehaviorLogs.id,
        recordDate: studentBehaviorLogs.recordDate,
        reportedByLabel: studentBehaviorLogs.reportedByLabel,
        title: studentBehaviorLogs.title,
      })
      .from(studentBehaviorLogs)
      .where(
        and(
          eq(studentBehaviorLogs.tenantId, tenantId),
          eq(studentBehaviorLogs.studentId, studentId),
          isNull(studentBehaviorLogs.deletedAt)
        )
      )
      .orderBy(asc(studentBehaviorLogs.recordDate))
  }

  private async assertStudentExists(tenantId: string, studentId: string): Promise<void> {
    const [row] = await db
      .select({ id: students.id })
      .from(students)
      .where(
        and(eq(students.id, studentId), eq(students.tenantId, tenantId), isNull(students.deletedAt))
      )
      .limit(1)

    if (!row) {
      throw new NotFoundException("Student not found")
    }
  }

  private buildAttendanceSummary(
    counts: Record<StudentAttendanceCalendarStatusView, number>
  ): readonly StudentAttendanceCalendarMonthSummaryView[] {
    return [
      { label: "Present", status: "present", value: counts.present },
      { label: "Late", status: "late", value: counts.late },
      { label: "Sick", status: "sick", value: counts.sick },
      { label: "Absent", status: "absent", value: counts.absent },
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

  private resolveSelectedDay(
    rows: ReadonlyArray<{ date: string; status: "absent" | "excused" | "late" | "present" }>
  ): number | null {
    const priorityStatuses = ["absent", "excused", "late", "present"] as const

    for (const status of priorityStatuses) {
      const match = rows.find((row) => row.status === status)

      if (match) {
        return Number(match.date.slice(-2))
      }
    }

    return null
  }

  private toAttendanceStatus(
    status: "absent" | "excused" | "late" | "present"
  ): StudentAttendanceCalendarStatusView {
    if (status === "excused") {
      return "sick"
    }

    return status
  }

  private toMonthKey(year: number, monthNumber: number): AttendanceMonthKey {
    return `${year}-${String(monthNumber).padStart(2, "0")}`
  }
}

function resolveAcademicPerformanceNote(averageScore: number): string {
  if (averageScore >= 95) {
    return "Student shows consistent excellence in studies and leadership across group work."
  }

  if (averageScore >= 80) {
    return "Student performance is stable with clear progress across recent assessments."
  }

  return "Student needs closer academic support to improve consistency across subjects."
}
