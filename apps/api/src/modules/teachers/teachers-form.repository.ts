import { classes, db, students, subjects, tenants } from "@talimy/database"
import type { TeacherCreateFormOptions } from "@talimy/shared"
import { and, asc, eq, isNull } from "drizzle-orm"
import { Injectable, NotFoundException } from "@nestjs/common"

type FormGenderScope = "all" | "female" | "male"
type TenantGenderPolicy = "boys_only" | "girls_only" | "mixed"

@Injectable()
export class TeachersFormRepository {
  async getFormOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<TeacherCreateFormOptions> {
    const tenant = await this.getTenantOrThrow(tenantId)
    const allowedGenders = this.resolveAllowedGenders(tenant.genderPolicy, genderScope)
    const [subjectOptions, classOptions] = await Promise.all([
      this.getSubjectOptions(tenantId),
      this.getClassOptions(tenantId, genderScope),
    ])

    return {
      allowedGenders,
      classes: classOptions,
      defaultGender: allowedGenders[0] ?? "male",
      subjects: subjectOptions,
      tenantId,
    }
  }

  private async getTenantOrThrow(
    tenantId: string
  ): Promise<{ genderPolicy: TenantGenderPolicy; id: string }> {
    const [tenant] = await db
      .select({
        genderPolicy: tenants.genderPolicy,
        id: tenants.id,
      })
      .from(tenants)
      .where(and(eq(tenants.id, tenantId), isNull(tenants.deletedAt)))
      .limit(1)

    if (!tenant) {
      throw new NotFoundException("Tenant not found")
    }

    return tenant
  }

  private async getSubjectOptions(tenantId: string): Promise<TeacherCreateFormOptions["subjects"]> {
    const rows = await db
      .select({
        id: subjects.id,
        label: subjects.name,
      })
      .from(subjects)
      .where(
        and(
          eq(subjects.tenantId, tenantId),
          eq(subjects.isActive, true),
          isNull(subjects.deletedAt)
        )
      )
      .orderBy(asc(subjects.name))

    return rows
  }

  private async getClassOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<TeacherCreateFormOptions["classes"]> {
    const allClasses = await db
      .select({
        id: classes.id,
        label: classes.name,
      })
      .from(classes)
      .where(and(eq(classes.tenantId, tenantId), isNull(classes.deletedAt)))
      .orderBy(asc(classes.grade), asc(classes.section), asc(classes.name))

    if (genderScope === "all") {
      return allClasses
    }

    const rows = await db
      .select({
        classId: students.classId,
      })
      .from(students)
      .where(
        and(
          eq(students.tenantId, tenantId),
          eq(students.gender, genderScope),
          isNull(students.deletedAt)
        )
      )

    const allowedClassIds = new Set(
      rows
        .map((row) => row.classId)
        .filter((classId): classId is string => typeof classId === "string" && classId.length > 0)
    )

    const filteredClasses = allClasses.filter((item) => allowedClassIds.has(item.id))
    return filteredClasses.length > 0 ? filteredClasses : allClasses
  }

  private resolveAllowedGenders(
    genderPolicy: TenantGenderPolicy,
    genderScope: FormGenderScope
  ): readonly ("female" | "male")[] {
    const gendersByPolicy: Record<TenantGenderPolicy, readonly ("female" | "male")[]> = {
      boys_only: ["male"],
      girls_only: ["female"],
      mixed: ["male", "female"],
    }

    const allowedByPolicy = gendersByPolicy[genderPolicy]
    if (genderScope === "male" || genderScope === "female") {
      return allowedByPolicy.includes(genderScope) ? [genderScope] : [...allowedByPolicy]
    }

    return [...allowedByPolicy]
  }
}
