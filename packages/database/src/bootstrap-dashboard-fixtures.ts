import { createHash } from "node:crypto"
import type { InferInsertModel } from "drizzle-orm"
import { and, eq, isNull } from "drizzle-orm"

import type { DatabaseTransaction } from "./bootstrap"
import {
  auditLogs,
  attendance,
  classes,
  events,
  financeExpenses,
  financeReimbursements,
  grades,
  notices,
  parentStudent,
  parents,
  payments,
  schedules,
  studentBehaviorLogs,
  studentDocuments,
  studentExtracurricularRecords,
  studentHealthRecords,
  studentScholarships,
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
type ParentInsert = InferInsertModel<typeof parents>

type DashboardFixtureContext = {
  academicYearId: string
  parentPasswordHash: string
  schoolAdminUserId: string
  schoolTenantId: string
  studentPasswordHash: string
  teacherPasswordHash: string
  teacherUserId: string
}

type DashboardStudentFixture = {
  address: string
  avatar: string
  dateOfBirth: string
  email: string
  firstName: string
  gender: "female" | "male"
  grade: "7" | "8" | "9"
  lastName: string
  phone: string
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
    address: "21 Amir Temur Street, Tashkent, Uzbekistan",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    dateOfBirth: "2022-05-18",
    email: "abdulloh.grade7@mezana.talimy.space",
    firstName: "Abdulloh",
    gender: "male",
    grade: "7",
    lastName: "Jalolov",
    phone: "+998 90 111 2233",
    studentCode: "7A-101",
  },
  {
    address: "42 Mustaqillik Avenue, Samarkand, Uzbekistan",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    dateOfBirth: "2022-08-14",
    email: "madina.grade7@mezana.talimy.space",
    firstName: "Madina",
    gender: "female",
    grade: "7",
    lastName: "Karimova",
    phone: "+998 91 222 3344",
    studentCode: "7A-102",
  },
  {
    address: "9 Istiqlol Road, Bukhara, Uzbekistan",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    dateOfBirth: "2021-11-06",
    email: "temur.grade8@mezana.talimy.space",
    firstName: "Temur",
    gender: "male",
    grade: "8",
    lastName: "Nasriddinov",
    phone: "+998 93 333 4455",
    studentCode: "8A-201",
  },
  {
    address: "18 Alisher Navoiy Street, Khiva, Uzbekistan",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    dateOfBirth: "2021-03-25",
    email: "aziza.grade8@mezana.talimy.space",
    firstName: "Aziza",
    gender: "female",
    grade: "8",
    lastName: "Rasulova",
    phone: "+998 94 444 5566",
    studentCode: "8A-202",
  },
  {
    address: "77 Bobur Street, Andijan, Uzbekistan",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    dateOfBirth: "2020-09-09",
    email: "javohir.grade9@mezana.talimy.space",
    firstName: "Javohir",
    gender: "male",
    grade: "9",
    lastName: "Sobirov",
    phone: "+998 95 555 6677",
    studentCode: "9A-301",
  },
  {
    address: "5 Shahrisabz Avenue, Fergana, Uzbekistan",
    avatar: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    dateOfBirth: "2020-12-19",
    email: "dilnoza.grade9@mezana.talimy.space",
    firstName: "Dilnoza",
    gender: "female",
    grade: "9",
    lastName: "Hakimova",
    phone: "+998 97 666 7788",
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
        address: fixture.address,
        avatar: fixture.avatar,
        email: fixture.email,
        firstName: fixture.firstName,
        genderScope: "all",
        isActive: true,
        lastName: fixture.lastName,
        passwordHash: context.studentPasswordHash,
        phone: fixture.phone,
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
        address: fixture.address,
        classId,
        dateOfBirth: fixture.dateOfBirth,
        enrollmentDate: "2025-09-01",
        gender: fixture.gender,
        id: fixtureUuid(`student-profile:${fixture.studentCode}`),
        status: "active",
        studentId: fixture.studentCode,
        tenantId: context.schoolTenantId,
        userId,
      })

      return {
        avatar: fixture.avatar,
        classId,
        email: fixture.email,
        firstName: fixture.firstName,
        grade: fixture.grade,
        lastName: fixture.lastName,
        phone: fixture.phone,
        studentCode: fixture.studentCode,
        studentId,
        userId,
      }
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
  await upsertDashboardFinanceExpenses(tx, context.schoolTenantId)
  await upsertDashboardFinanceReimbursements(tx, context.schoolTenantId)
  await upsertDashboardNotices(tx, context.schoolTenantId, context.schoolAdminUserId)
  await upsertDashboardEvents(tx, context.schoolTenantId)
  await upsertAdminCalendarEvents(tx, context.schoolTenantId)
  await upsertDashboardActivity(
    tx,
    context.schoolTenantId,
    context.schoolAdminUserId,
    context.teacherUserId
  )
  await upsertTeacherDetailFixtures(tx, context.schoolTenantId, teacherRecords)
  await upsertStudentDetailFixtures(
    tx,
    context.schoolTenantId,
    context.parentPasswordHash,
    primaryTeacherId,
    studentRecords
  )
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

async function ensureParentProfile(
  tx: DatabaseTransaction,
  payload: ParentInsert
): Promise<string> {
  const [existing] = await tx
    .select({ id: parents.id })
    .from(parents)
    .where(and(eq(parents.userId, payload.userId), isNull(parents.deletedAt)))
    .limit(1)

  if (existing) {
    await tx
      .update(parents)
      .set({
        address: payload.address ?? null,
        occupation: payload.occupation ?? null,
        phone: payload.phone ?? null,
        relationship: payload.relationship,
        updatedAt: new Date(),
        deletedAt: null,
      })
      .where(eq(parents.id, existing.id))

    return existing.id
  }

  const [created] = await tx.insert(parents).values(payload).returning({ id: parents.id })

  if (!created) {
    throw new Error(`Failed to create parent profile ${payload.userId}`)
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

  if (existing) {
    return
  }

  await tx.insert(parentStudent).values({
    id: fixtureUuid(`parent-student:${parentId}:${studentId}`),
    parentId,
    studentId,
    tenantId,
  })
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

async function upsertAdminCalendarEvents(tx: DatabaseTransaction, tenantId: string): Promise<void> {
  const entries = [
    {
      description: "Submission deadline for the monthly science project brief.",
      endDate: "2035-03-01T11:00:00+03:00",
      location: "Room 204",
      seed: "science-project-deadline",
      startDate: "2035-03-01T10:00:00+03:00",
      title: "Science Project Submission Deadline",
      type: "academic",
      visibility: "students",
    },
    {
      description: "Review expense approvals and confirm current month cash flow.",
      endDate: "2035-03-01T16:00:00+03:00",
      location: "Admin Office",
      seed: "monthly-expense-review",
      startDate: "2035-03-01T15:00:00+03:00",
      title: "Monthly Expense Review",
      type: "finance",
      visibility: "admin",
    },
    {
      description: "Preliminary fixtures for the inter-school sports competition.",
      endDate: "2035-03-06T12:00:00+03:00",
      location: "Sports Arena",
      seed: "sports-competition-preliminary",
      startDate: "2035-03-06T08:30:00+03:00",
      title: "Sports Competition (Preliminary Round)",
      type: "events",
      visibility: "all",
    },
    {
      description: "Grade-wide midterm assessment for mathematics.",
      endDate: "2035-03-07T11:00:00+03:00",
      location: "Hall A",
      seed: "midterm-mathematics",
      startDate: "2035-03-07T09:00:00+03:00",
      title: "Midterm Exam - Mathematics",
      type: "academic",
      visibility: "students",
    },
    {
      description: "Weekly staff alignment on school operations and upcoming events.",
      endDate: "2035-03-07T15:30:00+03:00",
      location: "Conference Room",
      seed: "staff-meeting",
      startDate: "2035-03-07T14:00:00+03:00",
      title: "Staff Meeting",
      type: "administration",
      visibility: "teachers",
    },
    {
      description: "Professional development session for classroom facilitation.",
      endDate: "2035-03-09T17:00:00+03:00",
      location: "Staff Lounge",
      seed: "teacher-development-workshop",
      startDate: "2035-03-09T13:00:00+03:00",
      title: "Teacher Development Workshop",
      type: "administration",
      visibility: "teachers",
    },
    {
      description: "Written assessment for the English Literature course.",
      endDate: "2035-03-12T11:00:00+03:00",
      location: "Room 210",
      seed: "english-literature-exam",
      startDate: "2035-03-12T09:00:00+03:00",
      title: "English Literature Exam",
      type: "academic",
      visibility: "students",
    },
    {
      description: "Parents are requested to arrive 15 minutes early for registration.",
      endDate: "2035-03-12T16:00:00+03:00",
      location: "School Auditorium",
      seed: "parent-teacher-meeting",
      startDate: "2035-03-12T14:00:00+03:00",
      title: "Parent-Teacher Meeting (Grade 7 & 8)",
      type: "events",
      visibility: "all",
    },
    {
      description: "Final reminder for Grade 9 semester fee payments.",
      endDate: "2035-03-23T18:00:00+03:00",
      location: "Finance Office",
      seed: "grade-9-fee-payment-deadline",
      startDate: "2035-03-23T08:00:00+03:00",
      title: "Grade 9 Fee Payment Deadline",
      type: "finance",
      visibility: "students",
    },
    {
      description: "Showcase of research projects and innovation prototypes.",
      endDate: "2035-03-26T17:00:00+03:00",
      location: "Exhibition Hall",
      seed: "annual-science-fair",
      startDate: "2035-03-26T09:00:00+03:00",
      title: "Annual Science Fair",
      type: "events",
      visibility: "all",
    },
    {
      description: "Quarterly review of school performance and department action items.",
      endDate: "2035-03-28T15:00:00+03:00",
      location: "Board Room",
      seed: "quarterly-performance-review",
      startDate: "2035-03-28T13:00:00+03:00",
      title: "Quarterly Performance Review Meeting",
      type: "administration",
      visibility: "admin",
    },
    {
      description: "Chemistry final exam for upper-grade students.",
      endDate: "2035-03-29T10:30:00+03:00",
      location: "Lab B",
      seed: "final-exam-chemistry",
      startDate: "2035-03-29T08:30:00+03:00",
      title: "Final Exam - Chemistry",
      type: "academic",
      visibility: "students",
    },
  ] as const

  for (const entry of entries) {
    await tx
      .insert(events)
      .values({
        description: entry.description,
        endDate: new Date(entry.endDate),
        id: fixtureUuid(`admin-calendar-event:${entry.seed}`),
        location: entry.location,
        startDate: new Date(entry.startDate),
        tenantId,
        title: entry.title,
        type: entry.type,
        visibility: entry.visibility,
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
          visibility: entry.visibility,
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

async function upsertStudentDetailFixtures(
  tx: DatabaseTransaction,
  tenantId: string,
  parentPasswordHash: string,
  teacherId: string,
  studentRecords: ReadonlyArray<{
    avatar: string
    classId: string
    email: string
    firstName: string
    grade: "7" | "8" | "9"
    lastName: string
    phone: string
    studentCode: string
    studentId: string
    userId: string
  }>
): Promise<void> {
  for (const [index, student] of studentRecords.entries()) {
    await upsertStudentParentsSet(tx, tenantId, parentPasswordHash, student, index)
    await upsertStudentDocumentsSet(tx, tenantId, student)
    await upsertStudentAttendanceCalendarSet(tx, tenantId, teacherId, student, index)
    await upsertStudentScholarshipsSet(tx, tenantId, student.studentId, index)
    await upsertStudentHealthSet(tx, tenantId, student.studentId)
    await upsertStudentExtracurricularSet(tx, tenantId, student.studentId)
    await upsertStudentBehaviorLogsSet(tx, tenantId, student.studentId)
  }
}

async function upsertStudentParentsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  parentPasswordHash: string,
  student: {
    firstName: string
    lastName: string
    studentCode: string
    studentId: string
  },
  studentIndex: number
): Promise<void> {
  const fatherFirstNames = ["Akmal", "Jasur", "Sardor", "Bekzod", "Rustam", "Anvar"] as const
  const motherFirstNames = ["Saida", "Nilufar", "Madina", "Shahnoza", "Dilbar", "Malika"] as const
  const guardianFirstNames = ["Maftuna", "Feruza", "Ozoda", "Lola", "Gulnoza", "Nodira"] as const
  const fatherFirstName = fatherFirstNames[studentIndex % fatherFirstNames.length] ?? "Akmal"
  const motherFirstName = motherFirstNames[studentIndex % motherFirstNames.length] ?? "Saida"
  const guardianFirstName =
    guardianFirstNames[studentIndex % guardianFirstNames.length] ?? "Maftuna"
  const compactCode = student.studentCode.toLowerCase()
  const entries = [
    {
      email: `${compactCode}.father@mezana.talimy.space`,
      firstName: fatherFirstName,
      phone: `+998 90 70${studentIndex} 110${studentIndex}`,
      relationship: "father",
    },
    {
      email: `${compactCode}.mother@mezana.talimy.space`,
      firstName: motherFirstName,
      phone: `+998 90 80${studentIndex} 220${studentIndex}`,
      relationship: "mother",
    },
    {
      email: `${compactCode}.guardian@mezana.talimy.space`,
      firstName: guardianFirstName,
      phone: `+998 90 90${studentIndex} 330${studentIndex}`,
      relationship: "aunt",
    },
  ] as const

  for (const entry of entries) {
    const userId = await upsertUser(tx, {
      address: `${student.lastName} family, ${student.firstName} residence`,
      email: entry.email,
      firstName: entry.firstName,
      genderScope: "all",
      isActive: true,
      lastName: student.lastName,
      passwordHash: parentPasswordHash,
      phone: entry.phone,
      role: "parent",
      tenantId,
    })

    const parentId = await ensureParentProfile(tx, {
      address: `${student.lastName} family, ${student.firstName} residence`,
      id: fixtureUuid(`parent-profile:${student.studentId}:${entry.relationship}`),
      occupation: entry.relationship === "father" ? "Engineer" : "Teacher",
      phone: entry.phone,
      relationship: entry.relationship,
      tenantId,
      userId,
    })

    await ensureParentStudentRelation(tx, tenantId, parentId, student.studentId)
  }
}

async function upsertStudentDocumentsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  student: {
    firstName: string
    lastName: string
    studentCode: string
    studentId: string
  }
): Promise<void> {
  const compactName = `${student.firstName}${student.lastName}`.replace(/\s+/g, "")
  const items = [
    {
      documentType: "report_card",
      fileName: `ReportCard_${compactName}_${student.studentCode}.pdf`,
      key: "report-card",
      sizeBytes: 2_400_000,
    },
    {
      documentType: "certificate",
      fileName: `Certificate_${compactName}_${student.studentCode}.pdf`,
      key: "certificate",
      sizeBytes: 1_800_000,
    },
    {
      documentType: "id_card",
      fileName: `IDCard_${compactName}_${student.studentCode}.pdf`,
      key: "id-card",
      sizeBytes: 1_900_000,
    },
  ] as const

  for (const item of items) {
    await tx
      .insert(studentDocuments)
      .values({
        documentType: item.documentType,
        fileName: item.fileName,
        id: fixtureUuid(`student-document:${student.studentId}:${item.key}`),
        mimeType: "application/pdf",
        sizeBytes: item.sizeBytes,
        storageKey: `students/${student.studentId}/documents/${item.fileName}`,
        studentId: student.studentId,
        tenantId,
      })
      .onConflictDoUpdate({
        target: studentDocuments.id,
        set: {
          documentType: item.documentType,
          fileName: item.fileName,
          mimeType: "application/pdf",
          sizeBytes: item.sizeBytes,
          storageKey: `students/${student.studentId}/documents/${item.fileName}`,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertStudentAttendanceCalendarSet(
  tx: DatabaseTransaction,
  tenantId: string,
  teacherId: string,
  student: {
    classId: string
    studentId: string
  },
  studentIndex: number
): Promise<void> {
  const attendanceByMonth = [
    {
      days: [
        [1, "present"],
        [2, "excused"],
        [5, "late"],
        [6, "present"],
        [7, "present"],
        [8, "present"],
        [9, "present"],
        [12, "late"],
        [13, "present"],
        [14, "absent"],
        [15, "present"],
        [16, "present"],
        [19, "present"],
        [20, "present"],
        [21, "present"],
        [22, "late"],
        [23, "present"],
      ] as const,
      monthKey: "2035-03",
    },
    {
      days: [
        [3, "present"],
        [6, "late"],
        [8, "present"],
        [11, "present"],
        [13, "absent"],
        [14, "present"],
        [18, "late"],
        [19, "present"],
        [20, "present"],
        [24, "present"],
        [26, "excused"],
      ] as const,
      monthKey: "2035-02",
    },
    {
      days: [
        [2, "present"],
        [4, "present"],
        [5, "late"],
        [10, "present"],
        [12, "excused"],
        [15, "late"],
        [18, "present"],
        [21, "present"],
        [22, "present"],
        [24, "late"],
        [29, "present"],
      ] as const,
      monthKey: "2035-04",
    },
  ] as const
  const lateShift = studentIndex % 2

  for (const month of attendanceByMonth) {
    for (const [day, status] of month.days) {
      const finalDay = lateShift === 0 ? day : Math.min(day + lateShift, 28)
      const isoDate = `${month.monthKey}-${String(finalDay).padStart(2, "0")}`
      await tx
        .insert(attendance)
        .values({
          classId: student.classId,
          date: isoDate,
          id: fixtureUuid(`student-detail-attendance:${student.studentId}:${isoDate}`),
          markedBy: teacherId,
          note: `${DASHBOARD_FIXTURE_PREFIX}: student-detail-attendance`,
          status,
          studentId: student.studentId,
          tenantId,
        })
        .onConflictDoUpdate({
          target: attendance.id,
          set: {
            note: `${DASHBOARD_FIXTURE_PREFIX}: student-detail-attendance`,
            status,
            updatedAt: new Date(),
          },
        })
    }
  }
}

async function upsertStudentScholarshipsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  studentId: string,
  studentIndex: number
): Promise<void> {
  const scholarshipSets = [
    [
      { scholarshipType: "finance", title: "Global Young Achievers Award" },
      { scholarshipType: "enrichment", title: "STEM for Girls Initiative" },
    ],
    [
      { scholarshipType: "finance", title: "Academic Excellence Grant" },
      { scholarshipType: "enrichment", title: "Creative Leaders Fellowship" },
    ],
  ] as const
  const items = scholarshipSets[studentIndex % scholarshipSets.length] ?? scholarshipSets[0]

  for (const [index, item] of items.entries()) {
    await tx
      .insert(studentScholarships)
      .values({
        id: fixtureUuid(`student-scholarship:${studentId}:${index}`),
        scholarshipType: item.scholarshipType,
        studentId,
        tenantId,
        title: item.title,
      })
      .onConflictDoUpdate({
        target: studentScholarships.id,
        set: {
          scholarshipType: item.scholarshipType,
          title: item.title,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertStudentHealthSet(
  tx: DatabaseTransaction,
  tenantId: string,
  studentId: string
): Promise<void> {
  const items = [
    {
      description: "Routine health check completed. Student is fit for regular activities.",
      label: "Medical Record",
      tone: "info",
    },
    {
      description: "Mild pollen allergy. Medication prescribed for seasonal symptoms.",
      label: "Allergy",
      tone: "warning",
    },
    {
      description: "Severe peanut allergy. Avoid exposure and keep emergency medication ready.",
      label: "Peanut Allergy",
      tone: "danger",
    },
  ] as const

  for (const [index, item] of items.entries()) {
    await tx
      .insert(studentHealthRecords)
      .values({
        description: item.description,
        id: fixtureUuid(`student-health:${studentId}:${index}`),
        label: item.label,
        studentId,
        tenantId,
        tone: item.tone,
      })
      .onConflictDoUpdate({
        target: studentHealthRecords.id,
        set: {
          description: item.description,
          label: item.label,
          tone: item.tone,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertStudentExtracurricularSet(
  tx: DatabaseTransaction,
  tenantId: string,
  studentId: string
): Promise<void> {
  const items = [
    {
      achievement: "Won 2 Silver Medals (City Meet)",
      advisorName: "Coach Andrea V.",
      clubName: "Swimming",
      endDate: null,
      iconKey: "swimming",
      roleLabel: "Team Member",
      startDate: "2029-09-01",
    },
    {
      achievement: "Performed at National Festival",
      advisorName: "Ms. Clara F.",
      clubName: "Dance",
      endDate: null,
      iconKey: "dance",
      roleLabel: "Lead Performer",
      startDate: "2030-09-01",
    },
    {
      achievement: "1st Place in School Robotics Fair",
      advisorName: "Mr. Daniel K.",
      clubName: "Robotics",
      endDate: null,
      iconKey: "robotics",
      roleLabel: "Programmer",
      startDate: "2033-09-01",
    },
  ] as const

  for (const [index, item] of items.entries()) {
    await tx
      .insert(studentExtracurricularRecords)
      .values({
        achievement: item.achievement,
        advisorName: item.advisorName,
        clubName: item.clubName,
        endDate: item.endDate,
        iconKey: item.iconKey,
        id: fixtureUuid(`student-extracurricular:${studentId}:${index}`),
        roleLabel: item.roleLabel,
        startDate: item.startDate,
        studentId,
        tenantId,
      })
      .onConflictDoUpdate({
        target: studentExtracurricularRecords.id,
        set: {
          achievement: item.achievement,
          advisorName: item.advisorName,
          clubName: item.clubName,
          endDate: item.endDate,
          iconKey: item.iconKey,
          roleLabel: item.roleLabel,
          startDate: item.startDate,
          updatedAt: new Date(),
          deletedAt: null,
        },
      })
  }
}

async function upsertStudentBehaviorLogsSet(
  tx: DatabaseTransaction,
  tenantId: string,
  studentId: string
): Promise<void> {
  const items = [
    {
      actionStatus: "record_recognition",
      details: "Helped classmates during group project and supported coordination.",
      entryType: "positive_note",
      recordDate: "2035-01-10",
      reportedByLabel: "Ms. Lee Record",
      title: "Positive Note",
    },
    {
      actionStatus: "recognition_recorded",
      details: "Volunteered in school event organization and guided peers effectively.",
      entryType: "positive_note",
      recordDate: "2035-02-02",
      reportedByLabel: "Admin Office",
      title: "Positive Note",
    },
    {
      actionStatus: "issue_warning",
      details: "Late submission of homework in two consecutive assignments.",
      entryType: "minor_issue",
      recordDate: "2035-02-18",
      reportedByLabel: "Mr. Maulie",
      title: "Minor Issue",
    },
    {
      actionStatus: "parent_notified",
      details: "Absent without prior notice during the first lesson block.",
      entryType: "minor_issue",
      recordDate: "2035-03-05",
      reportedByLabel: "Homeroom Teacher",
      title: "Minor Issue",
    },
  ] as const

  for (const [index, item] of items.entries()) {
    await tx
      .insert(studentBehaviorLogs)
      .values({
        actionStatus: item.actionStatus,
        details: item.details,
        entryType: item.entryType,
        id: fixtureUuid(`student-behavior:${studentId}:${index}`),
        recordDate: item.recordDate,
        reportedByLabel: item.reportedByLabel,
        studentId,
        tenantId,
        title: item.title,
      })
      .onConflictDoUpdate({
        target: studentBehaviorLogs.id,
        set: {
          actionStatus: item.actionStatus,
          details: item.details,
          entryType: item.entryType,
          recordDate: item.recordDate,
          reportedByLabel: item.reportedByLabel,
          title: item.title,
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
function formatMonthValue(date: Date): string {
  return date.toISOString().slice(0, 7)
}

function formatMonthDate(month: string, day: number): string {
  return `${month}-${String(day).padStart(2, "0")}`
}

type FinanceExpenseSeedCategory = "events" | "maintenance" | "others" | "salaries" | "supplies"

type FinanceExpenseSeedRow = {
  amount: number
  category: FinanceExpenseSeedCategory
  day: number
  department: string
  description: string
  expenseCode: string
  quantity: string
}

type FinanceExpenseSeedTemplate = Omit<FinanceExpenseSeedRow, "amount" | "expenseCode">

function splitAmountAcrossRows(total: number, count: number): readonly number[] {
  if (count <= 0) {
    return []
  }

  const normalizedTotal = Math.round(total * 100)
  const baseAmount = Math.floor(normalizedTotal / count)
  const rows = Array.from({ length: count }, () => baseAmount)
  const remainder = normalizedTotal - baseAmount * count

  for (let index = 0; index < remainder; index += 1) {
    const rowIndex = rows.length - 1 - (index % rows.length)
    const current = rows[rowIndex]

    if (typeof current === "number") {
      rows[rowIndex] = current + 1
    }
  }

  return rows.map((value) => value / 100)
}

function formatExpenseSeedCode(sequence: number): string {
  return `EX-${String(sequence).padStart(4, "0")}`
}

function buildSupplementalExpenseRows(
  nextSequence: number,
  remaindersByCategory: Record<FinanceExpenseSeedCategory, number>
): readonly FinanceExpenseSeedRow[] {
  const templatesByCategory: Record<
    FinanceExpenseSeedCategory,
    readonly FinanceExpenseSeedTemplate[]
  > = {
    events: [
      {
        category: "events",
        day: 7,
        department: "Student Affairs",
        description: "Morning assembly staging",
        quantity: "-",
      },
      {
        category: "events",
        day: 15,
        department: "Community",
        description: "Family engagement materials",
        quantity: "-",
      },
      {
        category: "events",
        day: 22,
        department: "Arts",
        description: "Exhibition logistics support",
        quantity: "-",
      },
      {
        category: "events",
        day: 28,
        department: "Social",
        description: "Debate tournament operations",
        quantity: "-",
      },
    ],
    maintenance: [
      {
        category: "maintenance",
        day: 8,
        department: "Facilities",
        description: "Water system maintenance",
        quantity: "-",
      },
      {
        category: "maintenance",
        day: 16,
        department: "Science",
        description: "Laboratory safety repairs",
        quantity: "-",
      },
      {
        category: "maintenance",
        day: 23,
        department: "Operations",
        description: "Campus lighting replacement",
        quantity: "-",
      },
      {
        category: "maintenance",
        day: 24,
        department: "Physical Education",
        description: "Locker room maintenance",
        quantity: "-",
      },
    ],
    others: [
      {
        category: "others",
        day: 9,
        department: "Operations",
        description: "Insurance and compliance fees",
        quantity: "-",
      },
      {
        category: "others",
        day: 20,
        department: "Administration",
        description: "Banking and processing charges",
        quantity: "-",
      },
      {
        category: "others",
        day: 26,
        department: "Community",
        description: "Community relations expenses",
        quantity: "-",
      },
    ],
    salaries: [
      {
        category: "salaries",
        day: 7,
        department: "Language",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 8,
        department: "Social",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 9,
        department: "Arts",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 12,
        department: "Physical Education",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 13,
        department: "Student Affairs",
        description: "Monthly staff salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 14,
        department: "Facilities",
        description: "Monthly operations salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 17,
        department: "Administration",
        description: "Monthly leadership salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 18,
        department: "Mathematics",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 19,
        department: "Science",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 21,
        department: "Language",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 24,
        department: "Social",
        description: "Monthly teacher salary",
        quantity: "-",
      },
      {
        category: "salaries",
        day: 27,
        department: "Operations",
        description: "Monthly support salary",
        quantity: "-",
      },
    ],
    supplies: [
      {
        category: "supplies",
        day: 10,
        department: "Science",
        description: "Laboratory consumables",
        quantity: "12 kits",
      },
      {
        category: "supplies",
        day: 11,
        department: "Mathematics",
        description: "Practice workbook sets",
        quantity: "80 books",
      },
      {
        category: "supplies",
        day: 15,
        department: "Language",
        description: "Reading corner materials",
        quantity: "35 sets",
      },
      {
        category: "supplies",
        day: 16,
        department: "Arts",
        description: "Canvas and sketch supplies",
        quantity: "18 packs",
      },
      {
        category: "supplies",
        day: 17,
        department: "Science",
        description: "STEM project kits",
        quantity: "20 kits",
      },
      {
        category: "supplies",
        day: 18,
        department: "Physical Education",
        description: "Training cone replacement",
        quantity: "30 units",
      },
      {
        category: "supplies",
        day: 25,
        department: "Social",
        description: "Map and atlas materials",
        quantity: "25 copies",
      },
      {
        category: "supplies",
        day: 26,
        department: "Administration",
        description: "Printing and office supplies",
        quantity: "40 packs",
      },
      {
        category: "supplies",
        day: 28,
        department: "Community",
        description: "Parent communication kits",
        quantity: "50 kits",
      },
    ],
  }

  let sequence = nextSequence
  const rows: FinanceExpenseSeedRow[] = []

  for (const category of ["salaries", "supplies", "events", "maintenance", "others"] as const) {
    const templates = templatesByCategory[category]
    const amounts = splitAmountAcrossRows(remaindersByCategory[category], templates.length)

    templates.forEach((template, index) => {
      const amount = amounts[index]

      if (typeof amount !== "number" || amount <= 0) {
        return
      }

      rows.push({
        ...template,
        amount,
        expenseCode: formatExpenseSeedCode(sequence),
      })
      sequence += 1
    })
  }

  return rows
}

async function upsertDashboardFinanceExpenses(
  tx: DatabaseTransaction,
  tenantId: string
): Promise<void> {
  const monthTotals = [65000, 78250, 69300, 73150, 95000, 88000, 76000, 87350] as const
  const categoryShares = {
    events: 0.1,
    maintenance: 0.12,
    others: 0.08,
    salaries: 0.55,
    supplies: 0.15,
  } as const

  const currentMonth = formatMonthValue(new Date())

  for (let offset = monthTotals.length - 1; offset >= 0; offset -= 1) {
    const date = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - offset, 1)
    )
    const month = formatMonthValue(date)
    const total = monthTotals[monthTotals.length - 1 - offset] ?? monthTotals[0]

    const targetByCategory = {
      events: Math.round(total * categoryShares.events * 100) / 100,
      maintenance: Math.round(total * categoryShares.maintenance * 100) / 100,
      others: Math.round(total * categoryShares.others * 100) / 100,
      salaries: Math.round(total * categoryShares.salaries * 100) / 100,
      supplies: Math.round(total * categoryShares.supplies * 100) / 100,
    }

    if (month === currentMonth) {
      const currentMonthRows = [
        {
          amount: 750,
          category: "supplies",
          day: 1,
          department: "Mathematics",
          description: "Graphing calculators",
          expenseCode: "EX-5001",
          quantity: "15",
        },
        {
          amount: 1200,
          category: "maintenance",
          day: 1,
          department: "Science",
          description: "Lab equipment servicing",
          expenseCode: "EX-5002",
          quantity: "-",
        },
        {
          amount: 1000,
          category: "supplies",
          day: 2,
          department: "Language",
          description: "English literature textbooks",
          expenseCode: "EX-5003",
          quantity: "40",
        },
        {
          amount: 900,
          category: "events",
          day: 3,
          department: "Social",
          description: "Field trip bus rental",
          expenseCode: "EX-5004",
          quantity: "2 buses",
        },
        {
          amount: 600,
          category: "supplies",
          day: 3,
          department: "Arts",
          description: "Paint sets & brushes",
          expenseCode: "EX-5005",
          quantity: "25 sets",
        },
        {
          amount: 2500,
          category: "maintenance",
          day: 4,
          department: "Physical Education",
          description: "Gym floor repairs",
          expenseCode: "EX-5006",
          quantity: "-",
        },
        {
          amount: 5000,
          category: "salaries",
          day: 5,
          department: "Mathematics",
          description: "Monthly teacher salary",
          expenseCode: "EX-5007",
          quantity: "-",
        },
        {
          amount: 5000,
          category: "salaries",
          day: 6,
          department: "Science",
          description: "Monthly teacher salary",
          expenseCode: "EX-5008",
          quantity: "-",
        },
      ] as const

      const currentSums = { events: 0, maintenance: 0, others: 0, salaries: 0, supplies: 0 }

      for (const row of currentMonthRows) {
        if (row.category === "events") {
          currentSums.events += row.amount
        }

        if (row.category === "maintenance") {
          currentSums.maintenance += row.amount
        }

        if (row.category === "salaries") {
          currentSums.salaries += row.amount
        }

        if (row.category === "supplies") {
          currentSums.supplies += row.amount
        }
      }

      const supplementalRows = buildSupplementalExpenseRows(5009, {
        events: Math.max(targetByCategory.events - currentSums.events, 0),
        maintenance: Math.max(targetByCategory.maintenance - currentSums.maintenance, 0),
        others: Math.max(targetByCategory.others - currentSums.others, 0),
        salaries: Math.max(targetByCategory.salaries - currentSums.salaries, 0),
        supplies: Math.max(targetByCategory.supplies - currentSums.supplies, 0),
      })

      for (const row of [...currentMonthRows, ...supplementalRows]) {
        await tx
          .insert(financeExpenses)
          .values({
            amount: String(row.amount),
            category: row.category,
            department: row.department,
            description: row.description,
            expenseCode: row.expenseCode,
            expenseDate: formatMonthDate(month, row.day),
            id: fixtureUuid(`finance-expense:${row.expenseCode}`),
            quantity: row.quantity,
            tenantId,
          })
          .onConflictDoUpdate({
            target: financeExpenses.id,
            set: {
              amount: String(row.amount),
              category: row.category,
              department: row.department,
              description: row.description,
              expenseCode: row.expenseCode,
              expenseDate: formatMonthDate(month, row.day),
              quantity: row.quantity,
              updatedAt: new Date(),
            },
          })
      }

      continue
    }

    const historicalRows = [
      {
        amount: targetByCategory.salaries,
        category: "salaries",
        department: "Administration",
        description: `Monthly salary expenses ${month}`,
        expenseCode: `EX-${month.replace(/-/g, "")}-1`,
        quantity: "-",
      },
      {
        amount: targetByCategory.supplies,
        category: "supplies",
        department: "Academics",
        description: `Academic supplies ${month}`,
        expenseCode: `EX-${month.replace(/-/g, "")}-2`,
        quantity: "-",
      },
      {
        amount: targetByCategory.events,
        category: "events",
        department: "Student Affairs",
        description: `School events ${month}`,
        expenseCode: `EX-${month.replace(/-/g, "")}-3`,
        quantity: "-",
      },
      {
        amount: targetByCategory.maintenance,
        category: "maintenance",
        department: "Facilities",
        description: `Maintenance budget ${month}`,
        expenseCode: `EX-${month.replace(/-/g, "")}-4`,
        quantity: "-",
      },
      {
        amount: targetByCategory.others,
        category: "others",
        department: "Operations",
        description: `Other expenses ${month}`,
        expenseCode: `EX-${month.replace(/-/g, "")}-5`,
        quantity: "-",
      },
    ] as const

    for (const [index, row] of historicalRows.entries()) {
      await tx
        .insert(financeExpenses)
        .values({
          amount: String(row.amount),
          category: row.category,
          department: row.department,
          description: row.description,
          expenseCode: row.expenseCode,
          expenseDate: formatMonthDate(month, index + 8),
          id: fixtureUuid(`finance-expense:${row.expenseCode}`),
          quantity: row.quantity,
          tenantId,
        })
        .onConflictDoUpdate({
          target: financeExpenses.id,
          set: {
            amount: String(row.amount),
            category: row.category,
            department: row.department,
            description: row.description,
            expenseCode: row.expenseCode,
            expenseDate: formatMonthDate(month, index + 8),
            quantity: row.quantity,
            updatedAt: new Date(),
          },
        })
    }
  }
}

async function upsertDashboardFinanceReimbursements(
  tx: DatabaseTransaction,
  tenantId: string
): Promise<void> {
  const today = new Date()
  const monday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const day = monday.getUTCDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  monday.setUTCDate(monday.getUTCDate() + mondayOffset)

  const rows = [
    {
      amount: 120,
      dayOffset: 1,
      department: "Mathematics",
      proofLabel: "View File",
      purpose: "Books Purchase",
      requestCode: "RQ-3001",
      staffName: "Argen Maulie",
      status: "approved",
    },
    {
      amount: 250,
      dayOffset: 2,
      department: "Science",
      proofLabel: "View File",
      purpose: "Lab Equipment",
      requestCode: "RQ-3002",
      staffName: "Bella Cruz",
      status: "declined",
    },
    {
      amount: 180,
      dayOffset: 4,
      department: "Physical Ed.",
      proofLabel: "View File",
      purpose: "Sports Supplies",
      requestCode: "RQ-3003",
      staffName: "Francesca Gill",
      status: "approved",
    },
    {
      amount: 300,
      dayOffset: 5,
      department: "Social Studies",
      proofLabel: "View File",
      purpose: "Seminar Travel",
      requestCode: "RQ-3004",
      staffName: "Dariah Ahmed",
      status: "pending",
    },
    {
      amount: 90,
      dayOffset: 6,
      department: "Arts",
      proofLabel: "View File",
      purpose: "Art Materials",
      requestCode: "RQ-3005",
      staffName: "Esteban Perez",
      status: "pending",
    },
  ] as const

  for (const row of rows) {
    const submittedDate = new Date(monday)
    submittedDate.setUTCDate(monday.getUTCDate() + row.dayOffset)

    await tx
      .insert(financeReimbursements)
      .values({
        amount: String(row.amount),
        department: row.department,
        id: fixtureUuid(`finance-reimbursement:${row.requestCode}`),
        proofLabel: row.proofLabel,
        purpose: row.purpose,
        requestCode: row.requestCode,
        staffName: row.staffName,
        status: row.status,
        submittedDate: submittedDate.toISOString().slice(0, 10),
        tenantId,
      })
      .onConflictDoUpdate({
        target: financeReimbursements.id,
        set: {
          amount: String(row.amount),
          department: row.department,
          proofLabel: row.proofLabel,
          purpose: row.purpose,
          requestCode: row.requestCode,
          staffName: row.staffName,
          status: row.status,
          submittedDate: submittedDate.toISOString().slice(0, 10),
          updatedAt: new Date(),
        },
      })
  }
}
