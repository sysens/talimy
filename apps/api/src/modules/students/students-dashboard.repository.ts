import { Injectable } from "@nestjs/common"
import {
  assignmentSubmissions,
  assignments,
  db,
  grades,
  schedules,
  studentBehaviorLogs,
  studentExtracurricularRecords,
  studentScholarships,
  subjects,
  teachers,
  users,
} from "@talimy/database"
import { and, asc, desc, eq, ilike, inArray, isNull, or, sql, type SQL } from "drizzle-orm"

import { StudentsRepository } from "./students.repository"
import { StudentsSummaryRepository } from "./students.summary.repository"
import type {
  StudentDashboardAdviceView,
  StudentDashboardAssignmentsView,
  StudentDashboardAssignmentStatusView,
  StudentDashboardLessonsView,
  StudentDashboardPerformanceSummaryView,
  StudentDashboardScoreActivityView,
  StudentDashboardStatsView,
  StudentDashboardSubjectGradesView,
} from "./students-dashboard.types"

const GPA_MAX = 4
const MAX_DASHBOARD_ASSIGNMENTS = 5
const DAY_SCOPES = ["today", "tomorrow"] as const
const DAY_OF_WEEK_BY_INDEX = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const

@Injectable()
export class StudentsDashboardRepository {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly studentsSummaryRepository: StudentsSummaryRepository
  ) {}

  async getAiAdvice(tenantId: string, userId: string): Promise<StudentDashboardAdviceView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)
    const summary = await this.studentsSummaryRepository.getSummary(tenantId, row.student.id)
    const attendancePercentage = calculateAttendancePercentage(summary.attendance)
    const averageGpaValue = normalizeScoreToGpa(summary.gradeAverage)

    return {
      aiAdvice: buildAiAdvice(attendancePercentage, averageGpaValue, summary.assignments.pending),
      avatarUrl: row.user.avatar,
      classLabel: row.class ? `${row.class.grade} ${row.class.section ?? ""}`.trim() : null,
      dateOfBirth: row.student.dateOfBirth,
      email: row.user.email,
      fullName: `${row.user.firstName} ${row.user.lastName}`.trim(),
      phone: row.user.phone,
    }
  }

  async getStats(tenantId: string, userId: string): Promise<StudentDashboardStatsView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)
    const summary = await this.studentsSummaryRepository.getSummary(tenantId, row.student.id)

    const [behaviorRow] = await db
      .select({
        positiveCount:
          sql<number>`sum(case when ${studentBehaviorLogs.entryType} = 'positive_note' then 1 else 0 end)::int`.as(
            "positive_count"
          ),
      })
      .from(studentBehaviorLogs)
      .where(
        and(
          eq(studentBehaviorLogs.tenantId, tenantId),
          eq(studentBehaviorLogs.studentId, row.student.id),
          isNull(studentBehaviorLogs.deletedAt)
        )
      )

    const [scholarshipRow] = await db
      .select({ count: sql<number>`count(*)::int`.as("count") })
      .from(studentScholarships)
      .where(
        and(
          eq(studentScholarships.tenantId, tenantId),
          eq(studentScholarships.studentId, row.student.id),
          isNull(studentScholarships.deletedAt)
        )
      )

    const [extracurricularRow] = await db
      .select({ count: sql<number>`count(*)::int`.as("count") })
      .from(studentExtracurricularRecords)
      .where(
        and(
          eq(studentExtracurricularRecords.tenantId, tenantId),
          eq(studentExtracurricularRecords.studentId, row.student.id),
          isNull(studentExtracurricularRecords.deletedAt)
        )
      )

    return {
      attendancePercentage: calculateAttendancePercentage(summary.attendance),
      rewardPoints:
        Math.round(summary.gradeAverage) +
        (behaviorRow?.positiveCount ?? 0) * 25 +
        (scholarshipRow?.count ?? 0) * 40 +
        (extracurricularRow?.count ?? 0) * 20 +
        summary.assignments.submitted * 5,
      taskCompletedCount: summary.assignments.submitted,
      taskInProgressPercentage:
        summary.assignments.total > 0
          ? roundPercentage((summary.assignments.pending / summary.assignments.total) * 100)
          : 0,
    }
  }

  async getPerformanceSummary(
    tenantId: string,
    userId: string
  ): Promise<StudentDashboardPerformanceSummaryView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)
    const summary = await this.studentsSummaryRepository.getSummary(tenantId, row.student.id)

    return {
      averageGpaMax: GPA_MAX,
      averageGpaValue: normalizeScoreToGpa(summary.gradeAverage),
      rangeLabel: "1st Semester – 6th Semester",
    }
  }

  async getScoreActivity(
    tenantId: string,
    userId: string
  ): Promise<StudentDashboardScoreActivityView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)
    const latestRows = await db
      .select({
        id: grades.id,
        recordedAt: grades.createdAt,
        score: grades.score,
      })
      .from(grades)
      .where(
        and(
          eq(grades.tenantId, tenantId),
          eq(grades.studentId, row.student.id),
          isNull(grades.deletedAt)
        )
      )
      .orderBy(desc(grades.createdAt))
      .limit(7)

    const sortedRows = [...latestRows].reverse()
    const basePoints =
      sortedRows.length > 0
        ? sortedRows.map((item) => ({
            id: item.id,
            recordedAt: item.recordedAt.toISOString(),
            value: Number(item.score),
          }))
        : buildFallbackScorePoints()

    return {
      period: "weekly",
      points: basePoints,
    }
  }

  async getLessons(tenantId: string, userId: string): Promise<StudentDashboardLessonsView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)

    if (!row.student.classId) {
      return { sections: DAY_SCOPES.map((scope) => ({ id: scope, lessons: [] })) }
    }

    const today = new Date()
    const todayDayKey = resolveScheduleDayKey(today.getDay())
    const tomorrowDate = new Date(today)
    tomorrowDate.setDate(today.getDate() + 1)
    const tomorrowDayKey = resolveScheduleDayKey(tomorrowDate.getDay())

    const lessonRows = await db
      .select({
        dayOfWeek: schedules.dayOfWeek,
        endTime: schedules.endTime,
        id: schedules.id,
        room: schedules.room,
        startTime: schedules.startTime,
        subjectName: subjects.name,
        teacherFirstName: users.firstName,
        teacherLastName: users.lastName,
      })
      .from(schedules)
      .innerJoin(subjects, eq(subjects.id, schedules.subjectId))
      .innerJoin(teachers, eq(teachers.id, schedules.teacherId))
      .innerJoin(users, eq(users.id, teachers.userId))
      .where(
        and(
          eq(schedules.tenantId, tenantId),
          eq(schedules.classId, row.student.classId),
          or(eq(schedules.dayOfWeek, todayDayKey), eq(schedules.dayOfWeek, tomorrowDayKey))!,
          isNull(schedules.deletedAt),
          isNull(subjects.deletedAt),
          isNull(teachers.deletedAt),
          isNull(users.deletedAt)
        )
      )
      .orderBy(asc(schedules.dayOfWeek), asc(schedules.startTime))

    return {
      sections: DAY_SCOPES.map((scope) => ({
        id: scope,
        lessons: lessonRows
          .filter((lesson) =>
            scope === "today"
              ? lesson.dayOfWeek === todayDayKey
              : lesson.dayOfWeek === tomorrowDayKey
          )
          .map((lesson) => ({
            dayScope: scope,
            endTime: lesson.endTime.slice(0, 5),
            id: lesson.id,
            roomLabel: lesson.room,
            startTime: lesson.startTime.slice(0, 5),
            subjectName: lesson.subjectName,
            teacherName: `${lesson.teacherFirstName} ${lesson.teacherLastName}`.trim(),
          })),
      })),
    }
  }

  async getGradesBySubject(
    tenantId: string,
    userId: string
  ): Promise<StudentDashboardSubjectGradesView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)
    const gradeRows = await db
      .select({
        score: sql<number>`round(avg((${grades.score})::numeric), 0)::int`.as("score"),
        subjectName: subjects.name,
      })
      .from(grades)
      .innerJoin(subjects, eq(subjects.id, grades.subjectId))
      .where(
        and(
          eq(grades.tenantId, tenantId),
          eq(grades.studentId, row.student.id),
          isNull(grades.deletedAt)
        )
      )
      .groupBy(subjects.name)
      .orderBy(desc(sql`round(avg((${grades.score})::numeric), 0)::int`), asc(subjects.name))
      .limit(6)

    return {
      subjects:
        gradeRows.length > 0
          ? gradeRows.map((rowItem) => ({ score: rowItem.score, subjectName: rowItem.subjectName }))
          : buildFallbackSubjectGrades(),
    }
  }

  async getAssignments(
    tenantId: string,
    userId: string,
    page: number,
    limit: number,
    search: string | undefined
  ): Promise<StudentDashboardAssignmentsView> {
    const row = await this.studentsRepository.findStudentRowByUserIdOrThrow(tenantId, userId)

    if (!row.student.classId) {
      return { meta: { limit, page: 1, total: 0, totalPages: 1 }, rows: [] }
    }

    const filters: SQL[] = [
      eq(assignments.tenantId, tenantId),
      eq(assignments.classId, row.student.classId),
      isNull(assignments.deletedAt),
      isNull(subjects.deletedAt),
    ]

    if (search && search.trim().length > 0) {
      const searchPattern = `%${search.trim()}%`
      filters.push(
        or(ilike(assignments.title, searchPattern), ilike(subjects.name, searchPattern))!
      )
    }

    const [totalRow] = await db
      .select({ total: sql<number>`count(*)::int`.as("total") })
      .from(assignments)
      .innerJoin(subjects, eq(subjects.id, assignments.subjectId))
      .where(and(...filters))

    const total = totalRow?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const resolvedPage = Math.min(page, totalPages)
    const offset = (resolvedPage - 1) * limit

    const assignmentRows = await db
      .select({
        dueAt: assignments.dueDate,
        id: assignments.id,
        subjectName: subjects.name,
        taskTitle: assignments.title,
      })
      .from(assignments)
      .innerJoin(subjects, eq(subjects.id, assignments.subjectId))
      .where(and(...filters))
      .orderBy(asc(assignments.dueDate), asc(assignments.title))
      .limit(limit)
      .offset(offset)

    const submissionRows =
      assignmentRows.length > 0
        ? await db
            .select({
              assignmentId: assignmentSubmissions.assignmentId,
              submittedAt: assignmentSubmissions.submittedAt,
            })
            .from(assignmentSubmissions)
            .where(
              and(
                eq(assignmentSubmissions.tenantId, tenantId),
                eq(assignmentSubmissions.studentId, row.student.id),
                inArray(
                  assignmentSubmissions.assignmentId,
                  assignmentRows.map((assignment) => assignment.id)
                ),
                isNull(assignmentSubmissions.deletedAt)
              )
            )
        : []

    const submissionMap = new Map(
      submissionRows.map((item) => [item.assignmentId, item.submittedAt] as const)
    )

    return {
      meta: { limit, page: resolvedPage, total, totalPages },
      rows: assignmentRows.map((assignment, index) => ({
        dueAt: assignment.dueAt.toISOString(),
        id: assignment.id,
        order: offset + index + 1,
        status: resolveAssignmentStatus(assignment.dueAt, submissionMap.get(assignment.id)),
        subjectName: assignment.subjectName,
        taskTitle: assignment.taskTitle,
      })),
    }
  }
}

function buildAiAdvice(
  attendancePercentage: number,
  averageGpaValue: number,
  pendingAssignments: number
): string {
  if (averageGpaValue >= 3.6 && attendancePercentage >= 95) {
    return "Bugungi temp yaxshi. Shu barqarorlikni saqlasangiz, yakuniy natijalar yanada kuchli chiqadi."
  }

  if (pendingAssignments > 2) {
    return "Avval yakunlanmagan vazifalarni tartibga soling. Kichik bloklar bilan ishlasangiz, yuk kamayadi."
  }

  if (attendancePercentage < 85) {
    return "Davomatni barqarorlashtirish muhim. Har bir dars keyingi baholash natijasiga bevosita ta'sir qiladi."
  }

  return "Natijalar izchil. Shu haftada fanlar bo‘yicha bir xil tempni ushlab tursangiz, o‘sish davom etadi."
}

function buildFallbackScorePoints() {
  const baseDate = new Date(Date.UTC(2030, 3, 10, 9, 0, 0, 0))
  const values = [54, 66, 48, 79, 70, 58, 82]

  return values.map((value, index) => {
    const recordedAt = new Date(baseDate)
    recordedAt.setUTCDate(baseDate.getUTCDate() + index)

    return {
      id: `fallback-score-${index + 1}`,
      recordedAt: recordedAt.toISOString(),
      value,
    }
  })
}

function buildFallbackSubjectGrades() {
  return [
    { score: 82, subjectName: "Biology" },
    { score: 74, subjectName: "Chemistry" },
    { score: 69, subjectName: "Geography" },
    { score: 88, subjectName: "History" },
    { score: 91, subjectName: "Literature" },
    { score: 77, subjectName: "Art" },
  ] as const
}

function calculateAttendancePercentage(attendance: {
  absent: number
  excused: number
  late: number
  present: number
}) {
  const total = attendance.present + attendance.late + attendance.excused + attendance.absent

  if (total === 0) {
    return 0
  }

  return roundPercentage(
    ((attendance.present + attendance.late + attendance.excused) / total) * 100
  )
}

function normalizeScoreToGpa(score: number) {
  const normalizedValue = (score / 100) * GPA_MAX
  return Math.round(normalizedValue * 10) / 10
}

function resolveAssignmentStatus(
  dueAt: Date,
  submittedAt: Date | undefined
): StudentDashboardAssignmentStatusView {
  if (submittedAt) {
    return "submitted"
  }

  const diffHours = (dueAt.getTime() - Date.now()) / (1000 * 60 * 60)

  if (diffHours <= 36) {
    return "notStarted"
  }

  return "inProgress"
}

function roundPercentage(value: number) {
  return Math.round(value * 10) / 10
}

function resolveScheduleDayKey(dayIndex: number) {
  return DAY_OF_WEEK_BY_INDEX[dayIndex] ?? "monday"
}
