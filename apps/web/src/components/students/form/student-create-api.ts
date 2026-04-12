import type { CreateStudentInput } from "@talimy/shared"

import { webApiFetch } from "@/lib/api"

import type {
  StudentCreateFormOptionsResponse,
  StudentCreateResponse,
} from "./student-create-api.types"

type SuccessEnvelope<T> = {
  data: T
  success: true
}

export async function getStudentCreateFormOptions(): Promise<StudentCreateFormOptionsResponse> {
  const response =
    await webApiFetch<SuccessEnvelope<StudentCreateFormOptionsResponse>>("/students/form-options")

  return response.data
}

export async function createStudent(
  payload: Omit<CreateStudentInput, "tenantId">
): Promise<StudentCreateResponse> {
  const response = await webApiFetch<SuccessEnvelope<StudentCreateResponse>>("/students", {
    body: payload,
    method: "POST",
  })

  return response.data
}
