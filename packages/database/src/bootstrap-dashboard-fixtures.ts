import { createHash } from "node:crypto"
import type { InferInsertModel } from "drizzle-orm"
import { and, eq, isNull } from "drizzle-orm"

import type { DatabaseTransaction } from "./bootstrap"
import {
  auditLogs,
  attendance,
  classes,
  events,
  grades,
  notices,
  payments,
  students,
  subjects,
  teachers,
  terms,
  users,
} from "./schema"

type UserInsert = InferInsertModel<typeof users>
type TeacherInsert = InferInsertModel<typeof teachers>
type StudentInsert = InferInsertModel<typeof students>

type DashboardFixtureContext = {
  academicYearId: string
  schoolAdminUserId: string
  schoolTenantId: string
  studentPasswordHash: string
  teacherPasswordHash: string
  teacherUserId: string
}

type DashboardStudentFixture = {
  email: string
  firstName: string
  gender: "female" | "male"
  grade: "7" | "8" | "9"
  lastName: string
  studentCode: string
}

const DASHBOARD_FIXTURE_PREFIX = "dashboard-fixture"
const DASHBOARD_SUBJECT = { code: "MATH", name: "Mathematics" } as const
const DASHBOARD_NOTICE_TITLES = [
  "Science Fair Registration Opens",
  "Teacher Development Workshop",
  "New Library Books Arrived",
  "Field Trip Consent Forms Due",
] as const
const DASHBOARD_EVENT_TITLES = [
  "Parent Advisory Meeting",
  "Annual Sport Competition",
  "Parent-Teacher Meeting",
  "Annual Science Fair",
  "Teacher Development Workshop",
] as const
const DASHBOARD_STUDENT_FIXTURES: readonly DashboardStudentFixture[] = [
  {
    email: "abdulloh.grade7@mezana.talimy.space",
    firstName: "Abdulloh",
    gender: "male",
    grade: "7",
    lastName: "Jalolov",
    studentCode: "MEZ-7A-101",
  },
  {
    email: "madina.grade7@mezana.talimy.space",
    firstName: "Madina",
    gender: "female",
    grade: "7",
    lastName: "Karimova",
    studentCode: "MEZ-7A-102",
  },
  {
    email: "temur.grade8@mezana.talimy.space",
    firstName: "Temur",
    gender: "male",
    grade: "8",
    lastName: "Nasriddinov",
    studentCode: "MEZ-8A-201",
  },
  {
    email: "aziza.grade8@mezana.talimy.space",
    firstName: "Aziza",
    gender: "female",
    grade: "8",
    lastName: "Rasulova",
    studentCode: "MEZ-8A-202",
  },
  {
    email: "javohir.grade9@mezana.talimy.space",
    firstName: "Javohir",
    gender: "male",
    grade: "9",
    lastName: "Sobirov",
    studentCode: "MEZ-9A-301",
  },
  {
    email: "dilnoza.grade9@mezana.talimy.space",
    firstName: "Dilnoza",
    gender: "female",
    grade: "9",
    lastName: "Hakimova",
    studentCode: "MEZ-9A-302",
  },
] as const

export async function ensureDashboardFixtures(
  tx: DatabaseTransaction,
  context: DashboardFixtureContext
): Promise<void> {
  const classIds = {
    grade7: await ensureClass(tx, context.schoolTenantId, context.academicYearId, "7", "Grade 7 A"),
    grade8: await ensureClass(tx, context.schoolTenantId, context.academicYearId, "8", "Grade 8 A"),
    grade9: await ensureClass(tx, context.schoolTenantId, context.academicYearId, "9", "Grade 9 A"),
  } as const
  const subjectId = await ensureSubject(
    tx,
    context.schoolTenantId,
    DASHBOARD_SUBJECT.code,
    DASHBOARD_SUBJECT.name
  )
  const termIds = {
    term1: await ensureTerm(
      tx,
      context.schoolTenantId,
      context.academicYearId,
      1,
      "Term 1",
      "2025-09-01T00:00:00.000Z",
      "2025-12-31T23:59:59.999Z"
    ),
    term2: await ensureTerm(
      tx,
      context.schoolTenantId,
      context.academicYearId,
      2,
      "Term 2",
      "2026-01-05T00:00:00.000Z",
      "2026-06-10T23:59:59.999Z"
    ),
  } as const
  const primaryTeacherId = await ensureTeacherProfile(tx, {
    employeeId: "MEZ-TEA-001",
    gender: "male",
    id: fixtureUuid("teacher-profile-main"),
    joinDate: "2025-09-01",
    qualification: "B.Ed",
    specialization: "Mathematics",
    status: "active",
    tenantId: context.schoolTenantId,
    userId: context.teacherUserId,
  })

  const assistantTeacherUserId = await upsertUser(tx, {
    email: "teacher.assistant@mezana.talimy.space",
    firstName: "Saida",
    genderScope: "all",
    isActive: true,
    lastName: "Tursunova",
    passwordHash: context.teacherPasswordHash,
    role: "teacher",
    tenantId: context.schoolTenantId,
  })

  await ensureTeacherProfile(tx, {
    employeeId: "MEZ-TEA-002",
    gender: "female",
    id: fixtureUuid("teacher-profile-assistant"),
    joinDate: "2025-09-01",
    qualification: "M.Ed",
    specialization: "Science",
    status: "active",
    tenantId: context.schoolTenantId,
    userId: assistantTeacherUserId,
  })

  const studentRecords = await Promise.all(
    DASHBOARD_STUDENT_FIXTURES.map(async (fixture) => {
      const userId = await upsertUser(tx, {
        email: fixture.email,
        firstName: fixture.firstName,
        genderScope: "all",
        isActive: true,
        lastName: fixture.lastName,
        passwordHash: context.studentPasswordHash,
        role: "student",
        tenantId: context.schoolTenantId,
      })

      const classId =
        fixture.grade === "7"
          ? classIds.grade7
          : fixture.grade === "8"
            ? classIds.grade8
            : classIds.grade9

      const studentId = await ensureStudentProfile(tx, {
        address: "Tashkent",
        classId,
        enrollmentDate: "2025-09-01",
        gender: fixture.gender,
        id: fixtureUuid(`student-profile:${fixture.studentCode}`),
        status: "active",
        studentId: fixture.studentCode,
        tenantId: context.schoolTenantId,
        userId,
      })

      return { classId, email: fixture.email, grade: fixture.grade, studentId }
    })
  )

  await upsertDashboardGrades(
    tx,
    context.schoolTenantId,
    primaryTeacherId,
    subjectId,
    termIds,
    studentRecords
  )
  await upsertDashboardAttendance(tx, context.schoolTenantId, primaryTeacherId, studentRecords)
  await upsertDashboardPayments(tx, context.schoolTenantId, studentRecords)
  await upsertDashboardNotices(tx, context.schoolTenantId, context.schoolAdminUserId)
  await upsertDashboardEvents(tx, context.schoolTenantId)
  await upsertDashboardActivity(
    tx,
    context.schoolTenantId,
    context.schoolAdminUserId,
    context.teacherUserId
  )
}

async function upsertUser(tx: DatabaseTransaction, payload: UserInsert): Promise<string> {
  const [row] = await tx
    .insert(users)
    .values(payload)
    .onConflictDoUpdate({
      target: users.email,
      set: {
        firstName: payload.firstName,
        genderScope: payload.genderScope ?? "all",
        isActive: true,
        lastName: payload.lastName,
        passwordHash: payload.passwordHash,
        role: payload.role,
        tenantId: payload.tenantId,
        updatedAt: new Date(),
        deletedAt: null,
      },
    })
    .returning({ id: users.id })
  if (!row) throw new Error(`Failed to upsert user ${payload.email}`)
  return row.id
}

async function ensureTeacherProfile(
  tx: DatabaseTransaction,
  payload: TeacherInsert
): Promise<string> {
  const [existing] = await tx
    .select({ id: teachers.id })
    .from(teachers)
    .where(and(eq(teachers.userId, payload.userId), isNull(teachers.deletedAt)))
    .limit(1)
  if (existing) return existing.id
  const [created] = await tx.insert(teachers).values(payload).returning({ id: teachers.id })
  if (!created) throw new Error(`Failed to create teacher profile ${payload.employeeId}`)
  return created.id
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
  if (!created) throw new Error(`Failed to create student profile ${payload.studentId}`)
  return created.id
}

async function ensureClass(
  tx: DatabaseTransaction,
  tenantId: string,
  academicYearId: string,
  grade: "7" | "8" | "9",
  name: string
): Promise<string> {
  const [existing] = await tx
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.tenantId, tenantId), eq(classes.name, name), isNull(classes.deletedAt)))
    .limit(1)
  if (existing) return existing.id
  const [created] = await tx
    .insert(classes)
    .values({
      academicYearId,
      capacity: 32,
      grade,
      id: fixtureUuid(`class:${grade}`),
      name,
      section: "A",
      tenantId,
    })
    .returning({ id: classes.id })
  if (!created) throw new Error(`Failed to create class ${name}`)
  return created.id
}

async function ensureSubject(
  tx: DatabaseTransaction,
  tenantId: string,
  code: string,
  name: string
): Promise<string> {
  const [existing] = await tx
    .select({ id: subjects.id })
    .from(subjects)
    .where(
      and(eq(subjects.tenantId, tenantId), eq(subjects.code, code), isNull(subjects.deletedAt))
    )
    .limit(1)
  if (existing) return existing.id
  const [created] = await tx
    .insert(subjects)
    .values({ code, id: fixtureUuid(`subject:${code}`), isActive: true, name, tenantId })
    .returning({ id: subjects.id })
  if (!created) throw new Error(`Failed to create subject ${code}`)
  return created.id
}

async function ensureTerm(
  tx: DatabaseTransaction,
  tenantId: string,
  academicYearId: string,
  termNumber: 1 | 2,
  name: string,
  startDate: string,
  endDate: string
): Promise<string> {
  const [existing] = await tx
    .select({ id: terms.id })
    .from(terms)
    .where(
      and(
        eq(terms.tenantId, tenantId),
        eq(terms.academicYearId, academicYearId),
        eq(terms.termNumber, termNumber),
        isNull(terms.deletedAt)
      )
    )
    .limit(1)
  if (existing) return existing.id
  const [created] = await tx
    .insert(terms)
    .values({
      academicYearId,
      endDate: new Date(endDate),
      id: fixtureUuid(`term:${termNumber}`),
      name,
      startDate: new Date(startDate),
      tenantId,
      termNumber,
    })
    .returning({ id: terms.id })
  if (!created) throw new Error(`Failed to create term ${name}`)
  return created.id
}

async function upsertDashboardGrades(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherId: string,
  subjectId: string,
  termIds: { term1: string; term2: string },
  studentRecords: readonly { email: string; grade: "7" | "8" | "9"; studentId: string }[]
): Promise<void> {
  const months = [
    { month: 7, year: 2025 },
    { month: 8, year: 2025 },
    { month: 9, year: 2025 },
    { month: 10, year: 2025 },
    { month: 11, year: 2025 },
    { month: 12, year: 2025 },
    { month: 1, year: 2026 },
    { month: 2, year: 2026 },
    { month: 3, year: 2026 },
    { month: 4, year: 2026 },
    { month: 5, year: 2026 },
    { month: 6, year: 2026 },
  ] as const
  const scoreMap: Record<string, readonly number[]> = {
    "abdulloh.grade7@mezana.talimy.space": [72, 74, 76, 78, 80, 82, 83, 84, 86, 88, 89, 90],
    "madina.grade7@mezana.talimy.space": [75, 77, 79, 81, 83, 85, 86, 87, 89, 90, 92, 93],
    "temur.grade8@mezana.talimy.space": [78, 80, 82, 84, 85, 87, 88, 89, 90, 91, 92, 93],
    "aziza.grade8@mezana.talimy.space": [80, 82, 84, 86, 87, 89, 90, 91, 92, 93, 94, 95],
    "javohir.grade9@mezana.talimy.space": [84, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 98],
    "dilnoza.grade9@mezana.talimy.space": [86, 88, 90, 91, 92, 94, 95, 96, 97, 98, 99, 100],
  }

  for (const student of studentRecords) {
    const scores = scoreMap[student.email] ?? defaultScoresForGrade(student.grade)
    for (const [index, point] of months.entries()) {
      const createdAt = new Date(Date.UTC(point.year, point.month - 1, 14, 9, 0, 0, 0))
      await tx
        .insert(grades)
        .values({
          comment: `${DASHBOARD_FIXTURE_PREFIX}: ${student.grade}-${point.year}-${point.month}`,
          createdAt,
          grade: toLetterGrade(scores[index] ?? 75),
          id: fixtureUuid(`grade:${student.studentId}:${point.year}-${point.month}`),
          score: String(scores[index] ?? 75),
          studentId: student.studentId,
          subjectId,
          teacherId,
          tenantId,
          termId: point.year === 2025 ? termIds.term1 : termIds.term2,
          updatedAt: createdAt,
        })
        .onConflictDoUpdate({
          target: grades.id,
          set: {
            comment: `${DASHBOARD_FIXTURE_PREFIX}: ${student.grade}-${point.year}-${point.month}`,
            createdAt,
            grade: toLetterGrade(scores[index] ?? 75),
            score: String(scores[index] ?? 75),
            teacherId,
            termId: point.year === 2025 ? termIds.term1 : termIds.term2,
            updatedAt: createdAt,
          },
        })
    }
  }
}

async function upsertDashboardAttendance(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherId: string,
  studentRecords: readonly { classId: string; grade: "7" | "8" | "9"; studentId: string }[]
): Promise<void> {
  const today = new Date()
  const weekStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)
  )
  const daysFromMonday = weekStart.getUTCDay() === 0 ? 6 : weekStart.getUTCDay() - 1
  weekStart.setUTCDate(weekStart.getUTCDate() - daysFromMonday)
  const weeklyStatuses = [
    "present",
    "absent",
    "present",
    "present",
    "present",
    "present",
    "late",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "excused",
    "present",
    "present",
    "present",
    "present",
    "present",
    "absent",
    "present",
    "present",
    "present",
    "present",
    "present",
    "late",
    "present",
    "absent",
    "present",
    "present",
  ] as const
  let weeklyIndex = 0

  for (let dayOffset = 0; dayOffset < 6; dayOffset += 1) {
    const date = new Date(weekStart)
    date.setUTCDate(weekStart.getUTCDate() + dayOffset)
    const isoDate = date.toISOString().slice(0, 10)
    for (const student of studentRecords) {
      const status = weeklyStatuses[weeklyIndex] ?? "present"
      weeklyIndex += 1
      await tx
        .insert(attendance)
        .values({
          classId: student.classId,
          date: isoDate,
          id: fixtureUuid(`attendance-week:${student.studentId}:${isoDate}`),
          markedBy: teacherId,
          note: `${DASHBOARD_FIXTURE_PREFIX}: weekly`,
          status,
          studentId: student.studentId,
          tenantId,
        })
        .onConflictDoUpdate({
          target: attendance.id,
          set: {
            markedBy: teacherId,
            note: `${DASHBOARD_FIXTURE_PREFIX}: weekly`,
            status,
            updatedAt: new Date(),
          },
        })
    }
  }

  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const snapshotDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - monthOffset, 10, 0, 0, 0, 0)
    )
    const isoDate = snapshotDate.toISOString().slice(0, 10)
    for (const [index, student] of studentRecords.entries()) {
      const status = index % 5 === 4 ? "late" : index % 4 === 3 ? "excused" : "present"
      await tx
        .insert(attendance)
        .values({
          classId: student.classId,
          date: isoDate,
          id: fixtureUuid(`attendance-month:${student.studentId}:${isoDate}`),
          markedBy: teacherId,
          note: `${DASHBOARD_FIXTURE_PREFIX}: monthly`,
          status,
          studentId: student.studentId,
          tenantId,
        })
        .onConflictDoUpdate({
          target: attendance.id,
          set: {
            markedBy: teacherId,
            note: `${DASHBOARD_FIXTURE_PREFIX}: monthly`,
            status,
            updatedAt: new Date(),
          },
        })
    }
  }
}

async function upsertDashboardPayments(
  tx: DatabaseTransaction,
  tenantId: string,
  studentRecords: readonly { studentId: string }[]
): Promise<void> {
  const monthlyTotals = {
    2025: [3200, 3400, 3000, 3600, 3900, 4300, 4800, 5200, 5100, 4700, 5000, 5600],
    2026: [3600, 3800, 3400, 4100, 4500, 4900, 5300, 5100, 4800, 5200, 5600, 6000],
  } as const
  const paymentStudents = studentRecords.slice(0, 2)

  for (const year of [2025, 2026] as const) {
    for (let month = 1; month <= 12; month += 1) {
      const total = monthlyTotals[year][month - 1] ?? 0
      const firstAmount = Math.round(total * 0.48)
      const secondAmount = total - firstAmount
      const amounts = [firstAmount, secondAmount] as const
      for (const [index, student] of paymentStudents.entries()) {
        await tx
          .insert(payments)
          .values({
            amount: String(amounts[index] ?? total),
            date: `${year}-${String(month).padStart(2, "0")}-15`,
            id: fixtureUuid(`payment:${year}-${month}:${student.studentId}`),
            method: index === 0 ? "bank_transfer" : "cash",
            receiptNumber: `DASH-${year}-${String(month).padStart(2, "0")}-${index + 1}`,
            status: "paid",
            studentId: student.studentId,
            tenantId,
          })
          .onConflictDoUpdate({
            target: payments.id,
            set: {
              amount: String(amounts[index] ?? total),
              date: `${year}-${String(month).padStart(2, "0")}-15`,
              method: index === 0 ? "bank_transfer" : "cash",
              receiptNumber: `DASH-${year}-${String(month).padStart(2, "0")}-${index + 1}`,
              status: "paid",
              updatedAt: new Date(),
            },
          })
      }
    }
  }
}

async function upsertDashboardNotices(
  tx: DatabaseTransaction,
  tenantId: string,
  createdBy: string
): Promise<void> {
  const entries = [
    {
      priority: "urgent",
      publishDate: "2026-04-01T09:00:00.000Z",
      targetRole: "all",
      title: DASHBOARD_NOTICE_TITLES[0],
    },
    {
      priority: "high",
      publishDate: "2026-03-29T09:00:00.000Z",
      targetRole: "teachers",
      title: DASHBOARD_NOTICE_TITLES[1],
    },
    {
      priority: "medium",
      publishDate: "2026-03-25T09:00:00.000Z",
      targetRole: "all",
      title: DASHBOARD_NOTICE_TITLES[2],
    },
    {
      priority: "low",
      publishDate: "2026-03-21T09:00:00.000Z",
      targetRole: "students",
      title: DASHBOARD_NOTICE_TITLES[3],
    },
  ] as const

  for (const entry of entries) {
    await tx
      .insert(notices)
      .values({
        content: `${DASHBOARD_FIXTURE_PREFIX}: ${entry.title}`,
        createdBy,
        id: fixtureUuid(`notice:${entry.title}`),
        priority: entry.priority,
        publishDate: new Date(entry.publishDate),
        targetRole: entry.targetRole,
        tenantId,
        title: entry.title,
      })
      .onConflictDoUpdate({
        target: notices.id,
        set: {
          content: `${DASHBOARD_FIXTURE_PREFIX}: ${entry.title}`,
          createdBy,
          priority: entry.priority,
          publishDate: new Date(entry.publishDate),
          targetRole: entry.targetRole,
          title: entry.title,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertDashboardEvents(tx: DatabaseTransaction, tenantId: string): Promise<void> {
  const entries = [
    {
      description: `${DASHBOARD_FIXTURE_PREFIX}: parents`,
      endDate: "2026-03-05T11:30:00.000Z",
      location: "Parents Hall",
      startDate: "2026-03-05T10:00:00.000Z",
      title: DASHBOARD_EVENT_TITLES[0],
      type: "other",
    },
    {
      description: `${DASHBOARD_FIXTURE_PREFIX}: sports`,
      endDate: "2026-04-08T12:00:00.000Z",
      location: "All Classes",
      startDate: "2026-04-08T09:00:00.000Z",
      title: DASHBOARD_EVENT_TITLES[1],
      type: "sports",
    },
    {
      description: `${DASHBOARD_FIXTURE_PREFIX}: meeting`,
      endDate: "2026-04-12T16:00:00.000Z",
      location: "7A, 7B",
      startDate: "2026-04-12T14:00:00.000Z",
      title: DASHBOARD_EVENT_TITLES[2],
      type: "academic",
    },
    {
      description: `${DASHBOARD_FIXTURE_PREFIX}: science`,
      endDate: "2026-04-28T17:00:00.000Z",
      location: "All Classes",
      startDate: "2026-04-28T09:00:00.000Z",
      title: DASHBOARD_EVENT_TITLES[3],
      type: "academic",
    },
    {
      description: `${DASHBOARD_FIXTURE_PREFIX}: workshop`,
      endDate: "2026-05-02T13:00:00.000Z",
      location: "Staff Room",
      startDate: "2026-05-02T10:00:00.000Z",
      title: DASHBOARD_EVENT_TITLES[4],
      type: "other",
    },
  ] as const

  for (const entry of entries) {
    await tx
      .insert(events)
      .values({
        description: entry.description,
        endDate: new Date(entry.endDate),
        id: fixtureUuid(`event:${entry.title}`),
        location: entry.location,
        startDate: new Date(entry.startDate),
        tenantId,
        title: entry.title,
        type: entry.type,
      })
      .onConflictDoUpdate({
        target: events.id,
        set: {
          description: entry.description,
          endDate: new Date(entry.endDate),
          location: entry.location,
          startDate: new Date(entry.startDate),
          title: entry.title,
          type: entry.type,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertDashboardActivity(
  tx: DatabaseTransaction,
  tenantId: string,
  schoolAdminUserId: string,
  teacherUserId: string
): Promise<void> {
  const entries = [
    {
      action: "create",
      resource: "students",
      timestamp: "2026-04-04T09:15:00.000Z",
      userId: schoolAdminUserId,
    },
    {
      action: "update",
      resource: "attendance",
      timestamp: "2026-04-04T10:30:00.000Z",
      userId: teacherUserId,
    },
    {
      action: "update",
      resource: "payments",
      timestamp: "2026-04-04T12:45:00.000Z",
      userId: schoolAdminUserId,
    },
    {
      action: "update",
      resource: "events",
      timestamp: "2026-04-04T14:20:00.000Z",
      userId: schoolAdminUserId,
    },
    {
      action: "update",
      resource: "notices",
      timestamp: "2026-04-04T15:40:00.000Z",
      userId: schoolAdminUserId,
    },
  ] as const

  for (const entry of entries) {
    await tx
      .insert(auditLogs)
      .values({
        action: entry.action,
        id: fixtureUuid(`audit:${entry.resource}:${entry.timestamp}`),
        ipAddress: DASHBOARD_FIXTURE_PREFIX,
        resource: entry.resource,
        tenantId,
        timestamp: new Date(entry.timestamp),
        userId: entry.userId,
      })
      .onConflictDoUpdate({
        target: auditLogs.id,
        set: {
          action: entry.action,
          ipAddress: DASHBOARD_FIXTURE_PREFIX,
          resource: entry.resource,
          timestamp: new Date(entry.timestamp),
          userId: entry.userId,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

function fixtureUuid(seed: string): string {
  const hex = createHash("sha1").update(`talimy:${seed}`).digest("hex").slice(0, 32)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

function defaultScoresForGrade(grade: "7" | "8" | "9"): readonly number[] {
  if (grade === "7") return [75, 76, 78, 80, 82, 84, 85, 86, 88, 89, 90, 91]
  if (grade === "8") return [80, 82, 84, 86, 88, 90, 91, 92, 93, 94, 95, 96]
  return [85, 87, 89, 91, 93, 95, 96, 97, 98, 99, 99, 100]
}

function toLetterGrade(score: number): string {
  if (score >= 95) return "A+"
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  return "D"
}
