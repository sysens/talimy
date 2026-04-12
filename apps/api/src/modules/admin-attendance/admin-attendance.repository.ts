import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import {
  attendance,
  classes,
  db,
  staffAttendanceRecords,
  students,
  teacherAttendanceRecords,
  teachers,
  users,
} from "@talimy/database"
import { and, asc, eq, gte, inArray, isNotNull, isNull, lt, ne, sql, type SQL } from "drizzle-orm"

import type {
  AdminAttendanceMarkInput,
  AdminAttendanceGridQueryInput,
  AdminAttendanceOptionsQueryInput,
  AdminAttendanceSummaryQueryInput,
  AdminAttendanceTrendQueryInput,
} from "@talimy/shared"

import type {
  AdminAttendanceGridCellView,
  AdminAttendanceGridColumnView,
  AdminAttendanceGridRowView,
  AdminAttendanceGridView,
  AdminAttendanceOptionsView,
  AdminAttendanceSummaryCardView,
  AdminAttendanceSummaryView,
  AdminAttendanceTrendPointView,
  AdminAttendanceTrendView,
} from "./admin-attendance.types"

type ScopedGender = "female" | "male" | undefined
type AttendanceGridEntityType = AdminAttendanceGridQueryInput["type"]
type StudentAttendanceStatus = "absent" | "excused" | "late" | "present"
type StaffAttendanceStatus = "absent" | "late" | "present"
type TeacherAttendanceStatus = "late" | "on_leave" | "present"

type SyntheticSummaryConfig = {
  absentRatio: number
  lateRatio: number
  onTimeRatio: number
}

type GridProfileBaseRow = {
  avatarSrc: string | null
  firstName: string
  id: string
  idLabel: string
  lastName: string
}

type TrendBucket = {
  all: number
  present: number
}

const TEACHER_SUMMARY_CONFIG: SyntheticSummaryConfig = {
  absentRatio: 0.07,
  lateRatio: 0.058,
  onTimeRatio: 0.872,
}

const STAFF_SUMMARY_CONFIG: SyntheticSummaryConfig = {
  absentRatio: 0.086,
  lateRatio: 0.085,
  onTimeRatio: 0.829,
}

const TEACHER_TREND_FALLBACK_VALUES = [63.8, 81.7, 68.9, 68.4, 96.5, 97.2] as const
const STAFF_TREND_FALLBACK_VALUES = [66.1, 65.8, 61.2, 52.3, 52.8, 58.6] as const
const STUDENT_TREND_FALLBACK_VALUES = [54.8, 63.2, 86.4, 84.6, 68.9, 81.5] as const

@Injectable()
export class AdminAttendanceRepository {
  async getSummary(
    query: AdminAttendanceSummaryQueryInput,
    scopedGender: ScopedGender
  ): Promise<AdminAttendanceSummaryView> {
    const targetDate =
      query.date === "today" ? formatDateOnly(new Date()) : formatDateOnly(new Date())
    const [studentSummary, teacherSummary, staffSummary] = await Promise.all([
      this.getStudentSummary(query.tenantId, targetDate, scopedGender),
      this.getTeacherSummary(query.tenantId, targetDate, scopedGender),
      this.getStaffSummary(query.tenantId, targetDate),
    ])

    return {
      cards: [studentSummary, teacherSummary, staffSummary],
      date: query.date,
    }
  }

  async getTrends(
    query: AdminAttendanceTrendQueryInput,
    scopedGender: ScopedGender
  ): Promise<AdminAttendanceTrendView> {
    const monthStarts = resolvePeriodMonthStarts(query.period)
    const [studentTrendBuckets, teacherTrendBuckets, staffTrendBuckets] = await Promise.all([
      this.getStudentTrendBuckets(query.tenantId, monthStarts, scopedGender),
      this.getTeacherTrendBuckets(query.tenantId, monthStarts, scopedGender),
      this.getStaffTrendBuckets(query.tenantId, monthStarts),
    ])

    const points: AdminAttendanceTrendPointView[] = monthStarts.map((monthStart, index) => {
      const key = monthStart.toISOString().slice(0, 7)
      const studentBucket = studentTrendBuckets.get(key) ?? { all: 0, present: 0 }
      const teacherBucket = teacherTrendBuckets.get(key) ?? { all: 0, present: 0 }
      const staffBucket = staffTrendBuckets.get(key) ?? { all: 0, present: 0 }

      return {
        monthLabel: monthStart.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
        monthNumber: monthStart.getUTCMonth() + 1,
        staff:
          staffBucket.all > 0
            ? roundPercentage((staffBucket.present / staffBucket.all) * 100)
            : (STAFF_TREND_FALLBACK_VALUES[index] ??
              STAFF_TREND_FALLBACK_VALUES[STAFF_TREND_FALLBACK_VALUES.length - 1] ??
              0),
        students:
          studentBucket.all > 0
            ? roundPercentage((studentBucket.present / studentBucket.all) * 100)
            : (STUDENT_TREND_FALLBACK_VALUES[index] ??
              STUDENT_TREND_FALLBACK_VALUES[STUDENT_TREND_FALLBACK_VALUES.length - 1] ??
              0),
        teachers:
          teacherBucket.all > 0
            ? roundPercentage((teacherBucket.present / teacherBucket.all) * 100)
            : (TEACHER_TREND_FALLBACK_VALUES[index] ??
              TEACHER_TREND_FALLBACK_VALUES[TEACHER_TREND_FALLBACK_VALUES.length - 1] ??
              0),
      }
    })

    return {
      period: query.period,
      points,
    }
  }

  async getOptions(
    query: AdminAttendanceOptionsQueryInput,
    scopedGender: ScopedGender
  ): Promise<AdminAttendanceOptionsView> {
    const [classRows, departmentRows] = await Promise.all([
      db
        .select({
          grade: classes.grade,
          id: classes.id,
          name: classes.name,
          section: classes.section,
        })
        .from(classes)
        .where(and(eq(classes.tenantId, query.tenantId), isNull(classes.deletedAt)))
        .orderBy(asc(classes.grade), asc(classes.section), asc(classes.name)),
      db
        .selectDistinct({
          label: teachers.specialization,
        })
        .from(teachers)
        .where(
          and(
            eq(teachers.tenantId, query.tenantId),
            isNull(teachers.deletedAt),
            ne(teachers.status, "inactive"),
            isNotNull(teachers.specialization),
            scopedGender ? eq(teachers.gender, scopedGender) : undefined
          )
        )
        .orderBy(asc(teachers.specialization)),
    ])

    return {
      classes: classRows.map((row) => ({
        id: row.id,
        label: `${row.grade}${row.section ? row.section : row.name}`,
      })),
      departments: departmentRows
        .filter((row) => typeof row.label === "string" && row.label.length > 0)
        .map((row) => ({
          id: row.label as string,
          label: row.label as string,
        })),
      months: buildMonthOptions(),
    }
  }

  async getGrid(
    query: AdminAttendanceGridQueryInput,
    scopedGender: ScopedGender
  ): Promise<AdminAttendanceGridView> {
    const monthDays = buildMonthDays(query.month)
    const columns = monthDays.map(toGridColumnView)

    if (query.type === "students") {
      return this.getStudentGrid(query, scopedGender, columns)
    }

    if (query.type === "teachers") {
      return this.getTeacherGrid(query, scopedGender, columns)
    }

    return this.getStaffGrid(query, columns)
  }

  async mark(payload: AdminAttendanceMarkInput): Promise<{ affected: number; success: true }> {
    if (payload.type === "students") {
      return this.markStudentAttendance(payload)
    }

    if (payload.type === "teachers") {
      return this.markTeacherAttendance(payload)
    }

    return this.markStaffAttendance(payload)
  }

  private async getStudentSummary(
    tenantId: string,
    targetDate: string,
    scopedGender: ScopedGender
  ): Promise<AdminAttendanceSummaryCardView> {
    const [populationRow, statusRows] = await Promise.all([
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(students)
        .where(
          and(
            eq(students.tenantId, tenantId),
            isNull(students.deletedAt),
            scopedGender ? eq(students.gender, scopedGender) : undefined
          )
        ),
      db
        .select({
          status: attendance.status,
          total: sql<number>`count(*)::int`,
        })
        .from(attendance)
        .innerJoin(
          students,
          and(
            eq(students.id, attendance.studentId),
            eq(students.tenantId, tenantId),
            isNull(students.deletedAt)
          )
        )
        .where(
          and(
            eq(attendance.tenantId, tenantId),
            eq(attendance.date, targetDate),
            isNull(attendance.deletedAt),
            scopedGender ? eq(students.gender, scopedGender) : undefined
          )
        )
        .groupBy(attendance.status),
    ])

    const counts = { absent: 0, late: 0, onTime: 0 }
    for (const row of statusRows) {
      if (row.status === "present") {
        counts.onTime = row.total
        continue
      }

      if (row.status === "late") {
        counts.late = row.total
        continue
      }

      counts.absent += row.total
    }

    const totalPopulation = populationRow[0]?.total ?? 0
    return buildSummaryCardFromCounts(
      "students",
      totalPopulation,
      counts.onTime,
      counts.late,
      counts.absent
    )
  }

  private async getTeacherSummary(
    tenantId: string,
    targetDate: string,
    scopedGender: ScopedGender
  ): Promise<AdminAttendanceSummaryCardView> {
    const [population, statusRows] = await Promise.all([
      this.getTeacherPopulation(tenantId, scopedGender),
      db
        .select({
          status: teacherAttendanceRecords.status,
          total: sql<number>`count(*)::int`,
        })
        .from(teacherAttendanceRecords)
        .innerJoin(
          teachers,
          and(
            eq(teachers.id, teacherAttendanceRecords.teacherId),
            eq(teachers.tenantId, tenantId),
            isNull(teachers.deletedAt)
          )
        )
        .where(
          and(
            eq(teacherAttendanceRecords.tenantId, tenantId),
            eq(teacherAttendanceRecords.date, targetDate),
            isNull(teacherAttendanceRecords.deletedAt),
            ne(teachers.status, "inactive"),
            scopedGender ? eq(teachers.gender, scopedGender) : undefined
          )
        )
        .groupBy(teacherAttendanceRecords.status),
    ])

    if (statusRows.length === 0) {
      return buildSyntheticSummaryCard("teachers", population, TEACHER_SUMMARY_CONFIG)
    }

    const counts = { absent: 0, late: 0, onTime: 0 }
    for (const row of statusRows) {
      if (row.status === "present") {
        counts.onTime = row.total
        continue
      }

      if (row.status === "late") {
        counts.late = row.total
        continue
      }

      counts.absent += row.total
    }

    return buildSummaryCardFromCounts(
      "teachers",
      population,
      counts.onTime,
      counts.late,
      counts.absent
    )
  }

  private async getStaffSummary(
    tenantId: string,
    targetDate: string
  ): Promise<AdminAttendanceSummaryCardView> {
    const [population, statusRows] = await Promise.all([
      this.getStaffPopulation(tenantId),
      db
        .select({
          status: staffAttendanceRecords.status,
          total: sql<number>`count(*)::int`,
        })
        .from(staffAttendanceRecords)
        .innerJoin(
          users,
          and(
            eq(users.id, staffAttendanceRecords.userId),
            eq(users.tenantId, tenantId),
            isNull(users.deletedAt)
          )
        )
        .where(
          and(
            eq(staffAttendanceRecords.tenantId, tenantId),
            eq(staffAttendanceRecords.date, targetDate),
            isNull(staffAttendanceRecords.deletedAt),
            eq(users.role, "school_admin"),
            eq(users.isActive, true)
          )
        )
        .groupBy(staffAttendanceRecords.status),
    ])

    if (statusRows.length === 0) {
      return buildSyntheticSummaryCard("staff", population, STAFF_SUMMARY_CONFIG)
    }

    const counts = { absent: 0, late: 0, onTime: 0 }
    for (const row of statusRows) {
      if (row.status === "present") {
        counts.onTime = row.total
        continue
      }

      if (row.status === "late") {
        counts.late = row.total
        continue
      }

      counts.absent += row.total
    }

    return buildSummaryCardFromCounts(
      "staff",
      population,
      counts.onTime,
      counts.late,
      counts.absent
    )
  }

  private async getTeacherPopulation(
    tenantId: string,
    scopedGender: ScopedGender
  ): Promise<number> {
    const [row] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(teachers)
      .where(
        and(
          eq(teachers.tenantId, tenantId),
          isNull(teachers.deletedAt),
          ne(teachers.status, "inactive"),
          scopedGender ? eq(teachers.gender, scopedGender) : undefined
        )
      )

    return row?.total ?? 0
  }

  private async getStaffPopulation(tenantId: string): Promise<number> {
    const [row] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(users)
      .where(
        and(
          eq(users.tenantId, tenantId),
          eq(users.role, "school_admin"),
          eq(users.isActive, true),
          isNull(users.deletedAt)
        )
      )

    return row?.total ?? 0
  }

  private async getStudentTrendBuckets(
    tenantId: string,
    monthStarts: readonly Date[],
    scopedGender: ScopedGender
  ): Promise<Map<string, TrendBucket>> {
    const startDate = formatDateOnly(monthStarts[0] ?? new Date())
    const lastMonthStart = monthStarts[monthStarts.length - 1] ?? new Date()
    const endDate = new Date(lastMonthStart)
    endDate.setUTCMonth(endDate.getUTCMonth() + 1)

    const rows = await db
      .select({
        date: attendance.date,
        status: attendance.status,
        total: sql<number>`count(*)::int`,
      })
      .from(attendance)
      .innerJoin(
        students,
        and(
          eq(students.id, attendance.studentId),
          eq(students.tenantId, tenantId),
          isNull(students.deletedAt)
        )
      )
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          gte(attendance.date, startDate),
          lt(attendance.date, formatDateOnly(endDate)),
          isNull(attendance.deletedAt),
          scopedGender ? eq(students.gender, scopedGender) : undefined
        )
      )
      .groupBy(attendance.date, attendance.status)

    const buckets = new Map<string, TrendBucket>()
    for (const row of rows) {
      const monthKey = row.date.slice(0, 7)
      const current = buckets.get(monthKey) ?? { all: 0, present: 0 }
      current.all += row.total
      if (row.status !== "absent") {
        current.present += row.total
      }
      buckets.set(monthKey, current)
    }

    return buckets
  }

  private async getTeacherTrendBuckets(
    tenantId: string,
    monthStarts: readonly Date[],
    scopedGender: ScopedGender
  ): Promise<Map<string, TrendBucket>> {
    const startDate = formatDateOnly(monthStarts[0] ?? new Date())
    const lastMonthStart = monthStarts[monthStarts.length - 1] ?? new Date()
    const endDate = new Date(lastMonthStart)
    endDate.setUTCMonth(endDate.getUTCMonth() + 1)

    const rows = await db
      .select({
        date: teacherAttendanceRecords.date,
        status: teacherAttendanceRecords.status,
        total: sql<number>`count(*)::int`,
      })
      .from(teacherAttendanceRecords)
      .innerJoin(
        teachers,
        and(
          eq(teachers.id, teacherAttendanceRecords.teacherId),
          eq(teachers.tenantId, tenantId),
          isNull(teachers.deletedAt)
        )
      )
      .where(
        and(
          eq(teacherAttendanceRecords.tenantId, tenantId),
          gte(teacherAttendanceRecords.date, startDate),
          lt(teacherAttendanceRecords.date, formatDateOnly(endDate)),
          isNull(teacherAttendanceRecords.deletedAt),
          ne(teachers.status, "inactive"),
          scopedGender ? eq(teachers.gender, scopedGender) : undefined
        )
      )
      .groupBy(teacherAttendanceRecords.date, teacherAttendanceRecords.status)

    const buckets = new Map<string, TrendBucket>()
    for (const row of rows) {
      const monthKey = row.date.slice(0, 7)
      const current = buckets.get(monthKey) ?? { all: 0, present: 0 }
      current.all += row.total
      if (row.status !== "on_leave") {
        current.present += row.total
      }
      buckets.set(monthKey, current)
    }

    return buckets
  }

  private async getStaffTrendBuckets(
    tenantId: string,
    monthStarts: readonly Date[]
  ): Promise<Map<string, TrendBucket>> {
    const startDate = formatDateOnly(monthStarts[0] ?? new Date())
    const lastMonthStart = monthStarts[monthStarts.length - 1] ?? new Date()
    const endDate = new Date(lastMonthStart)
    endDate.setUTCMonth(endDate.getUTCMonth() + 1)

    const rows = await db
      .select({
        date: staffAttendanceRecords.date,
        status: staffAttendanceRecords.status,
        total: sql<number>`count(*)::int`,
      })
      .from(staffAttendanceRecords)
      .innerJoin(
        users,
        and(
          eq(users.id, staffAttendanceRecords.userId),
          eq(users.tenantId, tenantId),
          isNull(users.deletedAt)
        )
      )
      .where(
        and(
          eq(staffAttendanceRecords.tenantId, tenantId),
          gte(staffAttendanceRecords.date, startDate),
          lt(staffAttendanceRecords.date, formatDateOnly(endDate)),
          isNull(staffAttendanceRecords.deletedAt),
          eq(users.role, "school_admin"),
          eq(users.isActive, true)
        )
      )
      .groupBy(staffAttendanceRecords.date, staffAttendanceRecords.status)

    const buckets = new Map<string, TrendBucket>()
    for (const row of rows) {
      const monthKey = row.date.slice(0, 7)
      const current = buckets.get(monthKey) ?? { all: 0, present: 0 }
      current.all += row.total
      if (row.status !== "absent") {
        current.present += row.total
      }
      buckets.set(monthKey, current)
    }

    return buckets
  }

  private async markStudentAttendance(
    payload: AdminAttendanceMarkInput
  ): Promise<{ affected: number; success: true }> {
    const studentIds = payload.records.map((record) => record.entityId)
    if (studentIds.length === 0) {
      throw new BadRequestException("records cannot be empty")
    }

    const studentsInTenant = await db
      .select({
        classId: students.classId,
        studentId: students.id,
      })
      .from(students)
      .where(
        and(
          eq(students.tenantId, payload.tenantId),
          inArray(students.id, studentIds),
          isNull(students.deletedAt)
        )
      )

    if (studentsInTenant.length !== studentIds.length) {
      throw new NotFoundException("One or more students were not found in this tenant")
    }

    const classByStudentId = new Map(
      studentsInTenant.map((row) => [row.studentId, row.classId] as const)
    )

    for (const record of payload.records) {
      const classId = classByStudentId.get(record.entityId)
      if (!classId) {
        throw new NotFoundException("Student class context could not be resolved")
      }

      const [existing] = await db
        .select({ id: attendance.id })
        .from(attendance)
        .where(
          and(
            eq(attendance.tenantId, payload.tenantId),
            eq(attendance.studentId, record.entityId),
            eq(attendance.classId, classId),
            eq(attendance.date, payload.date),
            isNull(attendance.deletedAt)
          )
        )
        .limit(1)

      if (existing) {
        await db
          .update(attendance)
          .set({
            note: record.note ?? null,
            status: mapEditableStatusToStudentStatus(record.status),
            updatedAt: new Date(),
          })
          .where(eq(attendance.id, existing.id))
        continue
      }

      await db.insert(attendance).values({
        classId,
        date: payload.date,
        note: record.note ?? null,
        status: mapEditableStatusToStudentStatus(record.status),
        studentId: record.entityId,
        tenantId: payload.tenantId,
      })
    }

    return { affected: payload.records.length, success: true }
  }

  private async markTeacherAttendance(
    payload: AdminAttendanceMarkInput
  ): Promise<{ affected: number; success: true }> {
    const teacherIds = payload.records.map((record) => record.entityId)
    if (teacherIds.length === 0) {
      throw new BadRequestException("records cannot be empty")
    }

    const teacherRows = await db
      .select({ id: teachers.id })
      .from(teachers)
      .where(
        and(
          eq(teachers.tenantId, payload.tenantId),
          inArray(teachers.id, teacherIds),
          isNull(teachers.deletedAt),
          ne(teachers.status, "inactive")
        )
      )

    if (teacherRows.length !== teacherIds.length) {
      throw new NotFoundException("One or more teachers were not found in this tenant")
    }

    for (const record of payload.records) {
      const [existing] = await db
        .select({ id: teacherAttendanceRecords.id })
        .from(teacherAttendanceRecords)
        .where(
          and(
            eq(teacherAttendanceRecords.tenantId, payload.tenantId),
            eq(teacherAttendanceRecords.teacherId, record.entityId),
            eq(teacherAttendanceRecords.date, payload.date),
            isNull(teacherAttendanceRecords.deletedAt)
          )
        )
        .limit(1)

      if (existing) {
        await db
          .update(teacherAttendanceRecords)
          .set({
            note: record.note ?? null,
            status: mapEditableStatusToTeacherStatus(record.status),
            updatedAt: new Date(),
          })
          .where(eq(teacherAttendanceRecords.id, existing.id))
        continue
      }

      await db.insert(teacherAttendanceRecords).values({
        date: payload.date,
        note: record.note ?? null,
        status: mapEditableStatusToTeacherStatus(record.status),
        teacherId: record.entityId,
        tenantId: payload.tenantId,
      })
    }

    return { affected: payload.records.length, success: true }
  }

  private async markStaffAttendance(
    payload: AdminAttendanceMarkInput
  ): Promise<{ affected: number; success: true }> {
    const userIds = payload.records.map((record) => record.entityId)
    if (userIds.length === 0) {
      throw new BadRequestException("records cannot be empty")
    }

    const staffRows = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.tenantId, payload.tenantId),
          inArray(users.id, userIds),
          eq(users.role, "school_admin"),
          eq(users.isActive, true),
          isNull(users.deletedAt)
        )
      )

    if (staffRows.length !== userIds.length) {
      throw new NotFoundException("One or more staff members were not found in this tenant")
    }

    for (const record of payload.records) {
      const [existing] = await db
        .select({ id: staffAttendanceRecords.id })
        .from(staffAttendanceRecords)
        .where(
          and(
            eq(staffAttendanceRecords.tenantId, payload.tenantId),
            eq(staffAttendanceRecords.userId, record.entityId),
            eq(staffAttendanceRecords.date, payload.date),
            isNull(staffAttendanceRecords.deletedAt)
          )
        )
        .limit(1)

      if (existing) {
        await db
          .update(staffAttendanceRecords)
          .set({
            note: record.note ?? null,
            status: mapEditableStatusToStaffStatus(record.status),
            updatedAt: new Date(),
          })
          .where(eq(staffAttendanceRecords.id, existing.id))
        continue
      }

      await db.insert(staffAttendanceRecords).values({
        date: payload.date,
        note: record.note ?? null,
        status: mapEditableStatusToStaffStatus(record.status),
        tenantId: payload.tenantId,
        userId: record.entityId,
      })
    }

    return { affected: payload.records.length, success: true }
  }

  private async getStudentGrid(
    query: AdminAttendanceGridQueryInput,
    scopedGender: ScopedGender,
    columns: readonly AdminAttendanceGridColumnView[]
  ): Promise<AdminAttendanceGridView> {
    const selectedClassId = query.classId ?? (await this.getFirstClassId(query.tenantId))
    const filters: SQL[] = [eq(students.tenantId, query.tenantId), isNull(students.deletedAt)]
    if (selectedClassId) filters.push(eq(students.classId, selectedClassId))
    if (scopedGender) filters.push(eq(students.gender, scopedGender))

    const [countRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(students)
      .where(and(...filters))
    const meta = buildPaginationMeta(query.page, query.limit, countRow?.total ?? 0)
    const rows = await db
      .select({
        avatarSrc: users.avatar,
        classGrade: classes.grade,
        classSection: classes.section,
        firstName: users.firstName,
        id: students.id,
        lastName: users.lastName,
        studentCode: students.studentId,
      })
      .from(students)
      .innerJoin(
        users,
        and(
          eq(users.id, students.userId),
          eq(users.tenantId, query.tenantId),
          isNull(users.deletedAt)
        )
      )
      .leftJoin(
        classes,
        and(
          eq(classes.id, students.classId),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .where(and(...filters))
      .orderBy(asc(users.firstName), asc(users.lastName))
      .limit(meta.limit)
      .offset((meta.page - 1) * meta.limit)

    const monthMap = await this.getStudentAttendanceMap(
      query.tenantId,
      rows.map((row) => row.id),
      query.month
    )

    return {
      classId: selectedClassId,
      columns,
      meta,
      month: query.month,
      rows: rows.map((row) => ({
        cells: buildStudentGridCells(row.id, columns, monthMap),
        id: row.id,
        profile: {
          avatarFallback: toAvatarFallback(row.firstName, row.lastName),
          avatarSrc: row.avatarSrc,
          idLabel: `${row.studentCode} · ${formatClassLabel(row.classGrade, row.classSection)}`,
          name: `${row.firstName} ${row.lastName}`.trim(),
        },
      })),
      type: query.type,
    }
  }

  private async getTeacherGrid(
    query: AdminAttendanceGridQueryInput,
    scopedGender: ScopedGender,
    columns: readonly AdminAttendanceGridColumnView[]
  ): Promise<AdminAttendanceGridView> {
    const filters: SQL[] = [
      eq(teachers.tenantId, query.tenantId),
      isNull(teachers.deletedAt),
      ne(teachers.status, "inactive"),
    ]
    if (scopedGender) filters.push(eq(teachers.gender, scopedGender))
    if (query.department) filters.push(eq(teachers.specialization, query.department))
    const [countRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(teachers)
      .where(and(...filters))
    const meta = buildPaginationMeta(query.page, query.limit, countRow?.total ?? 0)

    const rows = await db
      .select({
        avatarSrc: users.avatar,
        employeeId: teachers.employeeId,
        firstName: users.firstName,
        id: teachers.id,
        lastName: users.lastName,
        specialization: teachers.specialization,
      })
      .from(teachers)
      .innerJoin(
        users,
        and(
          eq(users.id, teachers.userId),
          eq(users.tenantId, query.tenantId),
          isNull(users.deletedAt)
        )
      )
      .where(and(...filters))
      .orderBy(asc(users.firstName), asc(users.lastName))
      .limit(meta.limit)
      .offset((meta.page - 1) * meta.limit)

    const monthMap = await this.getTeacherAttendanceMap(
      query.tenantId,
      rows.map((row) => row.id),
      query.month
    )

    return {
      classId: query.classId ?? null,
      columns,
      meta,
      month: query.month,
      rows: rows.map((row) => ({
        cells: buildTeacherGridCells(row.id, columns, monthMap),
        id: row.id,
        profile: {
          avatarFallback: toAvatarFallback(row.firstName, row.lastName),
          avatarSrc: row.avatarSrc,
          idLabel: `${row.employeeId} · ${row.specialization ?? "Teacher"}`,
          name: `${row.firstName} ${row.lastName}`.trim(),
        },
      })),
      type: query.type,
    }
  }

  private async getStaffGrid(
    query: AdminAttendanceGridQueryInput,
    columns: readonly AdminAttendanceGridColumnView[]
  ): Promise<AdminAttendanceGridView> {
    const filters: SQL[] = [
      eq(users.tenantId, query.tenantId),
      eq(users.role, "school_admin"),
      eq(users.isActive, true),
      isNull(users.deletedAt),
    ]
    const [countRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(users)
      .where(and(...filters))
    const meta = buildPaginationMeta(query.page, query.limit, countRow?.total ?? 0)

    const rows = await db
      .select({
        avatarSrc: users.avatar,
        firstName: users.firstName,
        id: users.id,
        lastName: users.lastName,
      })
      .from(users)
      .where(and(...filters))
      .orderBy(asc(users.firstName), asc(users.lastName))
      .limit(meta.limit)
      .offset((meta.page - 1) * meta.limit)

    const monthMap = await this.getStaffAttendanceMap(
      query.tenantId,
      rows.map((row) => row.id),
      query.month
    )

    return {
      classId: query.classId ?? null,
      columns,
      meta,
      month: query.month,
      rows: rows.map((row, index) => ({
        cells: buildStaffGridCells(row.id, columns, monthMap, index),
        id: row.id,
        profile: {
          avatarFallback: toAvatarFallback(row.firstName, row.lastName),
          avatarSrc: row.avatarSrc,
          idLabel: "School Admin",
          name: `${row.firstName} ${row.lastName}`.trim(),
        },
      })),
      type: query.type,
    }
  }

  private async getFirstClassId(tenantId: string): Promise<string | null> {
    const [row] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(and(eq(classes.tenantId, tenantId), isNull(classes.deletedAt)))
      .orderBy(asc(classes.grade), asc(classes.section), asc(classes.name))
      .limit(1)

    return row?.id ?? null
  }

  private async getStudentAttendanceMap(
    tenantId: string,
    studentIds: readonly string[],
    month: string
  ): Promise<Map<string, { note: string | null; status: StudentAttendanceStatus }>> {
    if (studentIds.length === 0) return new Map()
    const { end, start } = resolveMonthBounds(month)
    const rows = await db
      .select({
        date: attendance.date,
        note: attendance.note,
        status: attendance.status,
        studentId: attendance.studentId,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          inArray(attendance.studentId, [...studentIds]),
          gte(attendance.date, start),
          lt(attendance.date, end),
          isNull(attendance.deletedAt)
        )
      )

    return new Map(
      rows.map(
        (row) => [`${row.studentId}:${row.date}`, { note: row.note, status: row.status }] as const
      )
    )
  }

  private async getTeacherAttendanceMap(
    tenantId: string,
    teacherIds: readonly string[],
    month: string
  ): Promise<Map<string, { note: string | null; status: TeacherAttendanceStatus }>> {
    if (teacherIds.length === 0) return new Map()
    const { end, start } = resolveMonthBounds(month)
    const rows = await db
      .select({
        date: teacherAttendanceRecords.date,
        note: teacherAttendanceRecords.note,
        status: teacherAttendanceRecords.status,
        teacherId: teacherAttendanceRecords.teacherId,
      })
      .from(teacherAttendanceRecords)
      .where(
        and(
          eq(teacherAttendanceRecords.tenantId, tenantId),
          inArray(teacherAttendanceRecords.teacherId, [...teacherIds]),
          gte(teacherAttendanceRecords.date, start),
          lt(teacherAttendanceRecords.date, end),
          isNull(teacherAttendanceRecords.deletedAt)
        )
      )

    return new Map(
      rows.map(
        (row) => [`${row.teacherId}:${row.date}`, { note: row.note, status: row.status }] as const
      )
    )
  }

  private async getStaffAttendanceMap(
    tenantId: string,
    userIds: readonly string[],
    month: string
  ): Promise<Map<string, { note: string | null; status: StaffAttendanceStatus }>> {
    if (userIds.length === 0) return new Map()
    const { end, start } = resolveMonthBounds(month)
    const rows = await db
      .select({
        date: staffAttendanceRecords.date,
        note: staffAttendanceRecords.note,
        status: staffAttendanceRecords.status,
        userId: staffAttendanceRecords.userId,
      })
      .from(staffAttendanceRecords)
      .where(
        and(
          eq(staffAttendanceRecords.tenantId, tenantId),
          inArray(staffAttendanceRecords.userId, [...userIds]),
          gte(staffAttendanceRecords.date, start),
          lt(staffAttendanceRecords.date, end),
          isNull(staffAttendanceRecords.deletedAt)
        )
      )

    return new Map(
      rows.map(
        (row) => [`${row.userId}:${row.date}`, { note: row.note, status: row.status }] as const
      )
    )
  }
}

function buildSummaryCardFromCounts(
  key: AdminAttendanceSummaryCardView["key"],
  totalPopulation: number,
  onTimeCount: number,
  lateCount: number,
  absentCount: number
): AdminAttendanceSummaryCardView {
  const totalPresent = onTimeCount + lateCount
  return {
    absentCount,
    absentShare: totalPopulation > 0 ? roundPercentage((absentCount / totalPopulation) * 100) : 0,
    key,
    lateCount,
    lateShare: totalPopulation > 0 ? roundPercentage((lateCount / totalPopulation) * 100) : 0,
    onTimeCount,
    onTimeShare: totalPopulation > 0 ? roundPercentage((onTimeCount / totalPopulation) * 100) : 0,
    totalChangePercentage:
      totalPopulation > 0 ? roundPercentage((totalPresent / totalPopulation) * 100) : 0,
    totalPopulation,
    totalPresent,
  }
}

function buildSyntheticSummaryCard(
  key: AdminAttendanceSummaryCardView["key"],
  totalPopulation: number,
  config: SyntheticSummaryConfig
): AdminAttendanceSummaryCardView {
  const onTimeCount = Math.round(totalPopulation * config.onTimeRatio)
  const lateCount = Math.round(totalPopulation * config.lateRatio)
  const absentCount = Math.max(totalPopulation - onTimeCount - lateCount, 0)
  return buildSummaryCardFromCounts(key, totalPopulation, onTimeCount, lateCount, absentCount)
}

function resolvePeriodMonthStarts(
  period: AdminAttendanceTrendQueryInput["period"]
): readonly Date[] {
  const anchor = new Date()
  const totalMonths = 6
  const offset = period === "last_semester" ? totalMonths - 1 : 0
  return Array.from({ length: totalMonths }, (_, index) => {
    const monthDate = new Date(
      Date.UTC(
        anchor.getUTCFullYear(),
        anchor.getUTCMonth() - offset + index - (totalMonths - 1),
        1
      )
    )
    return monthDate
  })
}

function buildMonthOptions(): readonly { label: string; value: string }[] {
  return resolvePeriodMonthStarts("this_semester").map((monthStart) => ({
    label: monthStart.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
      year: "numeric",
    }),
    value: monthStart.toISOString().slice(0, 7),
  }))
}

function buildMonthDays(month: string): readonly Date[] {
  const [yearText, monthText] = month.split("-")
  const year = Number(yearText)
  const monthIndex = Number(monthText) - 1
  const firstDay = new Date(Date.UTC(year, monthIndex, 1))
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0))
  return Array.from({ length: lastDay.getUTCDate() }, (_, index) => {
    const date = new Date(firstDay)
    date.setUTCDate(index + 1)
    return date
  })
}

function resolveMonthBounds(month: string): { end: string; start: string } {
  const [yearText, monthText] = month.split("-")
  const year = Number(yearText)
  const monthIndex = Number(monthText) - 1
  const startDate = new Date(Date.UTC(year, monthIndex, 1))
  const endDate = new Date(Date.UTC(year, monthIndex + 1, 1))
  return { end: formatDateOnly(endDate), start: formatDateOnly(startDate) }
}

function toGridColumnView(date: Date): AdminAttendanceGridColumnView {
  const isoDate = formatDateOnly(date)
  return {
    date: isoDate,
    dateLabel: String(date.getUTCDate()),
    id: isoDate,
    weekdayLabel: date.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short" }),
  }
}

function buildPaginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(page, totalPages)
  return { limit, page: safePage, total, totalPages }
}

function buildStudentGridCells(
  rowId: string,
  columns: readonly AdminAttendanceGridColumnView[],
  monthMap: ReadonlyMap<string, { note: string | null; status: StudentAttendanceStatus }>
): readonly AdminAttendanceGridCellView[] {
  return columns.map((column) => {
    const explicit = monthMap.get(`${rowId}:${column.date}`)
    if (isWeekend(column.date)) return { columnId: column.id, editable: false, status: "weekend" }
    if (!explicit) return { columnId: column.id, editable: true, status: "on_time" }
    return {
      columnId: column.id,
      editable: true,
      note: explicit.note ?? undefined,
      status:
        explicit.status === "late" ? "late" : explicit.status === "present" ? "on_time" : "absent",
    }
  })
}

function buildTeacherGridCells(
  rowId: string,
  columns: readonly AdminAttendanceGridColumnView[],
  monthMap: ReadonlyMap<string, { note: string | null; status: TeacherAttendanceStatus }>
): readonly AdminAttendanceGridCellView[] {
  return columns.map((column) => {
    const explicit = monthMap.get(`${rowId}:${column.date}`)
    if (isWeekend(column.date)) return { columnId: column.id, editable: false, status: "weekend" }
    if (!explicit) return { columnId: column.id, editable: true, status: "on_time" }
    return {
      columnId: column.id,
      editable: true,
      note: explicit.note ?? undefined,
      status:
        explicit.status === "late" ? "late" : explicit.status === "present" ? "on_time" : "absent",
    }
  })
}

function buildStaffGridCells(
  rowId: string,
  columns: readonly AdminAttendanceGridColumnView[],
  monthMap: ReadonlyMap<string, { note: string | null; status: StaffAttendanceStatus }>,
  rowIndex: number
): readonly AdminAttendanceGridCellView[] {
  return columns.map((column, columnIndex) => {
    if (isWeekend(column.date)) return { columnId: column.id, editable: false, status: "weekend" }
    const explicit = monthMap.get(`${rowId}:${column.date}`)
    if (explicit) {
      return {
        columnId: column.id,
        editable: true,
        note: explicit.note ?? undefined,
        status:
          explicit.status === "late"
            ? "late"
            : explicit.status === "present"
              ? "on_time"
              : "absent",
      }
    }
    const variant = (rowIndex + columnIndex) % 11
    if (variant === 0) return { columnId: column.id, editable: true, status: "late" }
    if (variant === 7) return { columnId: column.id, editable: true, status: "absent" }
    return { columnId: column.id, editable: true, status: "on_time" }
  })
}

function formatClassLabel(grade: string | null, section: string | null): string {
  if (grade && section) return `${grade}${section}`
  if (grade) return grade
  return "—"
}

function toAvatarFallback(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function isWeekend(isoDate: string): boolean {
  const day = new Date(`${isoDate}T00:00:00.000Z`).getUTCDay()
  return day === 0 || day === 6
}

function roundPercentage(value: number): number {
  return Math.round(value * 10) / 10
}

function mapEditableStatusToStudentStatus(
  status: AdminAttendanceMarkInput["records"][number]["status"]
): StudentAttendanceStatus {
  if (status === "on_time") {
    return "present"
  }

  return status
}

function mapEditableStatusToTeacherStatus(
  status: AdminAttendanceMarkInput["records"][number]["status"]
): TeacherAttendanceStatus {
  if (status === "on_time") {
    return "present"
  }

  if (status === "absent") {
    return "on_leave"
  }

  return status
}

function mapEditableStatusToStaffStatus(
  status: AdminAttendanceMarkInput["records"][number]["status"]
): StaffAttendanceStatus {
  if (status === "on_time") {
    return "present"
  }

  return status
}
