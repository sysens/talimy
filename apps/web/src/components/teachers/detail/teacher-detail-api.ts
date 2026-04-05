import { webApiFetch } from "@/lib/api"

import type {
  TeacherDetailAttendanceCalendarMonthRecord,
  TeacherDetailClassRecord,
  TeacherDetailDocumentRecord,
  TeacherDetailOverviewResponse,
  TeacherDetailPerformancePeriod,
  TeacherDetailPerformanceRecord,
  TeacherDetailRecord,
  TeacherDetailScheduleRecord,
  TeacherDetailTrainingRecord,
  TeacherDetailTrainingSemester,
  TeacherDetailWorkloadRange,
  TeacherDetailWorkloadRecord,
  TeacherDetailLeaveRequestRecord,
} from "@/components/teachers/detail/teacher-detail-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

export async function getTeacherDetailOverview(
  teacherId: string
): Promise<TeacherDetailOverviewResponse> {
  const [teacherResponse, classesResponse, scheduleResponse] = await Promise.all([
    webApiFetch<SuccessEnvelope<TeacherDetailRecord>>(`/teachers/${teacherId}`),
    webApiFetch<SuccessEnvelope<readonly TeacherDetailClassRecord[]>>(
      `/teachers/${teacherId}/classes`
    ),
    webApiFetch<SuccessEnvelope<readonly TeacherDetailScheduleRecord[]>>(
      `/teachers/${teacherId}/schedule`
    ),
  ])

  return {
    classes: classesResponse.data,
    schedule: scheduleResponse.data,
    teacher: teacherResponse.data,
  }
}

export async function getTeacherDetailDocuments(
  teacherId: string
): Promise<readonly TeacherDetailDocumentRecord[]> {
  const response = await webApiFetch<SuccessEnvelope<readonly TeacherDetailDocumentRecord[]>>(
    `/teachers/${teacherId}/documents`
  )

  return response.data
}

export async function getTeacherDetailWorkload(
  teacherId: string,
  range: TeacherDetailWorkloadRange
): Promise<readonly TeacherDetailWorkloadRecord[]> {
  const response = await webApiFetch<SuccessEnvelope<readonly TeacherDetailWorkloadRecord[]>>(
    `/teachers/${teacherId}/workload?range=${range}`
  )

  return response.data
}

export async function getTeacherDetailTraining(
  teacherId: string,
  semester: TeacherDetailTrainingSemester
): Promise<readonly TeacherDetailTrainingRecord[]> {
  const response = await webApiFetch<SuccessEnvelope<readonly TeacherDetailTrainingRecord[]>>(
    `/teachers/${teacherId}/training?semester=${semester}`
  )

  return response.data
}

export async function getTeacherDetailAttendanceCalendar(
  teacherId: string,
  month: string
): Promise<readonly TeacherDetailAttendanceCalendarMonthRecord[]> {
  const response = await webApiFetch<
    SuccessEnvelope<readonly TeacherDetailAttendanceCalendarMonthRecord[]>
  >(`/teachers/${teacherId}/attendance-calendar?month=${month}`)

  return response.data
}

export async function getTeacherDetailLeaveRequests(
  teacherId: string
): Promise<readonly TeacherDetailLeaveRequestRecord[]> {
  const response = await webApiFetch<SuccessEnvelope<readonly TeacherDetailLeaveRequestRecord[]>>(
    `/teachers/${teacherId}/leave-requests`
  )

  return response.data
}

export async function updateTeacherDetailLeaveRequest(
  teacherId: string,
  requestId: string,
  status: "approved" | "declined"
): Promise<TeacherDetailLeaveRequestRecord> {
  const response = await webApiFetch<SuccessEnvelope<TeacherDetailLeaveRequestRecord>>(
    `/teachers/${teacherId}/leave-requests/${requestId}`,
    {
      body: { status },
      method: "PATCH",
    }
  )

  return response.data
}

export async function getTeacherDetailPerformance(
  teacherId: string,
  period: TeacherDetailPerformancePeriod
): Promise<TeacherDetailPerformanceRecord> {
  const response = await webApiFetch<SuccessEnvelope<TeacherDetailPerformanceRecord>>(
    `/teachers/${teacherId}/performance?period=${period}`
  )

  return response.data
}
