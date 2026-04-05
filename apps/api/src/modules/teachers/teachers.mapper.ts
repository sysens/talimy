import type { teachers, users } from "@talimy/database"

import { resolveDepartmentKey, resolveDepartmentLabel } from "./teachers-analytics.utils"
import type { TeacherView } from "./teachers.types"

export function toTeacherView(
  teacher: typeof teachers.$inferSelect,
  user: typeof users.$inferSelect
): TeacherView {
  const fullName = `${user.firstName} ${user.lastName}`.trim()
  return {
    address: user.address ?? null,
    avatar: user.avatar ?? null,
    departmentKey: resolveDepartmentKey(teacher.specialization),
    id: teacher.id,
    tenantId: teacher.tenantId,
    userId: teacher.userId,
    fullName,
    email: user.email,
    phone: user.phone ?? null,
    employeeId: teacher.employeeId,
    gender: teacher.gender as "male" | "female",
    employmentType: teacher.employmentType,
    joinDate: teacher.joinDate,
    dateOfBirth: teacher.dateOfBirth,
    qualification: teacher.qualification,
    specialization: teacher.specialization,
    subject: teacher.specialization ?? resolveDepartmentLabel("other"),
    salary: teacher.salary === null ? null : Number(teacher.salary),
    status: teacher.status,
    createdAt: teacher.createdAt,
    updatedAt: teacher.updatedAt,
  }
}
