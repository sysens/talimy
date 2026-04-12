import {
  attendance,
  classes,
  db,
  grades,
  parentStudent,
  parents,
  students,
  subjects,
  users,
} from "@talimy/database"
import { and, asc, desc, eq, isNull, ne, type SQL } from "drizzle-orm"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"

import { UpdateStudentDto } from "./dto/update-student.dto"
import { toStudentGradeItem, toStudentParentItem, toStudentView } from "./students.mapper"
import type {
  StudentAttendanceItem,
  StudentGradeItem,
  StudentParentItem,
  StudentView,
} from "./students.types"

@Injectable()
export class StudentsRepository {
  async getById(tenantId: string, id: string): Promise<StudentView> {
    const row = await this.findStudentRowOrThrow(tenantId, id)
    return toStudentView(row.student, row.user, row.class)
  }

  async update(tenantId: string, id: string, payload: UpdateStudentDto): Promise<StudentView> {
    const current = await this.findStudentRowOrThrow(tenantId, id)
    if (payload.studentId && payload.studentId !== current.student.studentId) {
      await this.assertUniqueStudentCode(tenantId, payload.studentId, id)
    }
    if (payload.classId) await this.assertClassInTenant(tenantId, payload.classId)

    const updatePayload: Partial<typeof students.$inferInsert> = { updatedAt: new Date() }
    if (payload.studentId) updatePayload.studentId = payload.studentId
    if (typeof payload.classId !== "undefined") updatePayload.classId = payload.classId
    if (payload.gender) updatePayload.gender = payload.gender
    if (typeof payload.dateOfBirth !== "undefined") updatePayload.dateOfBirth = payload.dateOfBirth
    if (payload.enrollmentDate) updatePayload.enrollmentDate = payload.enrollmentDate
    if (payload.status) updatePayload.status = payload.status
    if (typeof payload.bloodGroup !== "undefined") updatePayload.bloodGroup = payload.bloodGroup
    if (typeof payload.address !== "undefined") updatePayload.address = payload.address

    const [updated] = await db
      .update(students)
      .set(updatePayload)
      .where(and(eq(students.id, id), eq(students.tenantId, tenantId), isNull(students.deletedAt)))
      .returning()
    if (!updated) throw new NotFoundException("Student not found")

    const classRow = updated.classId ? await this.findClassOptional(updated.classId) : null
    return toStudentView(updated, current.user, classRow)
  }

  async delete(tenantId: string, id: string): Promise<{ success: true }> {
    await this.findStudentRowOrThrow(tenantId, id)
    await db
      .update(students)
      .set({ status: "inactive", deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(students.id, id), eq(students.tenantId, tenantId), isNull(students.deletedAt)))
    return { success: true }
  }

  async getGrades(tenantId: string, id: string): Promise<StudentGradeItem[]> {
    await this.findStudentRowOrThrow(tenantId, id)
    const rows = await db
      .select({
        id: grades.id,
        subject: subjects.name,
        score: grades.score,
        grade: grades.grade,
        comment: grades.comment,
      })
      .from(grades)
      .innerJoin(subjects, eq(subjects.id, grades.subjectId))
      .where(and(eq(grades.tenantId, tenantId), eq(grades.studentId, id), isNull(grades.deletedAt)))
      .orderBy(desc(grades.createdAt))
    return rows.map(toStudentGradeItem)
  }

  async getAttendance(tenantId: string, id: string): Promise<StudentAttendanceItem[]> {
    await this.findStudentRowOrThrow(tenantId, id)
    return db
      .select({
        id: attendance.id,
        date: attendance.date,
        status: attendance.status,
        note: attendance.note,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          eq(attendance.studentId, id),
          isNull(attendance.deletedAt)
        )
      )
      .orderBy(desc(attendance.date))
  }

  async getParents(tenantId: string, id: string): Promise<StudentParentItem[]> {
    await this.findStudentRowOrThrow(tenantId, id)
    const rows = await db
      .select({
        id: parents.id,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: parents.phone,
        relationship: parents.relationship,
      })
      .from(parentStudent)
      .innerJoin(parents, eq(parents.id, parentStudent.parentId))
      .innerJoin(users, eq(users.id, parents.userId))
      .where(
        and(
          eq(parentStudent.tenantId, tenantId),
          eq(parentStudent.studentId, id),
          isNull(parentStudent.deletedAt),
          isNull(parents.deletedAt),
          isNull(users.deletedAt)
        )
      )
      .orderBy(asc(users.firstName), asc(users.lastName))
    return rows.map(toStudentParentItem)
  }

  async findStudentRowOrThrow(
    tenantId: string,
    studentId: string
  ): Promise<{
    student: typeof students.$inferSelect
    user: typeof users.$inferSelect
    class: typeof classes.$inferSelect | null
  }> {
    const [row] = await db
      .select({ student: students, user: users, class: classes })
      .from(students)
      .innerJoin(users, eq(users.id, students.userId))
      .leftJoin(classes, eq(classes.id, students.classId))
      .where(
        and(eq(students.id, studentId), eq(students.tenantId, tenantId), isNull(students.deletedAt))
      )
      .limit(1)
    if (!row) throw new NotFoundException("Student not found")
    return row
  }

  async assertClassInTenant(tenantId: string, classId: string): Promise<void> {
    const [row] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(
        and(eq(classes.id, classId), eq(classes.tenantId, tenantId), isNull(classes.deletedAt))
      )
      .limit(1)
    if (!row) throw new BadRequestException("Class not found in tenant")
  }

  private async findClassOptional(classId: string): Promise<typeof classes.$inferSelect | null> {
    const [row] = await db
      .select()
      .from(classes)
      .where(and(eq(classes.id, classId), isNull(classes.deletedAt)))
      .limit(1)
    return row ?? null
  }

  private async assertUniqueStudentCode(
    tenantId: string,
    studentCode: string,
    ignoreStudentId?: string
  ): Promise<void> {
    const filters: SQL[] = [
      eq(students.tenantId, tenantId),
      eq(students.studentId, studentCode),
      isNull(students.deletedAt),
    ]
    if (ignoreStudentId) filters.push(ne(students.id, ignoreStudentId))
    const [row] = await db
      .select({ id: students.id })
      .from(students)
      .where(and(...filters))
      .limit(1)
    if (row) throw new BadRequestException("Student ID already exists")
  }
}
