import type { CreateTeacherInput } from "@talimy/shared"

import { webApiFetch } from "@/lib/api"

import type {
  TeacherCreateFormOptionsResponse,
  TeacherCreateResponse,
} from "./teacher-create-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

export async function getTeacherCreateFormOptions(): Promise<TeacherCreateFormOptionsResponse> {
  const response =
    await webApiFetch<SuccessEnvelope<TeacherCreateFormOptionsResponse>>("/teachers/form-options")

  return response.data
}

export async function createTeacher(
  payload: Omit<CreateTeacherInput, "tenantId">
): Promise<TeacherCreateResponse> {
  const response = await webApiFetch<SuccessEnvelope<TeacherCreateResponse>>("/teachers", {
    body: payload,
    method: "POST",
  })

  return response.data
}
