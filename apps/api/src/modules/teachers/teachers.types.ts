import type { dayOfWeekEnum } from "@talimy/database"

export type TeacherView = {
  address: string | null
  avatar: string | null
  id: string
  tenantId: string
  userId: string
  fullName: string
  email: string
  phone: string | null
  employeeId: string
  departmentKey:
    | "science"
    | "mathematics"
    | "language"
    | "social"
    | "arts"
    | "physicalEducation"
    | "other"
  gender: "male" | "female"
  employmentType: "full_time" | "part_time" | "substitute"
  joinDate: string
  dateOfBirth: string | null
  qualification: string | null
  specialization: string | null
  subject: string
  salary: number | null
  status: "active" | "inactive" | "on_leave"
  createdAt: Date
  updatedAt: Date
}

export type TeacherScheduleItem = {
  id: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  dayOfWeek: (typeof dayOfWeekEnum.enumValues)[number]
  startTime: string
  endTime: string
  room: string | null
}
