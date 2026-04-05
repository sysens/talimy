import { randomUUID } from "node:crypto"
import bcrypt from "bcrypt"
import type { InferInsertModel } from "drizzle-orm"
import { and, eq, isNull } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"

import { ensureDashboardFixtures } from "./bootstrap-dashboard-fixtures"
import { pool } from "./client"
import { academicYears } from "./schema/academic-years"
import { classes } from "./schema/classes"
import { parentStudent } from "./schema/parent-student"
import { parents } from "./schema/parents"
import { students } from "./schema/students"
import { teachers } from "./schema/teachers"
import { tenants } from "./schema/tenants"
import { users } from "./schema/users"

export type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
type TenantInsert = InferInsertModel<typeof tenants>
type UserInsert = InferInsertModel<typeof users>
type AcademicYearInsert = InferInsertModel<typeof academicYears>
type ClassInsert = InferInsertModel<typeof classes>
type TeacherInsert = InferInsertModel<typeof teachers>
type StudentInsert = InferInsertModel<typeof students>
type ParentInsert = InferInsertModel<typeof parents>

const db = drizzle(pool)

const PLATFORM_TENANT_ID =
  process.env.PLATFORM_TENANT_ID?.trim() || "2df1d8f4-0cef-4d8d-8d6d-dcbf229b8a10"
const SCHOOL_TENANT_ID =
  process.env.BRIDGE_TENANT_ID?.trim() || "eddbf523-f288-402a-9a16-ef93d27aafc7"

const PLATFORM_PASSWORD = process.env.PLATFORM_ADMIN_PASSWORD?.trim() || "MezanaPlatform!2026"
const SCHOOL_ADMIN_PASSWORD = process.env.SCHOOL_ADMIN_PASSWORD?.trim() || "MezanaAdmin!2026"
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD?.trim() || "MezanaTeacher!2026"
const STUDENT_PASSWORD = process.env.STUDENT_PASSWORD?.trim() || "MezanaStudent!2026"
const PARENT_PASSWORD = process.env.PARENT_PASSWORD?.trim() || "MezanaParent!2026"
const SCHOOL_ADMIN_GENDER_SCOPE = resolveGenderScope(
  process.env.SCHOOL_ADMIN_GENDER_SCOPE?.trim() || null
)

const PLATFORM_USERS = [
  {
    email: process.env.PLATFORM_ADMIN_EMAIL?.trim() || "anonymed@duck.com",
    firstName: "Platform",
    lastName: "Owner",
  },
  {
    email:
      process.env.PLATFORM_SECONDARY_ADMIN_EMAIL?.trim() || "platform.main@mezana.talimy.space",
    firstName: "Platform",
    lastName: "Admin",
  },
] as const

const SCHOOL_USERS = {
  schoolAdmin: {
    email: process.env.SCHOOL_ADMIN_EMAIL?.trim() || "school-admin.main@mezana.talimy.space",
    firstName: "School",
    lastName: "Admin",
  },
  teacher: {
    email: process.env.TEACHER_EMAIL?.trim() || "teacher.main@mezana.talimy.space",
    firstName: "Main",
    lastName: "Teacher",
  },
  student: {
    email: process.env.STUDENT_EMAIL?.trim() || "student.main@mezana.talimy.space",
    firstName: "Main",
    lastName: "Student",
  },
  parent: {
    email: process.env.PARENT_EMAIL?.trim() || "parent.main@mezana.talimy.space",
    firstName: "Main",
    lastName: "Parent",
  },
} as const

function normalizeEmail(email: string): string {
  return email.toLowerCase()
}

function resolveGenderScope(value: string | null): "male" | "female" | "all" {
  if (value === "male" || value === "female" || value === "all") {
    return value
  }

  return "all"
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function upsertTenant(tx: DatabaseTransaction, payload: TenantInsert): Promise<string> {
  const [tenant] = await tx
    .insert(tenants)
    .values(payload)
    .onConflictDoUpdate({
      target: tenants.slug,
      set: {
        name: payload.name,
        domain: payload.domain ?? null,
        status: payload.status,
        genderPolicy: payload.genderPolicy,
        plan: payload.plan,
        updatedAt: new Date(),
        deletedAt: null,
      },
    })
    .returning({ id: tenants.id })

  if (!tenant) {
    throw new Error(`Failed to upsert tenant ${payload.slug}`)
  }

  return tenant.id
}

async function upsertUser(tx: DatabaseTransaction, payload: UserInsert): Promise<string> {
  const [user] = await tx
    .insert(users)
    .values(payload)
    .onConflictDoUpdate({
      target: users.email,
      set: {
        address: payload.address ?? null,
        avatar: payload.avatar ?? null,
        tenantId: payload.tenantId,
        passwordHash: payload.passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone ?? null,
        role: payload.role,
        genderScope: payload.genderScope ?? "all",
        isActive: true,
        updatedAt: new Date(),
        deletedAt: null,
      },
    })
    .returning({ id: users.id })

  if (!user) {
    throw new Error(`Failed to upsert user ${payload.email}`)
  }

  return user.id
}

async function ensureAcademicYear(tx: DatabaseTransaction, tenantId: string): Promise<string> {
  const [existing] = await tx
    .select({ id: academicYears.id })
    .from(academicYears)
    .where(
      and(
        eq(academicYears.tenantId, tenantId),
        eq(academicYears.name, "2025-2026"),
        isNull(academicYears.deletedAt)
      )
    )
    .limit(1)

  if (existing) return existing.id

  const payload: AcademicYearInsert = {
    id: randomUUID(),
    tenantId,
    name: "2025-2026",
    startDate: new Date("2025-09-01T00:00:00.000Z"),
    endDate: new Date("2026-06-01T00:00:00.000Z"),
    isCurrent: true,
  }

  const [created] = await tx
    .insert(academicYears)
    .values(payload)
    .returning({ id: academicYears.id })
  if (!created) {
    throw new Error(`Failed to create academic year for tenant ${tenantId}`)
  }
  return created.id
}

async function ensureClass(
  tx: DatabaseTransaction,
  tenantId: string,
  academicYearId: string
): Promise<string> {
  const [existing] = await tx
    .select({ id: classes.id })
    .from(classes)
    .where(
      and(eq(classes.tenantId, tenantId), eq(classes.name, "Grade 5 A"), isNull(classes.deletedAt))
    )
    .limit(1)

  if (existing) return existing.id

  const payload: ClassInsert = {
    id: randomUUID(),
    tenantId,
    name: "Grade 5 A",
    grade: "5",
    section: "A",
    capacity: 30,
    academicYearId,
  }

  const [created] = await tx.insert(classes).values(payload).returning({ id: classes.id })
  if (!created) {
    throw new Error(`Failed to create class for tenant ${tenantId}`)
  }
  return created.id
}

async function ensureTeacherProfile(
  tx: DatabaseTransaction,
  payload: TeacherInsert
): Promise<void> {
  const [existing] = await tx
    .select({ id: teachers.id })
    .from(teachers)
    .where(and(eq(teachers.userId, payload.userId), isNull(teachers.deletedAt)))
    .limit(1)

  if (existing) return

  await tx.insert(teachers).values(payload)
}

async function ensureStudentProfile(
  tx: DatabaseTransaction,
  payload: StudentInsert
): Promise<string> {
  const [existing] = await tx
    .select({ id: students.id })
    .from(students)
    .where(and(eq(students.userId, payload.userId), isNull(students.deletedAt)))
    .limit(1)

  if (existing) return existing.id

  const [created] = await tx.insert(students).values(payload).returning({ id: students.id })
  if (!created) {
    throw new Error(`Failed to create student profile for user ${payload.userId}`)
  }
  return created.id
}

async function ensureParentProfile(
  tx: DatabaseTransaction,
  payload: ParentInsert
): Promise<string> {
  const [existing] = await tx
    .select({ id: parents.id })
    .from(parents)
    .where(and(eq(parents.userId, payload.userId), isNull(parents.deletedAt)))
    .limit(1)

  if (existing) return existing.id

  const [created] = await tx.insert(parents).values(payload).returning({ id: parents.id })
  if (!created) {
    throw new Error(`Failed to create parent profile for user ${payload.userId}`)
  }
  return created.id
}

async function ensureParentStudentRelation(
  tx: DatabaseTransaction,
  tenantId: string,
  parentId: string,
  studentId: string
): Promise<void> {
  const [existing] = await tx
    .select({ id: parentStudent.id })
    .from(parentStudent)
    .where(
      and(
        eq(parentStudent.tenantId, tenantId),
        eq(parentStudent.parentId, parentId),
        eq(parentStudent.studentId, studentId),
        isNull(parentStudent.deletedAt)
      )
    )
    .limit(1)

  if (existing) return

  await tx.insert(parentStudent).values({
    id: randomUUID(),
    tenantId,
    parentId,
    studentId,
  })
}

export async function bootstrapProductionData(): Promise<void> {
  const platformPasswordHash = await hashPassword(PLATFORM_PASSWORD)
  const schoolAdminPasswordHash = await hashPassword(SCHOOL_ADMIN_PASSWORD)
  const teacherPasswordHash = await hashPassword(TEACHER_PASSWORD)
  const studentPasswordHash = await hashPassword(STUDENT_PASSWORD)
  const parentPasswordHash = await hashPassword(PARENT_PASSWORD)

  await db.transaction(async (tx) => {
    const platformTenantId = await upsertTenant(tx, {
      id: PLATFORM_TENANT_ID,
      name: "Talimy Platform",
      slug: "platform",
      domain: "platform.talimy.space",
      status: "active",
      genderPolicy: "mixed",
      plan: "enterprise",
    })

    const schoolTenantId = await upsertTenant(tx, {
      id: SCHOOL_TENANT_ID,
      name: "Mezana",
      slug: "mezana",
      domain: "mezana.talimy.space",
      status: "active",
      genderPolicy: "mixed",
      plan: "pro",
    })

    for (const platformUser of PLATFORM_USERS) {
      await upsertUser(tx, {
        tenantId: platformTenantId,
        email: normalizeEmail(platformUser.email),
        passwordHash: platformPasswordHash,
        firstName: platformUser.firstName,
        lastName: platformUser.lastName,
        role: "platform_admin",
        genderScope: "all",
        isActive: true,
      })
    }

    const schoolAdminUserId = await upsertUser(tx, {
      tenantId: schoolTenantId,
      email: normalizeEmail(SCHOOL_USERS.schoolAdmin.email),
      passwordHash: schoolAdminPasswordHash,
      firstName: SCHOOL_USERS.schoolAdmin.firstName,
      lastName: SCHOOL_USERS.schoolAdmin.lastName,
      role: "school_admin",
      genderScope: SCHOOL_ADMIN_GENDER_SCOPE,
      isActive: true,
    })

    const teacherUserId = await upsertUser(tx, {
      address: "10 Queen Street, London, United Kingdom",
      avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
      tenantId: schoolTenantId,
      email: normalizeEmail(SCHOOL_USERS.teacher.email),
      passwordHash: teacherPasswordHash,
      firstName: SCHOOL_USERS.teacher.firstName,
      lastName: SCHOOL_USERS.teacher.lastName,
      phone: "+62 812 0011 2233",
      role: "teacher",
      genderScope: "all",
      isActive: true,
    })

    const studentUserId = await upsertUser(tx, {
      tenantId: schoolTenantId,
      email: normalizeEmail(SCHOOL_USERS.student.email),
      passwordHash: studentPasswordHash,
      firstName: SCHOOL_USERS.student.firstName,
      lastName: SCHOOL_USERS.student.lastName,
      role: "student",
      genderScope: "all",
      isActive: true,
    })

    const parentUserId = await upsertUser(tx, {
      tenantId: schoolTenantId,
      email: normalizeEmail(SCHOOL_USERS.parent.email),
      passwordHash: parentPasswordHash,
      firstName: SCHOOL_USERS.parent.firstName,
      lastName: SCHOOL_USERS.parent.lastName,
      role: "parent",
      genderScope: "all",
      isActive: true,
    })

    const academicYearId = await ensureAcademicYear(tx, schoolTenantId)
    const classId = await ensureClass(tx, schoolTenantId, academicYearId)

    await ensureTeacherProfile(tx, {
      id: randomUUID(),
      userId: teacherUserId,
      tenantId: schoolTenantId,
      employeeId: "MEZ-TEA-001",
      employmentType: "full_time",
      gender: "male",
      joinDate: "2025-09-01",
      qualification: "B.Ed",
      specialization: "Mathematics",
      status: "active",
    })

    const studentId = await ensureStudentProfile(tx, {
      id: randomUUID(),
      userId: studentUserId,
      tenantId: schoolTenantId,
      studentId: "MEZ-STU-001",
      gender: "female",
      classId,
      enrollmentDate: "2025-09-01",
      status: "active",
      address: "Tashkent",
    })

    const parentId = await ensureParentProfile(tx, {
      id: randomUUID(),
      userId: parentUserId,
      tenantId: schoolTenantId,
      relationship: "parent",
      address: "Tashkent",
    })

    await ensureParentStudentRelation(tx, schoolTenantId, parentId, studentId)
    await ensureDashboardFixtures(tx, {
      academicYearId,
      schoolAdminUserId,
      schoolTenantId,
      studentPasswordHash,
      teacherPasswordHash,
      teacherUserId,
    })

    console.log("Bootstrap completed")
    console.log(`Platform tenant: ${platformTenantId}`)
    console.log(`School tenant: ${schoolTenantId}`)
    console.log(`Platform admin: ${PLATFORM_USERS[0].email}`)
    console.log(`Secondary platform admin: ${PLATFORM_USERS[1].email}`)
    console.log(`School admin: ${SCHOOL_USERS.schoolAdmin.email}`)
    console.log(`Teacher: ${SCHOOL_USERS.teacher.email}`)
    console.log(`Student: ${SCHOOL_USERS.student.email}`)
    console.log(`Parent: ${SCHOOL_USERS.parent.email}`)
    console.log(`School admin user id: ${schoolAdminUserId}`)
  })

  await pool.end()
}

async function main(): Promise<void> {
  try {
    await bootstrapProductionData()
  } catch (error) {
    console.error("Bootstrap failed", error)
    process.exitCode = 1
  }
}

if (process.argv[1]?.endsWith("bootstrap.ts") || process.argv[1]?.endsWith("bootstrap.js")) {
  void main()
}
