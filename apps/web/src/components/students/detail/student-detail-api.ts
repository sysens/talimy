import { webApiFetch } from "@/lib/api"

import type {
  StudentDetailAcademicPerformancePeriod,
  StudentDetailAcademicPerformanceRecord,
  StudentDetailAttendanceCalendarMonthRecord,
  StudentDetailBehaviorLogRecord,
  StudentDetailDocumentRecord,
  StudentDetailExtracurricularRecord,
  StudentDetailHealthRecord,
  StudentDetailOverviewResponse,
  StudentDetailScholarshipRecord,
  StudentDetailRecord,
  StudentGuardianRecord,
} from "@/components/students/detail/student-detail-api.types"

type SuccessEnvelope<T> = {
  success: true
  data: T
}

function buildSearch(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value)
    }
  }

  const serialized = searchParams.toString()
  return serialized.length > 0 ? `?${serialized}` : ""
}

export async function getStudentDetailOverview(
  studentId: string
): Promise<StudentDetailOverviewResponse> {
  const [student, guardians] = await Promise.all([
    webApiFetch<SuccessEnvelope<StudentDetailRecord>>(`/students/${studentId}`).then(
      (response) => response.data
    ),
    webApiFetch<SuccessEnvelope<readonly StudentGuardianRecord[]>>(
      `/students/${studentId}/parents`
    ).then((response) => response.data),
  ])

  return { guardians, student }
}

export function getStudentDetailDocuments(studentId: string) {
  return webApiFetch<SuccessEnvelope<readonly StudentDetailDocumentRecord[]>>(
    `/students/${studentId}/documents`
  ).then((response) => response.data)
}

export function getStudentDetailAttendanceCalendar(studentId: string, month: string) {
  return webApiFetch<SuccessEnvelope<readonly StudentDetailAttendanceCalendarMonthRecord[]>>(
    `/students/${studentId}/attendance-calendar${buildSearch({ month })}`
  ).then((response) => response.data)
}

export function getStudentDetailScholarships(studentId: string) {
  return webApiFetch<SuccessEnvelope<readonly StudentDetailScholarshipRecord[]>>(
    `/students/${studentId}/scholarships`
  ).then((response) => response.data)
}

export function getStudentDetailHealth(studentId: string) {
  return webApiFetch<SuccessEnvelope<readonly StudentDetailHealthRecord[]>>(
    `/students/${studentId}/health`
  ).then((response) => response.data)
}

export function getStudentDetailAcademicPerformance(
  studentId: string,
  period: StudentDetailAcademicPerformancePeriod
) {
  return webApiFetch<SuccessEnvelope<StudentDetailAcademicPerformanceRecord>>(
    `/students/${studentId}/academic-performance${buildSearch({ period })}`
  ).then((response) => response.data)
}

export function getStudentDetailExtracurricular(studentId: string) {
  return webApiFetch<SuccessEnvelope<readonly StudentDetailExtracurricularRecord[]>>(
    `/students/${studentId}/extracurricular`
  ).then((response) => response.data)
}

export function getStudentDetailBehaviorLog(studentId: string) {
  return webApiFetch<SuccessEnvelope<readonly StudentDetailBehaviorLogRecord[]>>(
    `/students/${studentId}/behavior-log`
  ).then((response) => response.data)
}
