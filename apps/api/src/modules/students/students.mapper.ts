import type { classes, students, users } from "@talimy/database"

import type {
  StudentAttendanceItem,
  StudentGradeItem,
  StudentParentItem,
  StudentSummary,
  StudentView,
} from "./students.types"

export function toStudentView(
  student: typeof students.$inferSelect,
  user: typeof users.$inferSelect,
  classRow: typeof classes.$inferSelect | null
): StudentView {
  return {
    address: student.address,
    avatar: user.avatar,
    bloodGroup: student.bloodGroup,
    id: student.id,
    classId: student.classId,
    className: classRow?.name ?? null,
    createdAt: student.createdAt,
    dateOfBirth: student.dateOfBirth,
    email: user.email,
    enrollmentDate: student.enrollmentDate,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    gender: student.gender as "male" | "female",
    phone: user.phone,
    updatedAt: student.updatedAt,
    status: student.status,
    studentId: student.studentId,
    tenantId: student.tenantId,
    userId: student.userId,
  }
}

export function toStudentGradeItem(row: {
  id: string
  subject: string
  score: string
  grade: string | null
  comment: string | null
}): StudentGradeItem {
  return {
    id: row.id,
    subject: row.subject,
    score: Number(row.score),
    grade: row.grade,
    comment: row.comment,
  }
}

export function toStudentParentItem(row: {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  relationship: string
}): StudentParentItem {
  return {
    fullName: `${row.firstName} ${row.lastName}`.trim(),
    id: row.id,
    phone: row.phone,
    relationship: row.relationship,
  }
}

export function createEmptyStudentSummary(): StudentSummary {
  return {
    gradesCount: 0,
    gradeAverage: 0,
    attendance: { present: 0, absent: 0, late: 0, excused: 0 },
    assignments: { total: 0, submitted: 0, pending: 0 },
  }
}

export function normalizeAttendanceItems<T extends StudentAttendanceItem>(items: T[]): T[] {
  return items
}
