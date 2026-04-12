import { randomBytes } from "node:crypto"

import bcrypt from "bcrypt"
import {
  classes,
  db,
  studentHealthRecords,
  studentProfiles,
  studentScholarships,
  students,
  tenantStudentModuleSettings,
  tenants,
  users,
  parents,
  parentStudent,
} from "@talimy/database"
import type { CreateStudentInput } from "@talimy/shared"
import { and, asc, eq, isNull } from "drizzle-orm"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"

import type { StudentCreateResult } from "./students.types"

type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
type TenantRow = {
  genderPolicy: "boys_only" | "girls_only" | "mixed"
  id: string
  slug: string
}

type ModuleSettingsRow = {
  contractNumberEnabled: boolean
  dormitoryEnabled: boolean
  financeEnabled: boolean
  grantEnabled: boolean
  mealsEnabled: boolean
  residencePermitEnabled: boolean
}

const DEFAULT_MODULE_SETTINGS: ModuleSettingsRow = {
  contractNumberEnabled: true,
  dormitoryEnabled: true,
  financeEnabled: true,
  grantEnabled: true,
  mealsEnabled: true,
  residencePermitEnabled: true,
}

@Injectable()
export class StudentsCreateRepository {
  private static readonly BCRYPT_ROUNDS = 12

  async create(payload: CreateStudentInput): Promise<StudentCreateResult> {
    return db.transaction(async (tx) => {
      const tenant = await this.getTenantOrThrow(tx, payload.tenantId)
      this.assertGenderAllowedByPolicy(payload.gender, tenant.genderPolicy)
      await this.assertUniqueEmail(tx, payload.email)
      await this.getClassOrThrow(tx, payload.tenantId, payload.classId)

      const moduleSettings = await this.getModuleSettings(tx, payload.tenantId)
      const studentCode = await this.generateStudentCode(tx, tenant)
      const admissionNumber = await this.generateAdmissionNumber(tx, payload.tenantId)
      const passwordHash = await bcrypt.hash(
        this.generateTemporaryPassword(),
        StudentsCreateRepository.BCRYPT_ROUNDS
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
          passwordHash,
          phone: this.nullableText(payload.phone),
          role: "student",
          tenantId: payload.tenantId,
        })
        .returning()

      if (!createdUser) {
        throw new BadRequestException("Failed to create student user")
      }

      const [createdStudent] = await tx
        .insert(students)
        .values({
          address: this.nullableText(payload.address),
          bloodGroup: null,
          classId: payload.classId,
          dateOfBirth: payload.dateOfBirth,
          enrollmentDate: payload.enrollmentDate,
          gender: payload.gender,
          status: payload.status,
          studentId: studentCode,
          tenantId: payload.tenantId,
          userId: createdUser.id,
        })
        .returning()

      if (!createdStudent) {
        throw new BadRequestException("Failed to create student profile")
      }

      await tx.insert(studentProfiles).values({
        admissionNumber,
        contractNumber: this.resolveOptionalModuleValue(
          payload.contractNumber,
          moduleSettings.contractNumberEnabled
        ),
        dormitoryRoom: this.resolveOptionalModuleValue(
          payload.dormitoryRoom,
          moduleSettings.dormitoryEnabled
        ),
        grantType: moduleSettings.grantEnabled ? payload.grantType : null,
        hobbiesInterests: this.nullableText(payload.hobbiesInterests),
        mealsPerDay: moduleSettings.mealsEnabled ? payload.mealsPerDay : null,
        medicalConditionAlert: payload.medicalConditionAlert,
        medicalConditionDetails: this.nullableText(payload.medicalConditionDetails),
        paidAmount: moduleSettings.financeEnabled ? this.numberToString(payload.paidAmount) : null,
        previousSchool: payload.previousSchool,
        residencePermitStatus: moduleSettings.residencePermitEnabled
          ? payload.residencePermitStatus
          : null,
        specialNeedsSupport: payload.specialNeedsSupport,
        studentId: createdStudent.id,
        tenantId: payload.tenantId,
        totalFee: moduleSettings.financeEnabled ? this.numberToString(payload.totalFee) : null,
      })

      await this.createGuardians(tx, tenant.slug, createdStudent.id, payload)
      await this.createDerivedRecords(tx, createdStudent.id, payload, moduleSettings)

      return {
        admissionNumber,
        fullName: `${payload.firstName} ${payload.lastName}`.trim(),
        id: createdStudent.id,
        studentId: studentCode,
      }
    })
  }

  private async createDerivedRecords(
    tx: DatabaseTransaction,
    studentId: string,
    payload: CreateStudentInput,
    moduleSettings: ModuleSettingsRow
  ): Promise<void> {
    if (payload.medicalConditionAlert && payload.medicalConditionDetails.trim().length > 0) {
      await tx.insert(studentHealthRecords).values({
        description: payload.medicalConditionDetails.trim(),
        label: "Medical Alert",
        studentId,
        tenantId: payload.tenantId,
        tone: "warning",
      })
    }

    if (payload.specialNeedsSupport) {
      await tx.insert(studentHealthRecords).values({
        description: "Support accommodations enabled during enrollment.",
        label: "Special Needs Support",
        studentId,
        tenantId: payload.tenantId,
        tone: "info",
      })
    }

    if (moduleSettings.grantEnabled && payload.grantType) {
      await tx.insert(studentScholarships).values({
        scholarshipType: "finance",
        studentId,
        tenantId: payload.tenantId,
        title: this.resolveScholarshipTitle(payload.grantType),
      })
    }
  }

  private async createGuardians(
    tx: DatabaseTransaction,
    tenantSlug: string,
    studentRecordId: string,
    payload: CreateStudentInput
  ): Promise<void> {
    const passwordHash = await bcrypt.hash(
      this.generateTemporaryPassword(),
      StudentsCreateRepository.BCRYPT_ROUNDS
    )

    const guardianEntries = [
      {
        firstName: payload.guardians.father.firstName,
        lastName: payload.guardians.father.lastName,
        phone: payload.guardians.father.phone,
        relationship: "father",
      },
      {
        firstName: payload.guardians.mother.firstName,
        lastName: payload.guardians.mother.lastName,
        phone: payload.guardians.mother.phone,
        relationship: "mother",
      },
    ] as const

    for (const guardian of guardianEntries) {
      await this.createGuardian(tx, passwordHash, tenantSlug, studentRecordId, payload, guardian)
    }

    const alternativeGuardian = payload.guardians.alternative
    if (
      alternativeGuardian &&
      alternativeGuardian.firstName.trim().length > 0 &&
      alternativeGuardian.lastName.trim().length > 0 &&
      alternativeGuardian.phone.trim().length > 0 &&
      alternativeGuardian.relation
    ) {
      await this.createGuardian(tx, passwordHash, tenantSlug, studentRecordId, payload, {
        firstName: alternativeGuardian.firstName,
        lastName: alternativeGuardian.lastName,
        phone: alternativeGuardian.phone,
        relationship: alternativeGuardian.relation,
      })
    }
  }

  private async createGuardian(
    tx: DatabaseTransaction,
    passwordHash: string,
    tenantSlug: string,
    studentRecordId: string,
    payload: CreateStudentInput,
    guardian: {
      firstName: string
      lastName: string
      phone: string
      relationship: string
    }
  ): Promise<void> {
    const email = this.buildGuardianEmail(tenantSlug, payload, guardian.relationship)
    const [parentUser] = await tx
      .insert(users)
      .values({
        address: this.nullableText(payload.address),
        email,
        firstName: guardian.firstName.trim(),
        genderScope: "all",
        isActive: true,
        lastName: guardian.lastName.trim(),
        passwordHash,
        phone: this.nullableText(guardian.phone),
        role: "parent",
        tenantId: payload.tenantId,
      })
      .returning()

    if (!parentUser) {
      throw new BadRequestException("Failed to create guardian user")
    }

    const [parentProfile] = await tx
      .insert(parents)
      .values({
        address: this.nullableText(payload.address),
        occupation: null,
        phone: this.nullableText(guardian.phone),
        relationship: guardian.relationship,
        tenantId: payload.tenantId,
        userId: parentUser.id,
      })
      .returning()

    if (!parentProfile) {
      throw new BadRequestException("Failed to create guardian profile")
    }

    await tx.insert(parentStudent).values({
      parentId: parentProfile.id,
      studentId: studentRecordId,
      tenantId: payload.tenantId,
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

  private buildGuardianEmail(
    tenantSlug: string,
    payload: CreateStudentInput,
    relationship: string
  ): string {
    const base = `${payload.firstName}.${payload.lastName}.${relationship}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "")
    const tenantDomain = `${tenantSlug}.talimy.space`
    return `${base}.${Date.now().toString(36)}@${tenantDomain}`
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

  private async generateAdmissionNumber(
    tx: DatabaseTransaction,
    tenantId: string
  ): Promise<string> {
    const studentRows = await tx
      .select({ id: students.id })
      .from(students)
      .where(and(eq(students.tenantId, tenantId), isNull(students.deletedAt)))

    const nextSequence = 1000 + studentRows.length + 1
    return `ADM-${String(nextSequence).padStart(4, "0")}`
  }

  private async generateStudentCode(tx: DatabaseTransaction, tenant: TenantRow): Promise<string> {
    const prefix = this.buildStudentPrefix(tenant.slug)
    const rows = await tx
      .select({ studentId: students.studentId })
      .from(students)
      .where(and(eq(students.tenantId, tenant.id), isNull(students.deletedAt)))
      .orderBy(asc(students.studentId))

    const nextSequence =
      rows.reduce((currentMax, row) => {
        const match = row.studentId.match(/(\d+)$/)
        if (!match || !match[1]) {
          return currentMax
        }

        const value = Number(match[1])
        return Number.isFinite(value) && value > currentMax ? value : currentMax
      }, 0) + 1

    return `${prefix}-STU-${String(nextSequence).padStart(3, "0")}`
  }

  private buildStudentPrefix(slug: string): string {
    const compactSlug = slug.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    return compactSlug.slice(0, 3).padEnd(3, "X")
  }

  private generateTemporaryPassword(): string {
    return randomBytes(18).toString("base64url")
  }

  private async getClassOrThrow(
    tx: DatabaseTransaction,
    tenantId: string,
    classId: string
  ): Promise<{ id: string }> {
    const [classRow] = await tx
      .select({ id: classes.id })
      .from(classes)
      .where(
        and(eq(classes.id, classId), eq(classes.tenantId, tenantId), isNull(classes.deletedAt))
      )
      .limit(1)

    if (!classRow) {
      throw new BadRequestException("Class not found in tenant")
    }

    return classRow
  }

  private async getModuleSettings(
    tx: DatabaseTransaction,
    tenantId: string
  ): Promise<ModuleSettingsRow> {
    const [row] = await tx
      .select({
        contractNumberEnabled: tenantStudentModuleSettings.contractNumberEnabled,
        dormitoryEnabled: tenantStudentModuleSettings.dormitoryEnabled,
        financeEnabled: tenantStudentModuleSettings.financeEnabled,
        grantEnabled: tenantStudentModuleSettings.grantEnabled,
        mealsEnabled: tenantStudentModuleSettings.mealsEnabled,
        residencePermitEnabled: tenantStudentModuleSettings.residencePermitEnabled,
      })
      .from(tenantStudentModuleSettings)
      .where(
        and(
          eq(tenantStudentModuleSettings.tenantId, tenantId),
          isNull(tenantStudentModuleSettings.deletedAt)
        )
      )
      .limit(1)

    return row ?? DEFAULT_MODULE_SETTINGS
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

  private nullableText(value: string): string | null {
    const normalized = value.trim()
    return normalized.length > 0 ? normalized : null
  }

  private numberToString(value: number | null): string | null {
    return typeof value === "number" ? value.toFixed(2) : null
  }

  private resolveOptionalModuleValue(value: string, isEnabled: boolean): string | null {
    if (!isEnabled) {
      return null
    }

    return this.nullableText(value)
  }

  private resolveScholarshipTitle(grantType: NonNullable<CreateStudentInput["grantType"]>): string {
    switch (grantType) {
      case "zakat":
        return "Zakat Support Program"
      case "sponsor":
        return "Sponsor Support Program"
      default:
        return "Student Support Program"
    }
  }
}
