export type StudentView = {
  address: string | null
  avatar: string | null
  bloodGroup: string | null
  id: string
  classId: string | null
  className: string | null
  createdAt: Date
  dateOfBirth: string | null
  email: string
  enrollmentDate: string
  fullName: string
  gender: "male" | "female"
  phone: string | null
  updatedAt: Date
  status: "active" | "inactive" | "graduated" | "transferred"
  studentId: string
  tenantId: string
  userId: string
}

export type StudentCreateResult = {
  admissionNumber: string
  fullName: string
  id: string
  studentId: string
}

export type StudentGradeItem = {
  id: string
  subject: string
  score: number
  grade: string | null
  comment: string | null
}

export type StudentAttendanceItem = {
  id: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  note: string | null
}

export type StudentParentItem = {
  fullName: string
  id: string
  phone: string | null
  relationship: string
}

export type StudentSummary = {
  gradesCount: number
  gradeAverage: number
  attendance: { present: number; absent: number; late: number; excused: number }
  assignments: { total: number; submitted: number; pending: number }
}
