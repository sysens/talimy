import { Injectable } from "@nestjs/common"
import { attendance, classes, db, grades, students, users } from "@talimy/database"
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  lt,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm"

import type { AdminStudentEnrollmentTrendsQueryDto } from "./dto/admin-student-enrollment-trends-query.dto"
import type { ListStudentsQueryDto } from "./dto/list-students-query.dto"
import type { StudentAttendanceWeeklyQueryDto } from "./dto/student-attendance-weekly-query.dto"
import type { StudentSpecialProgramsQueryDto } from "./dto/student-special-programs-query.dto"
import { toStudentDirectoryItemView } from "./students-directory.mapper"
import type {
  StudentDirectoryListView,
  StudentAttendanceOverviewView,
  StudentEnrollmentTrendsView,
  StudentSpecialProgramsView,
  StudentStatsView,
} from "./students-directory.types"

const SPECIAL_PROGRAM_TEMPLATES = [
  {
    programName: "Community Leadership Fellowship",
    tone: "sky",
    typeLabel: "Enrichment",
  },
  {
    programName: "National Science Scholarship",
    tone: "pink",
    typeLabel: "Academic Support",
  },
  {
    programName: "Student Athlete Sponsorship",
    tone: "mixed",
    typeLabel: "Finance+Enrichment",
  },
  {
    programName: "Arts & Creative Talent Grant",
    tone: "sky",
    typeLabel: "Enrichment",
  },
] as const

type StudentDatabaseStatus = "active" | "inactive" | "graduated" | "transferred"

@Injectable()
export class StudentsDirectoryRepository {
  async getStats(
    tenantId: string,
    gender: "male" | "female" | undefined
  ): Promise<StudentStatsView> {
    const filters: SQL[] = [eq(students.tenantId, tenantId), isNull(students.deletedAt)]

    if (gender) {
      filters.push(eq(students.gender, gender))
    }

    const [row] = await db
      .select({
        grade7Students: sql<number>`count(*) filter (where ${classes.grade} = '7')::int`,
        grade8Students: sql<number>`count(*) filter (where ${classes.grade} = '8')::int`,
        grade9Students: sql<number>`count(*) filter (where ${classes.grade} = '9')::int`,
        totalStudents: sql<number>`count(*)::int`,
      })
      .from(students)
      .leftJoin(
        classes,
        and(
          eq(classes.id, students.classId),
          eq(classes.tenantId, tenantId),
          isNull(classes.deletedAt)
        )
      )
      .where(and(...filters))

    return {
      grade7Students: row?.grade7Students ?? 0,
      grade8Students: row?.grade8Students ?? 0,
      grade9Students: row?.grade9Students ?? 0,
      totalStudents: row?.totalStudents ?? 0,
    }
  }

  async getEnrollmentTrends(
    query: AdminStudentEnrollmentTrendsQueryDto,
    gender: "male" | "female" | undefined
  ): Promise<StudentEnrollmentTrendsView> {
    const filters: SQL[] = [eq(students.tenantId, query.tenantId), isNull(students.deletedAt)]
    if (gender) {
      filters.push(eq(students.gender, gender))
    }

    const yearSql = sql<number>`extract(year from ${students.enrollmentDate})::int`
    const rows = await db
      .select({
        total: sql<number>`count(*)::int`,
        year: yearSql,
      })
      .from(students)
      .where(and(...filters))
      .groupBy(yearSql)
      .orderBy(asc(yearSql))

    const totalsByYear = new Map<number, number>(rows.map((row) => [row.year, row.total] as const))
    const currentYear = new Date().getUTCFullYear()
    const firstYear = currentYear - query.years + 1
    const points = Array.from({ length: query.years }, (_, index) => {
      const year = firstYear + index

      return {
        label: String(year),
        shortLabel: String(year),
        value: totalsByYear.get(year) ?? 0,
      }
    })

    return {
      points,
      years: query.years,
    }
  }

  async getSpecialPrograms(
    query: StudentSpecialProgramsQueryDto,
    gender: "male" | "female" | undefined
  ): Promise<StudentSpecialProgramsView> {
    if (!query.hasGrant) {
      return { hasGrant: query.hasGrant, items: [] }
    }

    const gradeSummary = this.buildGradeSummary(query.tenantId)
    const rows = await db
      .with(gradeSummary)
      .select({
        avatarUrl: users.avatar,
        classGrade: classes.grade,
        classSection: classes.section,
        firstName: users.firstName,
        gpa: sql<number>`coalesce(${gradeSummary.gpa}, 0)::double precision`,
        id: students.id,
        lastName: users.lastName,
        studentCode: students.studentId,
      })
      .from(students)
      .innerJoin(
        users,
        and(
          eq(users.id, students.userId),
          eq(users.tenantId, query.tenantId),
          isNull(users.deletedAt)
        )
      )
      .leftJoin(
        classes,
        and(
          eq(classes.id, students.classId),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .leftJoin(gradeSummary, eq(gradeSummary.studentId, students.id))
      .where(
        and(
          eq(students.tenantId, query.tenantId),
          isNull(students.deletedAt),
          gender ? eq(students.gender, gender) : undefined
        )
      )
      .orderBy(
        desc(sql<number>`coalesce(${gradeSummary.gpa}, 0)::double precision`),
        asc(users.firstName)
      )
      .limit(query.limit)

    return {
      hasGrant: query.hasGrant,
      items: rows.map((row, index) => {
        const template =
          SPECIAL_PROGRAM_TEMPLATES[index % SPECIAL_PROGRAM_TEMPLATES.length] ??
          SPECIAL_PROGRAM_TEMPLATES[0]

        return {
          avatarUrl: row.avatarUrl,
          classLabel: formatClassLabel(row.classGrade, row.classSection),
          id: row.studentCode,
          name: `${row.firstName} ${row.lastName}`.trim(),
          programName: template.programName,
          tone: template.tone,
          typeLabel: template.typeLabel,
        }
      }),
    }
  }

  async getAttendanceWeekly(
    query: StudentAttendanceWeeklyQueryDto,
    gender: "male" | "female" | undefined
  ): Promise<StudentAttendanceOverviewView> {
    const weekDays = buildCurrentWeekDays()
    const startDate = weekDays[0] ?? new Date()
    const lastWeekDay = weekDays[weekDays.length - 1] ?? startDate
    const endDate = new Date(lastWeekDay)
    endDate.setUTCDate(endDate.getUTCDate() + 1)

    const [studentCountRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(students)
      .where(
        and(
          eq(students.tenantId, query.tenantId),
          isNull(students.deletedAt),
          gender ? eq(students.gender, gender) : undefined
        )
      )

    const presentRows = await db
      .select({
        date: attendance.date,
        total: sql<number>`count(*)::int`,
      })
      .from(attendance)
      .innerJoin(
        students,
        and(
          eq(students.id, attendance.studentId),
          eq(students.tenantId, query.tenantId),
          isNull(students.deletedAt)
        )
      )
      .where(
        and(
          eq(attendance.tenantId, query.tenantId),
          sql`${attendance.status} <> 'absent'`,
          gte(attendance.date, formatDateOnly(startDate)),
          lt(attendance.date, formatDateOnly(endDate)),
          gender ? eq(students.gender, gender) : undefined,
          isNull(attendance.deletedAt)
        )
      )
      .groupBy(attendance.date)
      .orderBy(asc(attendance.date))

    const absentRows = await db
      .select({
        classGrade: classes.grade,
        classSection: classes.section,
        date: attendance.date,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(attendance)
      .innerJoin(
        students,
        and(
          eq(students.id, attendance.studentId),
          eq(students.tenantId, query.tenantId),
          isNull(students.deletedAt)
        )
      )
      .innerJoin(
        users,
        and(
          eq(users.id, students.userId),
          eq(users.tenantId, query.tenantId),
          isNull(users.deletedAt)
        )
      )
      .leftJoin(
        classes,
        and(
          eq(classes.id, attendance.classId),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .where(
        and(
          eq(attendance.tenantId, query.tenantId),
          eq(attendance.status, "absent"),
          gte(attendance.date, formatDateOnly(startDate)),
          lt(attendance.date, formatDateOnly(endDate)),
          gender ? eq(students.gender, gender) : undefined,
          isNull(attendance.deletedAt)
        )
      )
      .orderBy(asc(attendance.date), asc(users.firstName), asc(users.lastName))

    const totalsByDate = new Map(presentRows.map((row) => [row.date, row.total] as const))
    const absencesByDate = new Map<
      string,
      Array<{
        classLabel: string
        name: string
      }>
    >()

    for (const row of absentRows) {
      const existingRows = absencesByDate.get(row.date) ?? []
      existingRows.push({
        classLabel: formatClassLabel(row.classGrade, row.classSection),
        name: `${row.firstName} ${row.lastName}`.trim(),
      })
      absencesByDate.set(row.date, existingRows)
    }

    return {
      points: weekDays.map((day) => {
        const isoDate = formatDateOnly(day)

        return {
          absentStudents: absencesByDate.get(isoDate) ?? [],
          date: isoDate,
          label: day.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
          value: totalsByDate.get(isoDate) ?? 0,
        }
      }),
      totalStudents: studentCountRow?.total ?? 0,
      week: query.week,
    }
  }

  async list(query: ListStudentsQueryDto): Promise<StudentDirectoryListView> {
    const filters = this.buildListFilters(query)
    const whereExpression = and(...filters)
    const [countRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(students)
      .innerJoin(
        users,
        and(
          eq(users.id, students.userId),
          eq(users.tenantId, query.tenantId),
          isNull(users.deletedAt)
        )
      )
      .leftJoin(
        classes,
        and(
          eq(classes.id, students.classId),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .where(whereExpression)

    const total = countRow?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / query.limit))
    const page = Math.min(query.page, totalPages)
    const offset = (page - 1) * query.limit
    const gradeSummary = this.buildGradeSummary(query.tenantId)
    const attendanceSummary = this.buildAttendanceSummary(query.tenantId)
    const gpaExpression = sql<number>`coalesce(${gradeSummary.gpa}, 0)::double precision`
    const attendanceExpression = sql<number>`coalesce(${attendanceSummary.attendancePercentage}, 0)::int`

    const rows = await db
      .with(gradeSummary, attendanceSummary)
      .select({
        attendancePercentage: attendanceExpression,
        avatarUrl: users.avatar,
        classGrade: classes.grade,
        classSection: classes.section,
        firstName: users.firstName,
        gpa: gpaExpression,
        id: students.id,
        lastName: users.lastName,
        status: students.status,
        studentCode: students.studentId,
      })
      .from(students)
      .innerJoin(
        users,
        and(
          eq(users.id, students.userId),
          eq(users.tenantId, query.tenantId),
          isNull(users.deletedAt)
        )
      )
      .leftJoin(
        classes,
        and(
          eq(classes.id, students.classId),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .leftJoin(gradeSummary, eq(gradeSummary.studentId, students.id))
      .leftJoin(attendanceSummary, eq(attendanceSummary.studentId, students.id))
      .where(whereExpression)
      .orderBy(...this.resolveOrderBy(query, gpaExpression, attendanceExpression))
      .limit(query.limit)
      .offset(offset)

    return {
      data: rows.map((row) =>
        toStudentDirectoryItemView({
          attendancePercentage: row.attendancePercentage,
          avatarUrl: row.avatarUrl,
          classLabel: formatClassLabel(row.classGrade, row.classSection),
          firstName: row.firstName,
          gpa: Number(row.gpa),
          id: row.id,
          lastName: row.lastName,
          status: row.status,
          studentCode: row.studentCode,
        })
      ),
      meta: { limit: query.limit, page, total, totalPages },
    }
  }

  private buildListFilters(query: ListStudentsQueryDto): SQL[] {
    const filters: SQL[] = [eq(students.tenantId, query.tenantId), isNull(students.deletedAt)]

    if (query.classId) {
      filters.push(eq(students.classId, query.classId))
    }

    if (query.gender) {
      filters.push(eq(students.gender, query.gender))
    }

    const databaseStatuses = resolveStudentStatusFilters(query.status)
    if (databaseStatuses.length > 0) {
      filters.push(inArray(students.status, databaseStatuses))
    }

    if (query.enrollmentDateFrom) {
      filters.push(gte(students.enrollmentDate, query.enrollmentDateFrom))
    }

    if (query.enrollmentDateTo) {
      filters.push(lte(students.enrollmentDate, query.enrollmentDateTo))
    }

    if (query.search && query.search.trim().length > 0) {
      const search = query.search.trim()
      filters.push(
        or(
          ilike(students.studentId, `%${search}%`),
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(classes.grade, `%${search}%`),
          ilike(classes.section, `%${search}%`)
        )!
      )
    }

    return filters
  }

  private buildGradeSummary(tenantId: string) {
    return db.$with("student_grade_summary").as(
      db
        .select({
          gpa: sql<number>`round(coalesce(avg(${grades.score}), 0)::numeric / 25, 1)::double precision`.as(
            "gpa"
          ),
          studentId: grades.studentId,
        })
        .from(grades)
        .where(and(eq(grades.tenantId, tenantId), isNull(grades.deletedAt)))
        .groupBy(grades.studentId)
    )
  }

  private buildAttendanceSummary(tenantId: string) {
    return db.$with("student_attendance_summary").as(
      db
        .select({
          attendancePercentage:
            sql<number>`coalesce(round((count(*) filter (where ${attendance.status} <> 'absent'))::numeric / nullif(count(*), 0) * 100, 0), 0)::int`.as(
              "attendance_percentage"
            ),
          studentId: attendance.studentId,
        })
        .from(attendance)
        .where(and(eq(attendance.tenantId, tenantId), isNull(attendance.deletedAt)))
        .groupBy(attendance.studentId)
    )
  }

  private resolveOrderBy(
    query: ListStudentsQueryDto,
    gpaExpression: SQL<number>,
    attendanceExpression: SQL<number>
  ): readonly SQL[] {
    const classOrderExpression = sql<string>`coalesce(${classes.grade}, '') || coalesce(${classes.section}, '')`
    const fullNameExpression = sql<string>`concat(coalesce(${users.firstName}, ''), ' ', coalesce(${users.lastName}, ''))`
    const performanceExpression = sql<number>`case when ${gpaExpression} >= 3.5 then 2 when ${gpaExpression} >= 2.5 then 1 else 0 end`
    const statusExpression = sql<number>`case when ${students.status} = 'active' then 2 when ${students.status} = 'inactive' then 0 else 1 end`

    const sortExpression =
      query.sort === "attendance"
        ? attendanceExpression
        : query.sort === "classLabel"
          ? classOrderExpression
          : query.sort === "fullName"
            ? fullNameExpression
            : query.sort === "gpa"
              ? gpaExpression
              : query.sort === "performance"
                ? performanceExpression
                : query.sort === "status"
                  ? statusExpression
                  : students.createdAt

    return query.order === "asc"
      ? [asc(sortExpression), asc(users.firstName), asc(users.lastName)]
      : [desc(sortExpression), asc(users.firstName), asc(users.lastName)]
  }
}

function formatClassLabel(grade: string | null, section: string | null): string {
  if (typeof grade === "string" && typeof section === "string" && section.length > 0) {
    return `${grade}${section}`
  }

  if (typeof grade === "string") {
    return grade
  }

  return "—"
}

function buildCurrentWeekDays(): readonly Date[] {
  const referenceDate = new Date()
  const monday = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
      0,
      0,
      0,
      0
    )
  )
  const dayOfWeek = monday.getUTCDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  monday.setUTCDate(monday.getUTCDate() - daysFromMonday)

  return Array.from({ length: 7 }, (_, index) => {
    const nextDay = new Date(monday)
    nextDay.setUTCDate(monday.getUTCDate() + index)
    return nextDay
  })
}

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function resolveStudentStatusFilters(
  statuses: readonly string[] | undefined
): readonly StudentDatabaseStatus[] {
  if (!statuses || statuses.length === 0) {
    return []
  }

  const mappedStatuses = statuses.flatMap((status): readonly StudentDatabaseStatus[] => {
    if (status === "active") {
      return ["active"]
    }

    if (status === "inactive" || status === "suspended") {
      return ["inactive"]
    }

    if (status === "graduated") {
      return ["graduated"]
    }

    if (status === "transferred") {
      return ["transferred"]
    }

    return ["graduated", "transferred"]
  })

  return [...new Set(mappedStatuses)]
}
