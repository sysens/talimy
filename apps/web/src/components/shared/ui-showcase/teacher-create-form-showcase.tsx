"use client"

import type { TeacherCreateFormOptions } from "@talimy/shared"

import { TeacherCreateForm } from "@/components/teachers/form/teacher-form"

const SHOWCASE_FORM_OPTIONS: TeacherCreateFormOptions = {
  allowedGenders: ["male", "female"],
  classes: [
    { id: "11111111-1111-4111-8111-111111111111", label: "7A" },
    { id: "22222222-2222-4222-8222-222222222222", label: "8A" },
    { id: "33333333-3333-4333-8333-333333333333", label: "9B" },
  ],
  defaultGender: "male",
  subjects: [
    { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", label: "English Language" },
    { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", label: "Mathematics" },
    { id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", label: "Science" },
  ],
  tenantId: "eddbf523-f288-402a-9a16-ef93d27aafc7",
}

export function TeacherCreateFormShowcase() {
  return (
    <TeacherCreateForm
      className="max-w-6xl"
      formOptions={SHOWCASE_FORM_OPTIONS}
      onSubmit={async () => undefined}
    />
  )
}
