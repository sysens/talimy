import {
  classes,
  db,
  schedules,
  subjects,
  teacherClassAssignments,
  teacherSubjectAssignments,
  teachers,
  users,
} from "@talimy/database"
import { and, asc, desc, eq, ilike, inArray, isNull, ne, or, type SQL, sql } from "drizzle-orm"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"

import { ListTeachersQueryDto } from "./dto/list-teachers-query.dto"
import { UpdateTeacherDto } from "./dto/update-teacher.dto"
import { toTeacherView } from "./teachers.mapper"
import type { TeacherScheduleItem, TeacherView } from "./teachers.types"

const TEACHER_DEPARTMENT_SPECIALIZATION_MAP = {
  arts: "Arts",
  language: "Language",
  mathematics: "Mathematics",
  physicalEducation: "Physical Education",
  science: "Science",
  social: "Social",
} as const
type TeacherDepartmentKey = keyof typeof TEACHER_DEPARTMENT_SPECIALIZATION_MAP | "other"

@Injectable()
export class TeachersRepository {
  async list(query: ListTeachersQueryDto): Promise<{
    data: TeacherView[]
    meta: { page: number; limit: number; total: number; totalPages: number }
  }> {
    const filters: SQL[] = [eq(teachers.tenantId, query.tenantId), isNull(teachers.deletedAt)]
    const genderFilters = query.gender ?? []
    const statusFilters = query.status ?? []
    const departmentFilters = query.departmentId ?? []

    if (genderFilters.length > 0) {
      filters.push(inArray(teachers.gender, genderFilters))
    }
    if (statusFilters.length > 0) {
      filters.push(inArray(teachers.status, statusFilters))
    }
    if (departmentFilters.length > 0) {
      const departmentConditions: SQL[] = []

      for (const departmentKey of departmentFilters as TeacherDepartmentKey[]) {
        if (departmentKey === "other") {
          departmentConditions.push(isNull(teachers.specialization))
          continue
        }

        departmentConditions.push(
          eq(teachers.specialization, TEACHER_DEPARTMENT_SPECIALIZATION_MAP[departmentKey])
        )
      }

      if (departmentConditions.length > 0) {
        filters.push(or(...departmentConditions)!)
      }
    }
    if (query.search) {
      const search = query.search.trim()
      if (search.length > 0) {
        filters.push(
          or(
            ilike(teachers.employeeId, `%${search}%`),
            ilike(users.firstName, `%${search}%`),
            ilike(users.lastName, `%${search}%`),
            ilike(users.email, `%${search}%`)
          )!
        )
      }
    }

    const whereExpr = and(...filters)
    const totalRows = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(teachers)
      .innerJoin(users, eq(users.id, teachers.userId))
      .where(whereExpr)
    const total = totalRows[0]?.total ?? 0

    const totalPages = Math.max(1, Math.ceil(total / query.limit))
    const page = Math.min(query.page, totalPages)
    const offset = (page - 1) * query.limit
    const orderExpressions = this.resolveSortOrder(query.sort, query.order)

    const rows = await db
      .select({ teacher: teachers, user: users })
      .from(teachers)
      .innerJoin(users, eq(users.id, teachers.userId))
      .where(whereExpr)
      .orderBy(...orderExpressions)
      .limit(query.limit)
      .offset(offset)

    return {
      data: rows.map((row) => toTeacherView(row.teacher, row.user)),
      meta: { page, limit: query.limit, total, totalPages },
    }
  }

  async getById(tenantId: string, id: string): Promise<TeacherView> {
    const row = await this.findTeacherRowOrThrow(tenantId, id)
    return toTeacherView(row.teacher, row.user)
  }

  async update(tenantId: string, id: string, payload: UpdateTeacherDto): Promise<TeacherView> {
    const current = await this.findTeacherRowOrThrow(tenantId, id)
    if (payload.employeeId && payload.employeeId !== current.teacher.employeeId) {
      await this.assertUniqueEmployeeId(tenantId, payload.employeeId, id)
    }

    const updatePayload: Partial<typeof teachers.$inferInsert> = { updatedAt: new Date() }
    if (payload.employeeId) updatePayload.employeeId = payload.employeeId
    if (payload.gender) updatePayload.gender = payload.gender
    if (payload.employmentType) updatePayload.employmentType = payload.employmentType
    if (payload.joinDate) updatePayload.joinDate = payload.joinDate
    if (typeof payload.dateOfBirth !== "undefined") updatePayload.dateOfBirth = payload.dateOfBirth
    if (typeof payload.qualification !== "undefined")
      updatePayload.qualification = payload.qualification
    if (typeof payload.specialization !== "undefined")
      updatePayload.specialization = payload.specialization
    if (typeof payload.salary === "number") updatePayload.salary = String(payload.salary)
    if (payload.status) updatePayload.status = payload.status

    const [updated] = await db
      .update(teachers)
      .set(updatePayload)
      .where(and(eq(teachers.id, id), eq(teachers.tenantId, tenantId), isNull(teachers.deletedAt)))
      .returning()
    if (!updated) throw new NotFoundException("Teacher not found")
    return toTeacherView(updated, current.user)
  }

  async delete(tenantId: string, id: string): Promise<{ success: true }> {
    await this.findTeacherRowOrThrow(tenantId, id)
    await db
      .update(teachers)
      .set({ status: "inactive", deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(teachers.id, id), eq(teachers.tenantId, tenantId), isNull(teachers.deletedAt)))
    return { success: true }
  }

  async getSchedule(tenantId: string, id: string): Promise<TeacherScheduleItem[]> {
    await this.findTeacherRowOrThrow(tenantId, id)
    return db
      .select({
        id: schedules.id,
        classId: classes.id,
        className: classes.name,
        subjectId: subjects.id,
        subjectName: subjects.name,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        room: schedules.room,
      })
      .from(schedules)
      .innerJoin(classes, eq(classes.id, schedules.classId))
      .innerJoin(subjects, eq(subjects.id, schedules.subjectId))
      .where(
        and(
          eq(schedules.tenantId, tenantId),
          eq(schedules.teacherId, id),
          isNull(schedules.deletedAt),
          isNull(classes.deletedAt),
          isNull(subjects.deletedAt)
        )
      )
      .orderBy(asc(schedules.dayOfWeek), asc(schedules.startTime))
  }

  async getClasses(tenantId: string, id: string): Promise<Array<{ id: string; name: string }>> {
    await this.findTeacherRowOrThrow(tenantId, id)

    const [scheduleClasses, assignedClasses] = await Promise.all([
      db
        .select({ id: classes.id, name: classes.name })
        .from(schedules)
        .innerJoin(classes, eq(classes.id, schedules.classId))
        .where(
          and(
            eq(schedules.tenantId, tenantId),
            eq(schedules.teacherId, id),
            isNull(schedules.deletedAt),
            isNull(classes.deletedAt)
          )
        )
        .groupBy(classes.id, classes.name)
        .orderBy(asc(classes.name)),
      db
        .select({ id: classes.id, name: classes.name })
        .from(teacherClassAssignments)
        .innerJoin(classes, eq(classes.id, teacherClassAssignments.classId))
        .where(
          and(
            eq(teacherClassAssignments.tenantId, tenantId),
            eq(teacherClassAssignments.teacherId, id),
            isNull(teacherClassAssignments.deletedAt),
            isNull(classes.deletedAt)
          )
        )
        .groupBy(classes.id, classes.name)
        .orderBy(asc(classes.name)),
    ])

    return this.mergeNamedItems(scheduleClasses, assignedClasses)
  }

  async getSubjects(tenantId: string, id: string): Promise<Array<{ id: string; name: string }>> {
    await this.findTeacherRowOrThrow(tenantId, id)

    const [scheduledSubjects, assignedSubjects] = await Promise.all([
      db
        .select({ id: subjects.id, name: subjects.name })
        .from(schedules)
        .innerJoin(subjects, eq(subjects.id, schedules.subjectId))
        .where(
          and(
            eq(schedules.tenantId, tenantId),
            eq(schedules.teacherId, id),
            isNull(schedules.deletedAt),
            isNull(subjects.deletedAt)
          )
        )
        .groupBy(subjects.id, subjects.name)
        .orderBy(asc(subjects.name)),
      db
        .select({ id: subjects.id, name: subjects.name })
        .from(teacherSubjectAssignments)
        .innerJoin(subjects, eq(subjects.id, teacherSubjectAssignments.subjectId))
        .where(
          and(
            eq(teacherSubjectAssignments.tenantId, tenantId),
            eq(teacherSubjectAssignments.teacherId, id),
            isNull(teacherSubjectAssignments.deletedAt),
            isNull(subjects.deletedAt)
          )
        )
        .groupBy(subjects.id, subjects.name)
        .orderBy(asc(subjects.name)),
    ])

    return this.mergeNamedItems(scheduledSubjects, assignedSubjects)
  }

  private async findTeacherRowOrThrow(
    tenantId: string,
    teacherId: string
  ): Promise<{ teacher: typeof teachers.$inferSelect; user: typeof users.$inferSelect }> {
    const [row] = await db
      .select({ teacher: teachers, user: users })
      .from(teachers)
      .innerJoin(users, eq(users.id, teachers.userId))
      .where(
        and(eq(teachers.id, teacherId), eq(teachers.tenantId, tenantId), isNull(teachers.deletedAt))
      )
      .limit(1)
    if (!row) throw new NotFoundException("Teacher not found")
    return row
  }

  private async assertUniqueEmployeeId(
    tenantId: string,
    employeeId: string,
    ignoreTeacherId?: string
  ): Promise<void> {
    const filters: SQL[] = [
      eq(teachers.tenantId, tenantId),
      eq(teachers.employeeId, employeeId),
      isNull(teachers.deletedAt),
    ]
    if (ignoreTeacherId) filters.push(ne(teachers.id, ignoreTeacherId))
    const [existing] = await db
      .select({ id: teachers.id })
      .from(teachers)
      .where(and(...filters))
      .limit(1)
    if (existing) throw new BadRequestException("Employee ID already exists")
  }

  private resolveSortOrder(sort: string | undefined, order: "asc" | "desc") {
    switch (sort) {
      case "employeeId":
        return [order === "asc" ? asc(teachers.employeeId) : desc(teachers.employeeId)]
      case "fullName":
        return [
          order === "asc" ? asc(users.firstName) : desc(users.firstName),
          order === "asc" ? asc(users.lastName) : desc(users.lastName),
        ]
      case "gender":
        return [order === "asc" ? asc(teachers.gender) : desc(teachers.gender)]
      case "status":
        return [order === "asc" ? asc(teachers.status) : desc(teachers.status)]
      case "joinDate":
        return [order === "asc" ? asc(teachers.joinDate) : desc(teachers.joinDate)]
      case "updatedAt":
        return [order === "asc" ? asc(teachers.updatedAt) : desc(teachers.updatedAt)]
      case "createdAt":
      default:
        return [order === "asc" ? asc(teachers.createdAt) : desc(teachers.createdAt)]
    }
  }

  private mergeNamedItems(
    first: ReadonlyArray<{ id: string; name: string }>,
    second: ReadonlyArray<{ id: string; name: string }>
  ): Array<{ id: string; name: string }> {
    const itemsById = new Map<string, { id: string; name: string }>()

    for (const item of [...first, ...second]) {
      itemsById.set(item.id, item)
    }

    return [...itemsById.values()].sort((left, right) => left.name.localeCompare(right.name))
  }
}
