import { randomBytes } from "node:crypto"

import bcrypt from "bcrypt"
import {
  classes,
  db,
  subjects,
  teacherClassAssignments,
  teacherDocuments,
  teacherSubjectAssignments,
  teachers,
  tenants,
  users,
} from "@talimy/database"
import type { CreateTeacherInput } from "@talimy/shared"
import { and, asc, eq, inArray, isNull } from "drizzle-orm"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"

import { toTeacherView } from "./teachers.mapper"
import type { TeacherView } from "./teachers.types"

type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
type TenantRow = {
  genderPolicy: "boys_only" | "girls_only" | "mixed"
  id: string
  slug: string
}

@Injectable()
export class TeachersCreateRepository {
  private static readonly BCRYPT_ROUNDS = 12

  async create(payload: CreateTeacherInput): Promise<TeacherView> {
    return db.transaction(async (tx) => {
      const tenant = await this.getTenantOrThrow(tx, payload.tenantId)
      this.assertGenderAllowedByPolicy(payload.gender, tenant.genderPolicy)
      await this.assertUniqueEmail(tx, payload.email)

      const subjectIds = this.uniqueIds(payload.subjectIds)
      const classIds = this.uniqueIds(payload.classIds)
      const subjectRows = await this.getSubjectsOrThrow(tx, payload.tenantId, subjectIds)
      await this.getClassesOrThrow(tx, payload.tenantId, classIds)

      const subjectLabelById = new Map(subjectRows.map((row) => [row.id, row.name]))
      const primarySubjectId = subjectIds[0] ?? null
      const primarySubjectLabel = primarySubjectId
        ? (subjectLabelById.get(primarySubjectId) ?? null)
        : null
      const employeeId = await this.generateEmployeeId(tx, tenant)
      const passwordHash = await bcrypt.hash(
        this.generateTemporaryPassword(),
        TeachersCreateRepository.BCRYPT_ROUNDS
      )

      const [createdUser] = await tx
        .insert(users)
        .values({
          address: this.nullableText(payload.address),
          avatar: payload.avatar ?? null,
          avatarStorageKey: payload.avatarStorageKey ?? null,
          email: payload.email.toLowerCase(),
          firstName: payload.firstName,
          genderScope: "all",
          isActive: payload.status === "active",
          lastName: payload.lastName,
          middleName: this.nullableText(payload.middleName),
          nationality: payload.nationality,
          passwordHash,
          phone: this.nullableText(payload.phone),
          role: "teacher",
          telegramUsername: this.normalizeTelegramUsername(payload.telegramUsername),
          tenantId: payload.tenantId,
        })
        .returning()

      if (!createdUser) {
        throw new BadRequestException("Failed to create teacher user")
      }

      const [createdTeacher] = await tx
        .insert(teachers)
        .values({
          dateOfBirth: payload.dateOfBirth,
          employeeId,
          employmentType: payload.employmentType,
          gender: payload.gender,
          joinDate: payload.joinDate,
          qualification: null,
          salary: null,
          specialization: primarySubjectLabel,
          status: payload.status,
          tenantId: payload.tenantId,
          userId: createdUser.id,
        })
        .returning()

      if (!createdTeacher) {
        throw new BadRequestException("Failed to create teacher profile")
      }

      if (subjectIds.length > 0) {
        await tx.insert(teacherSubjectAssignments).values(
          subjectIds.map((subjectId, index) => ({
            isPrimary: index === 0,
            subjectId,
            teacherId: createdTeacher.id,
            tenantId: payload.tenantId,
          }))
        )
      }

      if (classIds.length > 0) {
        await tx.insert(teacherClassAssignments).values(
          classIds.map((classId, index) => ({
            classId,
            sortOrder: index,
            teacherId: createdTeacher.id,
            tenantId: payload.tenantId,
          }))
        )
      }

      if (payload.documents.length > 0) {
        await tx.insert(teacherDocuments).values(
          payload.documents.map((document) => ({
            documentType: document.documentType,
            fileName: document.fileName,
            mimeType: document.mimeType,
            sizeBytes: document.sizeBytes,
            storageKey: document.storageKey,
            teacherId: createdTeacher.id,
            tenantId: payload.tenantId,
          }))
        )
      }

      return toTeacherView(createdTeacher, createdUser)
    })
  }

  private assertGenderAllowedByPolicy(
    gender: "female" | "male",
    genderPolicy: TenantRow["genderPolicy"]
  ): void {
    if (genderPolicy === "boys_only" && gender !== "male") {
      throw new BadRequestException("Selected gender is not allowed for this school")
    }

    if (genderPolicy === "girls_only" && gender !== "female") {
      throw new BadRequestException("Selected gender is not allowed for this school")
    }
  }

  private async assertUniqueEmail(tx: DatabaseTransaction, email: string): Promise<void> {
    const [existingUser] = await tx
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email.toLowerCase()), isNull(users.deletedAt)))
      .limit(1)

    if (existingUser) {
      throw new BadRequestException("Email already exists")
    }
  }

  private async generateEmployeeId(tx: DatabaseTransaction, tenant: TenantRow): Promise<string> {
    const prefix = this.buildTeacherPrefix(tenant.slug)
    const rows = await tx
      .select({ employeeId: teachers.employeeId })
      .from(teachers)
      .where(and(eq(teachers.tenantId, tenant.id), isNull(teachers.deletedAt)))
      .orderBy(asc(teachers.employeeId))

    const nextSequence =
      rows.reduce((currentMax, row) => {
        const match = row.employeeId.match(/(\d+)$/)
        if (!match || !match[1]) {
          return currentMax
        }

        const value = Number(match[1])
        return Number.isFinite(value) && value > currentMax ? value : currentMax
      }, 0) + 1

    return `${prefix}-TEA-${String(nextSequence).padStart(3, "0")}`
  }

  private async getClassesOrThrow(
    tx: DatabaseTransaction,
    tenantId: string,
    classIds: readonly string[]
  ): Promise<readonly { id: string; name: string }[]> {
    const rows = await tx
      .select({ id: classes.id, name: classes.name })
      .from(classes)
      .where(
        and(
          eq(classes.tenantId, tenantId),
          inArray(classes.id, [...classIds]),
          isNull(classes.deletedAt)
        )
      )

    if (rows.length !== classIds.length) {
      throw new BadRequestException("One or more classes are invalid for this tenant")
    }

    return rows
  }

  private async getSubjectsOrThrow(
    tx: DatabaseTransaction,
    tenantId: string,
    subjectIds: readonly string[]
  ): Promise<readonly { id: string; name: string }[]> {
    const rows = await tx
      .select({ id: subjects.id, name: subjects.name })
      .from(subjects)
      .where(
        and(
          eq(subjects.tenantId, tenantId),
          eq(subjects.isActive, true),
          inArray(subjects.id, [...subjectIds]),
          isNull(subjects.deletedAt)
        )
      )

    if (rows.length !== subjectIds.length) {
      throw new BadRequestException("One or more subjects are invalid for this tenant")
    }

    return rows
  }

  private async getTenantOrThrow(tx: DatabaseTransaction, tenantId: string): Promise<TenantRow> {
    const [tenant] = await tx
      .select({
        genderPolicy: tenants.genderPolicy,
        id: tenants.id,
        slug: tenants.slug,
      })
      .from(tenants)
      .where(and(eq(tenants.id, tenantId), isNull(tenants.deletedAt)))
      .limit(1)

    if (!tenant) {
      throw new NotFoundException("Tenant not found")
    }

    return tenant
  }

  private buildTeacherPrefix(slug: string): string {
    const compactSlug = slug.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    return compactSlug.slice(0, 3).padEnd(3, "X")
  }

  private generateTemporaryPassword(): string {
    return randomBytes(18).toString("base64url")
  }

  private normalizeTelegramUsername(value: string): string | null {
    const normalized = value.trim()
    if (normalized.length === 0) {
      return null
    }

    return normalized.startsWith("@") ? normalized : `@${normalized}`
  }

  private nullableText(value: string): string | null {
    const normalized = value.trim()
    return normalized.length > 0 ? normalized : null
  }

  private uniqueIds(ids: readonly string[]): readonly string[] {
    return [...new Set(ids)]
  }
}
