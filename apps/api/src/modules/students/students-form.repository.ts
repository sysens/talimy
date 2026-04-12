import {
  classes,
  db,
  feeStructures,
  students,
  tenantStudentModuleSettings,
  tenants,
} from "@talimy/database"
import type { StudentCreateFormOptions } from "@talimy/shared"
import { and, asc, eq, isNull } from "drizzle-orm"
import { Injectable, NotFoundException } from "@nestjs/common"

type FormGenderScope = "all" | "female" | "male"
type TenantGenderPolicy = "boys_only" | "girls_only" | "mixed"

const DEFAULT_MODULE_SETTINGS: StudentCreateFormOptions["moduleSettings"] = {
  contractNumberEnabled: true,
  dormitoryEnabled: true,
  financeEnabled: true,
  grantEnabled: true,
  mealsEnabled: true,
  residencePermitEnabled: true,
}

@Injectable()
export class StudentsFormRepository {
  async getFormOptions(
    tenantId: string,
    genderScope: FormGenderScope
  ): Promise<StudentCreateFormOptions> {
    const tenant = await this.getTenantOrThrow(tenantId)
    const allowedGenders = this.resolveAllowedGenders(tenant.genderPolicy, genderScope)
    const [classOptions, moduleSettings, admissionNumberPreview] = await Promise.all([
      this.getClassOptions(tenantId),
      this.getModuleSettings(tenantId),
      this.getAdmissionNumberPreview(tenantId),
    ])

    return {
      admissionNumberPreview,
      allowedGenders,
      classes: classOptions,
      defaultGender: allowedGenders[0] ?? "male",
      moduleSettings,
      tenantId,
      tenantSlug: tenant.slug,
    }
  }

  private async getTenantOrThrow(
    tenantId: string
  ): Promise<{ genderPolicy: TenantGenderPolicy; id: string; slug: string }> {
    const [tenant] = await db
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

  private async getClassOptions(tenantId: string): Promise<StudentCreateFormOptions["classes"]> {
    const classRows = await db
      .select({
        feeAmount: feeStructures.amount,
        grade: classes.grade,
        id: classes.id,
        label: classes.name,
        section: classes.section,
      })
      .from(classes)
      .leftJoin(
        feeStructures,
        and(
          eq(feeStructures.classId, classes.id),
          eq(feeStructures.tenantId, tenantId),
          isNull(feeStructures.deletedAt)
        )
      )
      .where(and(eq(classes.tenantId, tenantId), isNull(classes.deletedAt)))
      .orderBy(asc(classes.grade), asc(classes.section), asc(classes.name))

    const dedupedByClassId = new Map<
      string,
      {
        feeAmount: number | null
        grade: string
        id: string
        label: string
        section: string
      }
    >()

    for (const row of classRows) {
      if (!dedupedByClassId.has(row.id)) {
        dedupedByClassId.set(row.id, {
          feeAmount:
            typeof row.feeAmount === "string" && row.feeAmount.length > 0
              ? Number(row.feeAmount)
              : null,
          grade: row.grade,
          id: row.id,
          label: row.label,
          section:
            typeof row.section === "string" && row.section.trim().length > 0
              ? row.section.trim()
              : row.label,
        })
      }
    }

    return [...dedupedByClassId.values()]
  }

  private async getModuleSettings(
    tenantId: string
  ): Promise<StudentCreateFormOptions["moduleSettings"]> {
    const [row] = await db
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

  private async getAdmissionNumberPreview(tenantId: string): Promise<string> {
    const studentCountRows = await db
      .select({ id: students.id })
      .from(students)
      .where(and(eq(students.tenantId, tenantId), isNull(students.deletedAt)))

    const nextSequence = 1000 + studentCountRows.length + 1
    return `ADM-${String(nextSequence).padStart(4, "0")}`
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
