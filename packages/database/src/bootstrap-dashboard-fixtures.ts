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
  schedules,
  students,
  teacherAttendanceRecords,
  teacherDocuments,
  teacherLeaveRequests,
  teacherPerformanceSnapshots,
  teacherTrainingRecords,
  teacherWorkloadSnapshots,
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

type DashboardTeacherFixture = {
  address: string
  avatar: string
  email: string
  employeeId: string
  employmentType: "full_time" | "part_time" | "substitute"
  firstName: string
  gender: "female" | "male"
  key: string
  lastName: string
  phone: string
  qualification: string
  scienceWeeklyClasses: number
  scienceWeeklyHours: number
  specialization: string
}

const DASHBOARD_FIXTURE_PREFIX = "dashboard-fixture"
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
    studentCode: "7A-101",
  },
  {
    email: "madina.grade7@mezana.talimy.space",
    firstName: "Madina",
    gender: "female",
    grade: "7",
    lastName: "Karimova",
    studentCode: "7A-102",
  },
  {
    email: "temur.grade8@mezana.talimy.space",
    firstName: "Temur",
    gender: "male",
    grade: "8",
    lastName: "Nasriddinov",
    studentCode: "8A-201",
  },
  {
    email: "aziza.grade8@mezana.talimy.space",
    firstName: "Aziza",
    gender: "female",
    grade: "8",
    lastName: "Rasulova",
    studentCode: "8A-202",
  },
  {
    email: "javohir.grade9@mezana.talimy.space",
    firstName: "Javohir",
    gender: "male",
    grade: "9",
    lastName: "Sobirov",
    studentCode: "9A-301",
  },
  {
    email: "dilnoza.grade9@mezana.talimy.space",
    firstName: "Dilnoza",
    gender: "female",
    grade: "9",
    lastName: "Hakimova",
    studentCode: "9A-302",
  },
] as const

const DASHBOARD_TEACHER_FIXTURES: readonly DashboardTeacherFixture[] = [
  {
    address: "14 Regent Street, London, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    email: "rayan.yasmine@mezana.talimy.space",
    employeeId: "TEA-003",
    employmentType: "full_time",
    firstName: "Rayan",
    gender: "male",
    key: "rayan-yasmine",
    lastName: "Yasmine",
    phone: "+62 812 3456 7890",
    qualification: "B.Sc",
    scienceWeeklyClasses: 18,
    scienceWeeklyHours: 11,
    specialization: "Science",
  },
  {
    address: "22 Oxford Road, Manchester, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    email: "aliyah.summer@mezana.talimy.space",
    employeeId: "TEA-004",
    employmentType: "full_time",
    firstName: "Aliyah",
    gender: "female",
    key: "aliyah-summer",
    lastName: "Summer",
    phone: "+62 813 2234 5567",
    qualification: "M.Ed",
    scienceWeeklyClasses: 17,
    scienceWeeklyHours: 10,
    specialization: "Mathematics",
  },
  {
    address: "8 Baker Street, London, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    email: "kelsy.trisha@mezana.talimy.space",
    employeeId: "TEA-005",
    employmentType: "full_time",
    firstName: "Kelsy",
    gender: "female",
    key: "kelsy-trisha",
    lastName: "Trisha",
    phone: "+62 811 5567 2345",
    qualification: "B.A",
    scienceWeeklyClasses: 18,
    scienceWeeklyHours: 12,
    specialization: "Language",
  },
  {
    address: "31 King William St, Bristol, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    email: "zackary.smith@mezana.talimy.space",
    employeeId: "TEA-006",
    employmentType: "part_time",
    firstName: "Zackary",
    gender: "male",
    key: "zackary-smith",
    lastName: "Smith",
    phone: "+62 815 9876 5432",
    qualification: "B.A",
    scienceWeeklyClasses: 17,
    scienceWeeklyHours: 11,
    specialization: "Social",
  },
  {
    address: "45 Camden High St, London, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    email: "javier.quintero@mezana.talimy.space",
    employeeId: "TEA-007",
    employmentType: "full_time",
    firstName: "Javier",
    gender: "male",
    key: "javier-quintero",
    lastName: "Quintero",
    phone: "+62 819 6543 2109",
    qualification: "M.Sc",
    scienceWeeklyClasses: 22,
    scienceWeeklyHours: 11,
    specialization: "Science",
  },
  {
    address: "9 Abbey Road, Liverpool, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    email: "giana.gomez@mezana.talimy.space",
    employeeId: "TEA-008",
    employmentType: "part_time",
    firstName: "Giana",
    gender: "female",
    key: "giana-gomez",
    lastName: "Gomez",
    phone: "+62 817 2233 4455",
    qualification: "B.F.A",
    scienceWeeklyClasses: 23,
    scienceWeeklyHours: 9,
    specialization: "Arts",
  },
  {
    address: "18 Crescent Ave, Leeds, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    email: "miley.addams@mezana.talimy.space",
    employeeId: "TEA-009",
    employmentType: "full_time",
    firstName: "Miley",
    gender: "female",
    key: "miley-addams",
    lastName: "Addams",
    phone: "+62 816 7788 9900",
    qualification: "B.P.Ed",
    scienceWeeklyClasses: 20,
    scienceWeeklyHours: 8,
    specialization: "Physical Education",
  },
  {
    address: "27 Elm Street, Birmingham, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    email: "kaily.jayson@mezana.talimy.space",
    employeeId: "TEA-010",
    employmentType: "substitute",
    firstName: "Kaily",
    gender: "male",
    key: "kaily-jayson",
    lastName: "Jayson",
    phone: "+62 814 6677 8899",
    qualification: "B.Sc",
    scienceWeeklyClasses: 24,
    scienceWeeklyHours: 10,
    specialization: "Science",
  },
  {
    address: "11 Rose Lane, York, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    email: "noah.bennett@mezana.talimy.space",
    employeeId: "TEA-011",
    employmentType: "full_time",
    firstName: "Noah",
    gender: "male",
    key: "noah-bennett",
    lastName: "Bennett",
    phone: "+62 813 0044 5566",
    qualification: "M.Sc",
    scienceWeeklyClasses: 19,
    scienceWeeklyHours: 10,
    specialization: "Science",
  },
  {
    address: "7 Hilltop Road, Cardiff, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    email: "sofia.khan@mezana.talimy.space",
    employeeId: "TEA-012",
    employmentType: "full_time",
    firstName: "Sofia",
    gender: "female",
    key: "sofia-khan",
    lastName: "Khan",
    phone: "+62 814 1122 3344",
    qualification: "B.A",
    scienceWeeklyClasses: 16,
    scienceWeeklyHours: 9,
    specialization: "Language",
  },
  {
    address: "5 Maple Close, Sheffield, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    email: "liam.ortega@mezana.talimy.space",
    employeeId: "TEA-013",
    employmentType: "part_time",
    firstName: "Liam",
    gender: "male",
    key: "liam-ortega",
    lastName: "Ortega",
    phone: "+62 815 7766 5544",
    qualification: "B.Ed",
    scienceWeeklyClasses: 14,
    scienceWeeklyHours: 8,
    specialization: "Social",
  },
  {
    address: "16 Harbour Road, Brighton, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    email: "maya.collins@mezana.talimy.space",
    employeeId: "TEA-014",
    employmentType: "substitute",
    firstName: "Maya",
    gender: "female",
    key: "maya-collins",
    lastName: "Collins",
    phone: "+62 816 2211 4433",
    qualification: "B.Sc",
    scienceWeeklyClasses: 12,
    scienceWeeklyHours: 7,
    specialization: "Mathematics",
  },
  {
    address: "221B Baker Street, London, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    email: "omar.reed@mezana.talimy.space",
    employeeId: "TEA-015",
    employmentType: "full_time",
    firstName: "Omar",
    gender: "male",
    key: "omar-reed",
    lastName: "Reed",
    phone: "+62 817 4455 6677",
    qualification: "B.F.A",
    scienceWeeklyClasses: 15,
    scienceWeeklyHours: 8,
    specialization: "Arts",
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
  const subjectIds = {
    arts: await ensureSubject(tx, context.schoolTenantId, "ART", "Arts"),
    language: await ensureSubject(tx, context.schoolTenantId, "LANG", "Language"),
    mathematics: await ensureSubject(tx, context.schoolTenantId, "MATH", "Mathematics"),
    physicalEducation: await ensureSubject(tx, context.schoolTenantId, "PE", "Physical Education"),
    science: await ensureSubject(tx, context.schoolTenantId, "SCI", "Science"),
    social: await ensureSubject(tx, context.schoolTenantId, "SOC", "Social"),
  } as const
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
    employeeId: "TEA-001",
    employmentType: "full_time",
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
    address: "54 Westminster Road, London, United Kingdom",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    email: "teacher.assistant@mezana.talimy.space",
    firstName: "Saida",
    genderScope: "all",
    isActive: true,
    lastName: "Tursunova",
    passwordHash: context.teacherPasswordHash,
    phone: "+62 818 2345 6789",
    role: "teacher",
    tenantId: context.schoolTenantId,
  })

  const assistantTeacherId = await ensureTeacherProfile(tx, {
    employeeId: "TEA-002",
    employmentType: "part_time",
    gender: "female",
    id: fixtureUuid("teacher-profile-assistant"),
    joinDate: "2025-09-01",
    qualification: "M.Ed",
    specialization: "Science",
    status: "active",
    tenantId: context.schoolTenantId,
    userId: assistantTeacherUserId,
  })

  const extraTeacherRecords = await Promise.all(
    DASHBOARD_TEACHER_FIXTURES.map(async (fixture) => {
      const userId = await upsertUser(tx, {
        address: fixture.address,
        avatar: fixture.avatar,
        email: fixture.email,
        firstName: fixture.firstName,
        genderScope: "all",
        isActive: true,
        lastName: fixture.lastName,
        passwordHash: context.teacherPasswordHash,
        phone: fixture.phone,
        role: "teacher",
        tenantId: context.schoolTenantId,
      })

      const teacherId = await ensureTeacherProfile(tx, {
        employeeId: fixture.employeeId,
        employmentType: fixture.employmentType,
        gender: fixture.gender,
        id: fixtureUuid(`teacher-profile:${fixture.key}`),
        joinDate: "2025-09-01",
        qualification: fixture.qualification,
        specialization: fixture.specialization,
        status: "active",
        tenantId: context.schoolTenantId,
        userId,
      })

      return {
        employeeId: fixture.employeeId,
        firstName: fixture.firstName,
        id: teacherId,
        lastName: fixture.lastName,
        scienceWeeklyClasses: fixture.scienceWeeklyClasses,
        scienceWeeklyHours: fixture.scienceWeeklyHours,
        specialization: fixture.specialization,
      }
    })
  )

  const teacherRecords = [
    {
      firstName: "Main",
      id: primaryTeacherId,
      lastName: "Teacher",
      employeeId: "TEA-001",
      scienceWeeklyClasses: 16,
      scienceWeeklyHours: 10,
      specialization: "Mathematics",
    },
    {
      firstName: "Saida",
      id: assistantTeacherId,
      lastName: "Tursunova",
      employeeId: "TEA-002",
      scienceWeeklyClasses: 18,
      scienceWeeklyHours: 9,
      specialization: "Science",
    },
    ...extraTeacherRecords,
  ] as const

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
    subjectIds.mathematics,
    termIds,
    studentRecords
  )
  await upsertTeacherSchedules(tx, context.schoolTenantId, classIds, subjectIds, teacherRecords)
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
  await upsertTeacherDetailFixtures(tx, context.schoolTenantId, teacherRecords)
}

async function upsertUser(tx: DatabaseTransaction, payload: UserInsert): Promise<string> {
  const [row] = await tx
    .insert(users)
    .values(payload)
    .onConflictDoUpdate({
      target: users.email,
      set: {
        address: payload.address ?? null,
        avatar: payload.avatar ?? null,
        firstName: payload.firstName,
        genderScope: payload.genderScope ?? "all",
        isActive: true,
        lastName: payload.lastName,
        passwordHash: payload.passwordHash,
        phone: payload.phone ?? null,
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
  if (existing) {
    await tx
      .update(teachers)
      .set({
        employeeId: payload.employeeId,
        employmentType: payload.employmentType,
        gender: payload.gender,
        joinDate: payload.joinDate,
        qualification: payload.qualification,
        specialization: payload.specialization,
        status: payload.status,
        updatedAt: new Date(),
        deletedAt: null,
      })
      .where(eq(teachers.id, existing.id))
    return existing.id
  }
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

async function upsertTeacherSchedules(
  tx: DatabaseTransaction,
  tenantId: string,
  classIds: { grade7: string; grade8: string; grade9: string },
  subjectIds: {
    arts: string
    language: string
    mathematics: string
    physicalEducation: string
    science: string
    social: string
  },
  teacherRecords: ReadonlyArray<{
    firstName: string
    id: string
    lastName: string
    scienceWeeklyClasses: number
    scienceWeeklyHours: number
    specialization: string
  }>
): Promise<void> {
  for (const teacher of teacherRecords) {
    await upsertWeeklyScheduleSet(tx, {
      classIds,
      seedKey: `${teacher.id}:science`,
      subjectId: subjectIds.science,
      teacherId: teacher.id,
      tenantId,
      totalClasses: teacher.scienceWeeklyClasses,
      totalHours: teacher.scienceWeeklyHours,
    })

    await upsertWeeklyScheduleSet(tx, {
      classIds,
      seedKey: `${teacher.id}:mathematics`,
      subjectId: subjectIds.mathematics,
      teacherId: teacher.id,
      tenantId,
      totalClasses: Math.max(10, teacher.scienceWeeklyClasses - 6),
      totalHours: Math.max(6, teacher.scienceWeeklyHours - 2),
    })

    const specializationSubjectId = resolveSpecializationSubjectId(
      subjectIds,
      teacher.specialization
    )
    if (
      specializationSubjectId !== subjectIds.science &&
      specializationSubjectId !== subjectIds.mathematics
    ) {
      await upsertWeeklyScheduleSet(tx, {
        classIds,
        seedKey: `${teacher.id}:specialization`,
        subjectId: specializationSubjectId,
        teacherId: teacher.id,
        tenantId,
        totalClasses: 6,
        totalHours: 4,
      })
    }
  }
}

async function upsertWeeklyScheduleSet(
  tx: DatabaseTransaction,
  payload: {
    classIds: { grade7: string; grade8: string; grade9: string }
    seedKey: string
    subjectId: string
    teacherId: string
    tenantId: string
    totalClasses: number
    totalHours: number
  }
): Promise<void> {
  const classSequence = [
    payload.classIds.grade7,
    payload.classIds.grade8,
    payload.classIds.grade9,
  ] as const
  const slotSequence = [
    { dayOfWeek: "monday", startMinutes: 540 },
    { dayOfWeek: "wednesday", startMinutes: 540 },
    { dayOfWeek: "friday", startMinutes: 540 },
    { dayOfWeek: "tuesday", startMinutes: 600 },
    { dayOfWeek: "thursday", startMinutes: 600 },
    { dayOfWeek: "wednesday", startMinutes: 660 },
    { dayOfWeek: "monday", startMinutes: 810 },
    { dayOfWeek: "thursday", startMinutes: 810 },
    { dayOfWeek: "friday", startMinutes: 810 },
    { dayOfWeek: "tuesday", startMinutes: 540 },
    { dayOfWeek: "wednesday", startMinutes: 600 },
    { dayOfWeek: "thursday", startMinutes: 540 },
    { dayOfWeek: "friday", startMinutes: 600 },
    { dayOfWeek: "monday", startMinutes: 600 },
    { dayOfWeek: "tuesday", startMinutes: 810 },
    { dayOfWeek: "monday", startMinutes: 660 },
    { dayOfWeek: "tuesday", startMinutes: 660 },
    { dayOfWeek: "wednesday", startMinutes: 810 },
    { dayOfWeek: "thursday", startMinutes: 660 },
    { dayOfWeek: "friday", startMinutes: 660 },
    { dayOfWeek: "monday", startMinutes: 870 },
    { dayOfWeek: "tuesday", startMinutes: 870 },
    { dayOfWeek: "wednesday", startMinutes: 870 },
    { dayOfWeek: "thursday", startMinutes: 870 },
    { dayOfWeek: "friday", startMinutes: 870 },
  ] as const
  const durationMinutes = Math.max(25, Math.round((payload.totalHours * 60) / payload.totalClasses))

  for (let index = 0; index < payload.totalClasses; index += 1) {
    const slot = slotSequence[index % slotSequence.length] ?? slotSequence[0]
    const dayOfWeek = slot?.dayOfWeek ?? "monday"
    const startMinutes = slot?.startMinutes ?? 540
    const endMinutes = startMinutes + durationMinutes
    const classId = classSequence[index % classSequence.length] ?? classSequence[0]
    const scheduleId = fixtureUuid(`schedule:${payload.seedKey}:${index}`)
    const roomLabel = `R-${(index % 6) + 1}`

    await tx
      .insert(schedules)
      .values({
        classId,
        dayOfWeek,
        endTime: formatScheduleTime(endMinutes),
        id: scheduleId,
        room: roomLabel,
        startTime: formatScheduleTime(startMinutes),
        subjectId: payload.subjectId,
        teacherId: payload.teacherId,
        tenantId: payload.tenantId,
      })
      .onConflictDoUpdate({
        target: schedules.id,
        set: {
          classId,
          dayOfWeek,
          endTime: formatScheduleTime(endMinutes),
          room: roomLabel,
          startTime: formatScheduleTime(startMinutes),
          subjectId: payload.subjectId,
          teacherId: payload.teacherId,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
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

async function upsertTeacherDetailFixtures(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherRecords: ReadonlyArray<{
    employeeId: string
    firstName: string
    id: string
    lastName: string
    scienceWeeklyClasses: number
    scienceWeeklyHours: number
    specialization: string
  }>
): Promise<void> {
  for (const [index, teacher] of teacherRecords.entries()) {
    await upsertTeacherDocumentsSet(tx, tenantId, teacher)
    await upsertTeacherWorkloadSnapshotsSet(tx, tenantId, teacher, index)
    await upsertTeacherTrainingSet(tx, tenantId, teacher, index)
    await upsertTeacherAttendanceCalendarSet(tx, tenantId, teacher.id)
    await upsertTeacherLeaveRequestsSet(tx, tenantId, teacher.id)
    await upsertTeacherPerformanceSet(tx, tenantId, teacher.id, index)
  }
}

async function upsertTeacherDocumentsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacher: {
    employeeId: string
    firstName: string
    id: string
    lastName: string
    specialization: string
  }
): Promise<void> {
  const compactName = `${teacher.firstName}${teacher.lastName}`.replace(/\s+/g, "")
  const subjectKey = teacher.specialization.replace(/\s+/g, "")
  const items = [
    {
      fileName: `Employment_Contract_${compactName}_${teacher.employeeId}.pdf`,
      key: "employment-contract",
      sizeBytes: 2_400_000,
    },
    {
      fileName: `Certification_${subjectKey}_${compactName}.pdf`,
      key: "certification",
      sizeBytes: 1_800_000,
    },
    {
      fileName: `ID_Passport_${compactName}_${teacher.employeeId}.pdf`,
      key: "passport",
      sizeBytes: 2_200_000,
    },
  ] as const

  for (const item of items) {
    await tx
      .insert(teacherDocuments)
      .values({
        fileName: item.fileName,
        id: fixtureUuid(`teacher-document:${teacher.id}:${item.key}`),
        mimeType: "application/pdf",
        sizeBytes: item.sizeBytes,
        storageKey: `teachers/${teacher.id}/documents/${item.fileName}`,
        teacherId: teacher.id,
        tenantId,
      })
      .onConflictDoUpdate({
        target: teacherDocuments.id,
        set: {
          fileName: item.fileName,
          mimeType: "application/pdf",
          sizeBytes: item.sizeBytes,
          storageKey: `teachers/${teacher.id}/documents/${item.fileName}`,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertTeacherWorkloadSnapshotsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacher: {
    id: string
    scienceWeeklyClasses: number
    scienceWeeklyHours: number
  },
  teacherIndex: number
): Promise<void> {
  const extraOffset = teacherIndex % 4
  const datasets = [
    {
      dataset: "last_8_months",
      seed: [
        {
          extraDuties: 32,
          label: "Jul",
          periodDate: "2034-07-01",
          teachingHours: 104,
          totalClasses: 122,
        },
        {
          extraDuties: 36,
          label: "Aug",
          periodDate: "2034-08-01",
          teachingHours: 96,
          totalClasses: 136,
        },
        {
          extraDuties: 24,
          label: "Sep",
          periodDate: "2034-09-01",
          teachingHours: 98,
          totalClasses: 118,
        },
        {
          extraDuties: 32,
          label: "Oct",
          periodDate: "2034-10-01",
          teachingHours: 134,
          totalClasses: 149,
        },
        {
          extraDuties: 18,
          label: "Nov",
          periodDate: "2034-11-01",
          teachingHours: 110,
          totalClasses: 109,
        },
        {
          extraDuties: 28,
          label: "Dec",
          periodDate: "2034-12-01",
          teachingHours: 104,
          totalClasses: 123,
        },
        {
          extraDuties: 42,
          label: "Jan",
          periodDate: "2035-01-01",
          teachingHours: 128,
          totalClasses: 134,
        },
        {
          extraDuties: 38,
          label: "Feb",
          periodDate: "2035-02-01",
          teachingHours: 96,
          totalClasses: 142,
        },
      ] as const,
    },
    {
      dataset: "this_semester",
      seed: [
        {
          extraDuties: 26,
          label: "Sep",
          periodDate: "2034-09-01",
          teachingHours: 102,
          totalClasses: 118,
        },
        {
          extraDuties: 32,
          label: "Oct",
          periodDate: "2034-10-01",
          teachingHours: 134,
          totalClasses: 149,
        },
        {
          extraDuties: 24,
          label: "Nov",
          periodDate: "2034-11-01",
          teachingHours: 116,
          totalClasses: 128,
        },
        {
          extraDuties: 22,
          label: "Dec",
          periodDate: "2034-12-01",
          teachingHours: 108,
          totalClasses: 121,
        },
        {
          extraDuties: 37,
          label: "Jan",
          periodDate: "2035-01-01",
          teachingHours: 126,
          totalClasses: 138,
        },
        {
          extraDuties: 34,
          label: "Feb",
          periodDate: "2035-02-01",
          teachingHours: 118,
          totalClasses: 132,
        },
        {
          extraDuties: 36,
          label: "Mar",
          periodDate: "2035-03-01",
          teachingHours: 122,
          totalClasses: 140,
        },
        {
          extraDuties: 31,
          label: "Apr",
          periodDate: "2035-04-01",
          teachingHours: 120,
          totalClasses: 136,
        },
      ] as const,
    },
  ] as const

  for (const dataset of datasets) {
    for (const [sortOrder, item] of dataset.seed.entries()) {
      await tx
        .insert(teacherWorkloadSnapshots)
        .values({
          dataset: dataset.dataset,
          extraDuties: Math.max(12, item.extraDuties - extraOffset),
          id: fixtureUuid(`teacher-workload:${teacher.id}:${dataset.dataset}:${item.periodDate}`),
          label: item.label,
          periodDate: item.periodDate,
          sortOrder,
          teacherId: teacher.id,
          teachingHours: Math.max(
            teacher.scienceWeeklyHours * 8,
            item.teachingHours - extraOffset * 2
          ),
          tenantId,
          totalClasses: Math.max(
            teacher.scienceWeeklyClasses * 6,
            item.totalClasses - extraOffset * 3
          ),
        })
        .onConflictDoUpdate({
          target: teacherWorkloadSnapshots.id,
          set: {
            dataset: dataset.dataset,
            extraDuties: Math.max(12, item.extraDuties - extraOffset),
            label: item.label,
            periodDate: item.periodDate,
            sortOrder,
            teachingHours: Math.max(
              teacher.scienceWeeklyHours * 8,
              item.teachingHours - extraOffset * 2
            ),
            totalClasses: Math.max(
              teacher.scienceWeeklyClasses * 6,
              item.totalClasses - extraOffset * 3
            ),
            updatedAt: new Date(),
            deletedAt: null,
          },
        })
    }
  }
}

async function upsertTeacherTrainingSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacher: {
    id: string
    specialization: string
  },
  teacherIndex: number
): Promise<void> {
  const currentSemesterRecords = [
    {
      eventDate: "2035-04-02",
      locationLabel: "Zoom - International Education Network",
      status: "upcoming",
      subtitle: "Training",
      title: `${teacher.specialization} Digital Learning Tools Training`,
    },
    {
      eventDate: "2035-02-08",
      locationLabel: "Cambridge University Online (UK)",
      status: "completed",
      subtitle: "Certification",
      title: "Classroom Management Certification",
    },
    {
      eventDate: "2035-01-12",
      locationLabel: "London, UK - British Council",
      status: "completed",
      subtitle: "Workshop",
      title: `Advanced ${teacher.specialization} Teaching Methods`,
    },
  ] as const

  const previousSemesterRecords = [
    {
      eventDate: "2034-11-19",
      locationLabel: "Singapore - Teaching Future Forum",
      status: "completed",
      subtitle: "Conference",
      title: "Inclusive Classroom Strategies",
    },
    {
      eventDate: "2034-10-02",
      locationLabel: "Oxford Online Campus",
      status: "completed",
      subtitle: "Certification",
      title: "Assessment Design Fundamentals",
    },
    {
      eventDate: "2034-09-15",
      locationLabel: "Talimy Academy Hub",
      status: teacherIndex % 3 === 0 ? "cancelled" : "completed",
      subtitle: "Workshop",
      title: "STEM Lesson Planning Intensive",
    },
  ] as const

  for (const [semester, records] of [
    ["current", currentSemesterRecords],
    ["previous", previousSemesterRecords],
  ] as const) {
    for (const [index, record] of records.entries()) {
      await tx
        .insert(teacherTrainingRecords)
        .values({
          eventDate: record.eventDate,
          id: fixtureUuid(`teacher-training:${teacher.id}:${semester}:${index}`),
          locationLabel: record.locationLabel,
          semester,
          status: record.status,
          subtitle: record.subtitle,
          teacherId: teacher.id,
          tenantId,
          title: record.title,
        })
        .onConflictDoUpdate({
          target: teacherTrainingRecords.id,
          set: {
            eventDate: record.eventDate,
            locationLabel: record.locationLabel,
            semester,
            status: record.status,
            subtitle: record.subtitle,
            title: record.title,
            updatedAt: new Date(),
            deletedAt: null,
          },
        })
    }
  }
}

async function upsertTeacherAttendanceCalendarSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherId: string
): Promise<void> {
  const attendanceByMonth = {
    "2035-02": {
      3: "present",
      6: "late",
      8: "present",
      11: "present",
      13: "on_leave",
      14: "present",
      18: "late",
      19: "present",
      20: "present",
      24: "present",
      26: "late",
    },
    "2035-03": {
      1: "present",
      2: "on_leave",
      5: "late",
      6: "present",
      7: "late",
      8: "present",
      9: "present",
      12: "late",
      13: "present",
      14: "on_leave",
      15: "present",
      16: "present",
      19: "present",
      20: "present",
      21: "present",
      22: "late",
      23: "present",
    },
    "2035-04": {
      2: "present",
      4: "present",
      5: "late",
      10: "present",
      12: "on_leave",
      15: "late",
      18: "present",
      21: "present",
      22: "present",
      24: "late",
      29: "present",
    },
  } as const

  for (const [monthKey, records] of Object.entries(attendanceByMonth)) {
    for (const [day, status] of Object.entries(records)) {
      const isoDate = `${monthKey}-${String(day).padStart(2, "0")}`
      await tx
        .insert(teacherAttendanceRecords)
        .values({
          date: isoDate,
          id: fixtureUuid(`teacher-attendance:${teacherId}:${isoDate}`),
          note: `${DASHBOARD_FIXTURE_PREFIX}: teacher-attendance`,
          status,
          teacherId,
          tenantId,
        })
        .onConflictDoUpdate({
          target: teacherAttendanceRecords.id,
          set: {
            note: `${DASHBOARD_FIXTURE_PREFIX}: teacher-attendance`,
            status,
            updatedAt: new Date(),
            deletedAt: null,
          },
        })
    }
  }
}

async function upsertTeacherLeaveRequestsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherId: string
): Promise<void> {
  const entries = [
    {
      endDate: "2035-03-13",
      key: "pending-sick",
      reason: "Fever and medical rest advised by doctor",
      requestType: "sick_leave",
      startDate: "2035-03-11",
      status: "pending",
    },
    {
      endDate: "2035-02-22",
      key: "approved-personal",
      reason: "Family event and travel arrangements",
      requestType: "personal_leave",
      startDate: "2035-02-20",
      status: "approved",
    },
  ] as const

  for (const entry of entries) {
    await tx
      .insert(teacherLeaveRequests)
      .values({
        endDate: entry.endDate,
        id: fixtureUuid(`teacher-leave-request:${teacherId}:${entry.key}`),
        reason: entry.reason,
        requestType: entry.requestType,
        startDate: entry.startDate,
        status: entry.status,
        teacherId,
        tenantId,
      })
      .onConflictDoUpdate({
        target: teacherLeaveRequests.id,
        set: {
          endDate: entry.endDate,
          reason: entry.reason,
          requestType: entry.requestType,
          startDate: entry.startDate,
          status: entry.status,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertTeacherPerformanceSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherId: string,
  teacherIndex: number
): Promise<void> {
  const offset = teacherIndex % 4
  const entries = [
    {
      gradingTimelinessTarget: 90,
      gradingTimelinessValue: 95 - offset,
      period: "last_month",
      studentAverageGradeTarget: 90,
      studentAverageGradeValue: 85 - offset,
      studentFeedbackTarget: 85,
      studentFeedbackValue: 78 - offset,
    },
    {
      gradingTimelinessTarget: 90,
      gradingTimelinessValue: 93 - offset,
      period: "last_quarter",
      studentAverageGradeTarget: 90,
      studentAverageGradeValue: 84 - offset,
      studentFeedbackTarget: 85,
      studentFeedbackValue: 79 - offset,
    },
  ] as const

  for (const entry of entries) {
    await tx
      .insert(teacherPerformanceSnapshots)
      .values({
        gradingTimelinessTarget: entry.gradingTimelinessTarget,
        gradingTimelinessValue: entry.gradingTimelinessValue,
        id: fixtureUuid(`teacher-performance:${teacherId}:${entry.period}`),
        period: entry.period,
        studentAverageGradeTarget: entry.studentAverageGradeTarget,
        studentAverageGradeValue: entry.studentAverageGradeValue,
        studentFeedbackTarget: entry.studentFeedbackTarget,
        studentFeedbackValue: entry.studentFeedbackValue,
        teacherId,
        tenantId,
      })
      .onConflictDoUpdate({
        target: teacherPerformanceSnapshots.id,
        set: {
          gradingTimelinessTarget: entry.gradingTimelinessTarget,
          gradingTimelinessValue: entry.gradingTimelinessValue,
          period: entry.period,
          studentAverageGradeTarget: entry.studentAverageGradeTarget,
          studentAverageGradeValue: entry.studentAverageGradeValue,
          studentFeedbackTarget: entry.studentFeedbackTarget,
          studentFeedbackValue: entry.studentFeedbackValue,
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

function formatScheduleTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`
}

function resolveSpecializationSubjectId(
  subjectIds: {
    arts: string
    language: string
    mathematics: string
    physicalEducation: string
    science: string
    social: string
  },
  specialization: string
): string {
  switch (specialization) {
    case "Arts":
      return subjectIds.arts
    case "Language":
      return subjectIds.language
    case "Mathematics":
      return subjectIds.mathematics
    case "Physical Education":
      return subjectIds.physicalEducation
    case "Science":
      return subjectIds.science
    case "Social":
      return subjectIds.social
    default:
      return subjectIds.science
  }
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
