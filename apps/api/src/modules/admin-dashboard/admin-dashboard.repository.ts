import { Injectable } from "@nestjs/common"
import {
  attendance,
  auditLogs,
  classes,
  db,
  grades,
  payments,
  students,
  teachers,
  users,
} from "@talimy/database"
import { and, asc, desc, eq, gte, inArray, isNull, lt, sql } from "drizzle-orm"

import type { AdminActivityQueryDto } from "./dto/admin-activity-query.dto"
import type { AdminAttendanceOverviewQueryDto } from "./dto/admin-attendance-overview-query.dto"
import type { AdminDashboardStatsQueryDto } from "./dto/admin-dashboard-stats-query.dto"
import type { AdminFinanceEarningsQueryDto } from "./dto/admin-finance-earnings-query.dto"
import type { AdminStudentsByGenderQueryDto } from "./dto/admin-students-by-gender-query.dto"
import type { AdminStudentsPerformanceQueryDto } from "./dto/admin-students-performance-query.dto"
import type {
  AdminActivityView,
  AdminAttendanceOverviewView,
  AdminDashboardStatsView,
  AdminFinanceEarningsView,
  AdminStudentsByGenderView,
  AdminStudentsPerformanceView,
} from "./admin-dashboard.types"
import {
  fillAttendancePoints,
  fillMonthValuePoints,
  fillStudentPerformancePoints,
  resolveCurrentWeekWindow,
  resolveRollingMonthWindow,
  resolveSemesterWindow,
  resolveYearWindow,
} from "./admin-dashboard.utils"

type GradeKey = "grade7" | "grade8" | "grade9"

const SCHOOL_ADMIN_ROLES = ["school_admin"] as const
const DASHBOARD_GRADES = ["7", "8", "9"] as const

@Injectable()
export class AdminDashboardRepository {
  async getStats(query: AdminDashboardStatsQueryDto): Promise<AdminDashboardStatsView> {
    const currentYearStart = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1, 0, 0, 0, 0))

    const [studentRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(students)
      .where(and(eq(students.tenantId, query.tenantId), isNull(students.deletedAt)))

    const [teacherRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(teachers)
      .where(
        and(
          eq(teachers.tenantId, query.tenantId),
          eq(teachers.status, "active"),
          isNull(teachers.deletedAt)
        )
      )

    const [staffRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(users)
      .where(
        and(
          eq(users.tenantId, query.tenantId),
          inArray(users.role, SCHOOL_ADMIN_ROLES),
          eq(users.isActive, true),
          isNull(users.deletedAt)
        )
      )

    const [awardsRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(grades)
      .where(
        and(
          eq(grades.tenantId, query.tenantId),
          gte(grades.createdAt, currentYearStart),
          sql`${grades.score} >= 95`,
          isNull(grades.deletedAt)
        )
      )

    return {
      activeTeachers: teacherRow?.total ?? 0,
      enrolledStudents: studentRow?.total ?? 0,
      supportStaff: staffRow?.total ?? 0,
      totalAwards: awardsRow?.total ?? 0,
    }
  }

  async getStudentsPerformance(
    query: AdminStudentsPerformanceQueryDto
  ): Promise<AdminStudentsPerformanceView> {
    const referenceDate = new Date()
    const window = resolveSemesterWindow(query.period, referenceDate)
    const monthSql = sql<number>`extract(month from ${grades.createdAt})::int`

    const rows = await db
      .select({
        averageScore: sql<string>`coalesce(avg(${grades.score}), 0)::text`,
        grade: classes.grade,
        monthNumber: monthSql,
      })
      .from(grades)
      .innerJoin(
        students,
        and(
          eq(grades.studentId, students.id),
          eq(students.tenantId, query.tenantId),
          isNull(students.deletedAt)
        )
      )
      .innerJoin(
        classes,
        and(
          eq(students.classId, classes.id),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .where(
        and(
          eq(grades.tenantId, query.tenantId),
          inArray(classes.grade, DASHBOARD_GRADES),
          gte(grades.createdAt, window.startDate),
          lt(grades.createdAt, window.endDate),
          isNull(grades.deletedAt)
        )
      )
      .groupBy(monthSql, classes.grade)
      .orderBy(asc(monthSql), asc(classes.grade))

    const valuesByMonth = new Map<number, Partial<Record<GradeKey, number>>>()

    for (const row of rows) {
      const monthBucket = valuesByMonth.get(row.monthNumber) ?? {}
      const gradeKey = resolveGradeKey(row.grade)
      if (!gradeKey) {
        continue
      }

      monthBucket[gradeKey] = Number(row.averageScore)
      valuesByMonth.set(row.monthNumber, monthBucket)
    }

    return {
      period: query.period,
      points: fillStudentPerformancePoints(window.monthNumbers, valuesByMonth),
    }
  }

  async getStudentsByGender(
    query: AdminStudentsByGenderQueryDto
  ): Promise<AdminStudentsByGenderView> {
    const [row] = await db
      .select({
        boys: sql<number>`count(*) filter (where ${students.gender} = 'male')::int`,
        girls: sql<number>`count(*) filter (where ${students.gender} = 'female')::int`,
      })
      .from(students)
      .innerJoin(
        classes,
        and(
          eq(students.classId, classes.id),
          eq(classes.tenantId, query.tenantId),
          isNull(classes.deletedAt)
        )
      )
      .where(
        and(
          eq(students.tenantId, query.tenantId),
          eq(classes.grade, query.gradeId),
          isNull(students.deletedAt)
        )
      )

    const boys = row?.boys ?? 0
    const girls = row?.girls ?? 0

    return {
      boys,
      girls,
      gradeId: query.gradeId,
      total: boys + girls,
    }
  }

  async getAttendanceOverview(
    query: AdminAttendanceOverviewQueryDto
  ): Promise<AdminAttendanceOverviewView> {
    if (query.period === "weekly") {
      return this.getWeeklyAttendanceOverview(query.tenantId)
    }

    return this.getMonthlyAttendanceOverview(query.tenantId)
  }

  async getFinanceEarnings(query: AdminFinanceEarningsQueryDto): Promise<AdminFinanceEarningsView> {
    const window = resolveYearWindow(query.period, new Date())
    const monthSql = sql<number>`extract(month from ${payments.date})::int`

    const rows = await db
      .select({
        earnings: sql<string>`coalesce(sum(${payments.amount}), 0)::text`,
        monthNumber: monthSql,
      })
      .from(payments)
      .where(
        and(
          eq(payments.tenantId, query.tenantId),
          eq(payments.status, "paid"),
          gte(payments.date, formatDateOnly(window.startDate)),
          lt(payments.date, formatDateOnly(window.endDate)),
          isNull(payments.deletedAt)
        )
      )
      .groupBy(monthSql)
      .orderBy(asc(monthSql))

    const valuesByMonth = new Map<number, { earnings: number; expenses: number }>()

    for (const row of rows) {
      valuesByMonth.set(row.monthNumber, {
        earnings: Number(row.earnings),
        expenses: 0,
      })
    }

    return {
      period: query.period,
      points: fillMonthValuePoints(window.monthNumbers, valuesByMonth),
      year: window.year,
    }
  }

  async getRecentActivity(query: AdminActivityQueryDto): Promise<AdminActivityView> {
    const rows = await db
      .select({
        action: auditLogs.action,
        actorFirstName: users.firstName,
        actorLastName: users.lastName,
        id: auditLogs.id,
        resource: auditLogs.resource,
        timestamp: auditLogs.timestamp,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .where(and(eq(auditLogs.tenantId, query.tenantId), isNull(auditLogs.deletedAt)))
      .orderBy(desc(auditLogs.timestamp))
      .limit(query.limit)

    return {
      items: rows.map((row) => ({
        action: row.action,
        actorName: resolveActorName(row.actorFirstName, row.actorLastName),
        id: row.id,
        resource: row.resource,
        resourceLabel: null,
        timestamp: row.timestamp.toISOString(),
      })),
    }
  }

  private async getWeeklyAttendanceOverview(
    tenantId: string
  ): Promise<AdminAttendanceOverviewView> {
    const week = resolveCurrentWeekWindow(new Date())
    const rows = await db
      .select({
        date: attendance.date,
        total: sql<number>`count(*)::int`,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          eq(attendance.status, "present"),
          gte(attendance.date, formatDateOnly(week.startDate)),
          lt(attendance.date, formatDateOnly(week.endDate)),
          isNull(attendance.deletedAt)
        )
      )
      .groupBy(attendance.date)
      .orderBy(asc(attendance.date))

    const totals = new Map(rows.map((row) => [row.date, row.total] as const))

    return {
      period: "weekly",
      points: fillAttendancePoints(
        week.days.map((day) => {
          const isoDate = formatDateOnly(day)

          return {
            date: isoDate,
            label: isoDate,
            value: totals.get(isoDate) ?? 0,
          }
        })
      ),
    }
  }

  private async getMonthlyAttendanceOverview(
    tenantId: string
  ): Promise<AdminAttendanceOverviewView> {
    const window = resolveRollingMonthWindow(new Date())
    const monthSql = sql<number>`extract(month from ${attendance.date})::int`
    const yearSql = sql<number>`extract(year from ${attendance.date})::int`

    const rows = await db
      .select({
        monthNumber: monthSql,
        total: sql<number>`count(*)::int`,
        year: yearSql,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          eq(attendance.status, "present"),
          gte(attendance.date, formatDateOnly(window.startDate)),
          lt(attendance.date, formatDateOnly(window.endDate)),
          isNull(attendance.deletedAt)
        )
      )
      .groupBy(yearSql, monthSql)
      .orderBy(asc(yearSql), asc(monthSql))

    const totals = new Map<string, number>(
      rows.map((row) => [`${row.year}-${row.monthNumber}`, row.total] as const)
    )

    return {
      period: "monthly",
      points: fillAttendancePoints(
        window.monthNumbers.map((_, index) => {
          const monthDate = new Date(
            Date.UTC(
              window.startDate.getUTCFullYear(),
              window.startDate.getUTCMonth() + index,
              1,
              0,
              0,
              0,
              0
            )
          )
          const isoDate = formatDateOnly(monthDate)
          const key = `${monthDate.getUTCFullYear()}-${monthDate.getUTCMonth() + 1}`

          return {
            date: isoDate,
            label: isoDate,
            value: totals.get(key) ?? 0,
          }
        })
      ),
    }
  }
}

function resolveActorName(firstName: string | null, lastName: string | null): string | null {
  const parts = [firstName, lastName].filter(
    (part): part is string => typeof part === "string" && part.length > 0
  )
  return parts.length > 0 ? parts.join(" ") : null
}

function resolveGradeKey(grade: string): GradeKey | null {
  if (grade === "7") return "grade7"
  if (grade === "8") return "grade8"
  if (grade === "9") return "grade9"
  return null
}

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10)
}
