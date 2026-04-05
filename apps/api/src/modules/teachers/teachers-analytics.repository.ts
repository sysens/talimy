import { Injectable } from "@nestjs/common"
import { attendance, db, schedules, subjects, teachers, users } from "@talimy/database"
import { and, asc, desc, eq, gte, inArray, isNull, lt, sql } from "drizzle-orm"

import type { TeacherAttendanceOverviewQueryDto } from "./dto/teacher-attendance-overview-query.dto"
import type { TeacherStatsQueryDto } from "./dto/teacher-stats-query.dto"
import type { TeacherWorkloadQueryDto } from "./dto/teacher-workload-query.dto"
import type { TeachersByDepartmentQueryDto } from "./dto/teachers-by-department-query.dto"
import type {
  TeacherAttendanceOverviewView,
  TeacherStatsView,
  TeacherDepartmentKey,
  TeacherWorkloadView,
  TeachersByDepartmentView,
} from "./teachers-analytics.types"
import {
  formatDateOnly,
  resolveDepartmentKey,
  resolveDepartmentLabel,
  resolveRollingMonthStarts,
  resolveWorkweek,
  scaleWorkloadItem,
} from "./teachers-analytics.utils"

const DEPARTMENT_PRIORITY: Record<TeacherDepartmentKey, number> = {
  science: 0,
  mathematics: 1,
  language: 2,
  social: 3,
  arts: 4,
  physicalEducation: 5,
  other: 6,
}

@Injectable()
export class TeachersAnalyticsRepository {
  async getStats(query: TeacherStatsQueryDto): Promise<TeacherStatsView> {
    const [row] = await db
      .select({
        fullTimeTeachers: sql<number>`count(*) filter (where ${teachers.employmentType} = 'full_time')::int`,
        partTimeTeachers: sql<number>`count(*) filter (where ${teachers.employmentType} = 'part_time')::int`,
        substituteTeachers: sql<number>`count(*) filter (where ${teachers.employmentType} = 'substitute')::int`,
        totalTeachers: sql<number>`count(*)::int`,
      })
      .from(teachers)
      .where(
        and(
          eq(teachers.tenantId, query.tenantId),
          eq(teachers.status, "active"),
          isNull(teachers.deletedAt)
        )
      )

    return {
      fullTimeTeachers: row?.fullTimeTeachers ?? 0,
      partTimeTeachers: row?.partTimeTeachers ?? 0,
      substituteTeachers: row?.substituteTeachers ?? 0,
      totalTeachers: row?.totalTeachers ?? 0,
    }
  }

  async getAttendanceOverview(
    query: TeacherAttendanceOverviewQueryDto
  ): Promise<TeacherAttendanceOverviewView> {
    return query.period === "monthly"
      ? this.getMonthlyAttendanceOverview(query.tenantId)
      : this.getWeeklyAttendanceOverview(query.tenantId)
  }

  async getWorkload(query: TeacherWorkloadQueryDto): Promise<TeacherWorkloadView> {
    const subjectOptionRows = await db
      .select({ id: subjects.id, label: subjects.name })
      .from(subjects)
      .innerJoin(
        schedules,
        and(
          eq(schedules.subjectId, subjects.id),
          eq(schedules.tenantId, query.tenantId),
          isNull(schedules.deletedAt)
        )
      )
      .where(and(eq(subjects.tenantId, query.tenantId), isNull(subjects.deletedAt)))
      .groupBy(subjects.id, subjects.name)
      .orderBy(asc(subjects.name))

    const subjectOptions = subjectOptionRows
      .map((option) => ({
        id: option.id,
        key: resolveDepartmentKey(option.label),
        label: option.label,
      }))
      .sort((left, right) => {
        const leftPriority = DEPARTMENT_PRIORITY[left.key]
        const rightPriority = DEPARTMENT_PRIORITY[right.key]
        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority
        }

        return left.label.localeCompare(right.label)
      })

    const resolvedSubjectId =
      subjectOptions.find((option) => option.id === query.subjectId)?.id ??
      subjectOptions.find((option) => option.key === "science")?.id ??
      subjectOptions[0]?.id ??
      ""

    if (resolvedSubjectId.length === 0) {
      return {
        items: [],
        period: query.period,
        subjectId: "",
        subjectOptions,
      }
    }

    const durationHoursSql = sql<number>`coalesce(sum(extract(epoch from (${schedules.endTime}::time - ${schedules.startTime}::time)) / 3600.0), 0)::float8`

    const rows = await db
      .select({
        employmentType: teachers.employmentType,
        firstName: users.firstName,
        lastName: users.lastName,
        teacherId: teachers.id,
        teachingHours: durationHoursSql,
        totalClasses: sql<number>`count(*)::int`,
      })
      .from(schedules)
      .innerJoin(
        teachers,
        and(
          eq(schedules.teacherId, teachers.id),
          eq(teachers.tenantId, query.tenantId),
          eq(teachers.status, "active"),
          isNull(teachers.deletedAt)
        )
      )
      .innerJoin(users, eq(teachers.userId, users.id))
      .where(
        and(
          eq(schedules.tenantId, query.tenantId),
          eq(schedules.subjectId, resolvedSubjectId),
          isNull(schedules.deletedAt)
        )
      )
      .groupBy(teachers.id, teachers.employmentType, users.firstName, users.lastName)
      .orderBy(asc(users.firstName), asc(users.lastName))
      .limit(8)

    return {
      items: rows.map((row) =>
        scaleWorkloadItem(
          {
            employmentType: row.employmentType,
            label: `${row.firstName}\n${row.lastName}`,
            teacherId: row.teacherId,
            teachingHours: Math.round(Number(row.teachingHours)),
            totalClasses: row.totalClasses,
          },
          query.period
        )
      ),
      period: query.period,
      subjectId: resolvedSubjectId,
      subjectOptions,
    }
  }

  async getByDepartment(query: TeachersByDepartmentQueryDto): Promise<TeachersByDepartmentView> {
    const rows = await db
      .select({
        count: sql<number>`count(*)::int`,
        specialization: teachers.specialization,
      })
      .from(teachers)
      .where(
        and(
          eq(teachers.tenantId, query.tenantId),
          eq(teachers.status, "active"),
          isNull(teachers.deletedAt)
        )
      )
      .groupBy(teachers.specialization)
      .orderBy(desc(sql<number>`count(*)::int`), asc(teachers.specialization))

    const totalTeachers = rows.reduce((sum, row) => sum + row.count, 0)

    return {
      items: rows.map((row) => {
        const key = resolveDepartmentKey(row.specialization)
        return {
          count: row.count,
          key,
          label: resolveDepartmentLabel(key),
          percentage: totalTeachers === 0 ? 0 : Math.round((row.count / totalTeachers) * 100),
        }
      }),
      totalTeachers,
    }
  }

  private async getWeeklyAttendanceOverview(
    tenantId: string
  ): Promise<TeacherAttendanceOverviewView> {
    const workweek = resolveWorkweek(new Date())
    const rows = await db
      .select({
        date: attendance.date,
        present: sql<number>`count(*) filter (where ${attendance.status} = 'present')::int`,
        total: sql<number>`count(*)::int`,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          gte(attendance.date, formatDateOnly(workweek[0]!)),
          lt(
            attendance.date,
            formatDateOnly(new Date(workweek[workweek.length - 1]!.getTime() + 86_400_000))
          ),
          isNull(attendance.deletedAt)
        )
      )
      .groupBy(attendance.date)
      .orderBy(asc(attendance.date))

    const valueMap = new Map(
      rows.map(
        (row) =>
          [row.date, row.total === 0 ? 0 : Math.round((row.present / row.total) * 100)] as const
      )
    )

    return {
      period: "weekly",
      points: workweek.map((day) => ({
        date: formatDateOnly(day),
        label: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(day),
        value: valueMap.get(formatDateOnly(day)) ?? 0,
      })),
    }
  }

  private async getMonthlyAttendanceOverview(
    tenantId: string
  ): Promise<TeacherAttendanceOverviewView> {
    const monthStarts = resolveRollingMonthStarts(new Date(), 6)
    const monthSql = sql<number>`extract(month from ${attendance.date})::int`
    const yearSql = sql<number>`extract(year from ${attendance.date})::int`

    const rows = await db
      .select({
        monthNumber: monthSql,
        present: sql<number>`count(*) filter (where ${attendance.status} = 'present')::int`,
        total: sql<number>`count(*)::int`,
        year: yearSql,
      })
      .from(attendance)
      .where(
        and(
          eq(attendance.tenantId, tenantId),
          gte(attendance.date, formatDateOnly(monthStarts[0]!)),
          lt(
            attendance.date,
            formatDateOnly(
              new Date(
                Date.UTC(
                  monthStarts[monthStarts.length - 1]!.getUTCFullYear(),
                  monthStarts[monthStarts.length - 1]!.getUTCMonth() + 1,
                  1,
                  0,
                  0,
                  0,
                  0
                )
              )
            )
          ),
          isNull(attendance.deletedAt)
        )
      )
      .groupBy(yearSql, monthSql)
      .orderBy(asc(yearSql), asc(monthSql))

    const valueMap = new Map(
      rows.map((row) => {
        const key = `${row.year}-${row.monthNumber}`
        const value = row.total === 0 ? 0 : Math.round((row.present / row.total) * 100)
        return [key, value] as const
      })
    )

    return {
      period: "monthly",
      points: monthStarts.map((monthStart) => ({
        date: formatDateOnly(monthStart),
        label: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
          monthStart
        ),
        value: valueMap.get(`${monthStart.getUTCFullYear()}-${monthStart.getUTCMonth() + 1}`) ?? 0,
      })),
    }
  }
}
