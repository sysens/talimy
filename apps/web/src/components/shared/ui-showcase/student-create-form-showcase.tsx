"use client"

import type { StudentCreateFormOptions } from "@talimy/shared"

import { StudentCreateForm } from "@/components/students/form/student-form"

const SHOWCASE_FORM_OPTIONS: StudentCreateFormOptions = {
  admissionNumberPreview: "ADM-1016",
  allowedGenders: ["male", "female"],
  classes: [
    {
      feeAmount: 1800,
      grade: "7",
      id: "11111111-1111-4111-8111-111111111111",
      label: "7A",
      section: "A",
    },
    {
      feeAmount: 1800,
      grade: "7",
      id: "22222222-2222-4222-8222-222222222222",
      label: "7B",
      section: "B",
    },
    {
      feeAmount: 1950,
      grade: "8",
      id: "33333333-3333-4333-8333-333333333333",
      label: "8A",
      section: "A",
    },
  ],
  defaultGender: "male",
  moduleSettings: {
    contractNumberEnabled: true,
    dormitoryEnabled: true,
    financeEnabled: true,
    grantEnabled: true,
    mealsEnabled: true,
    residencePermitEnabled: true,
  },
  tenantId: "eddbf523-f288-402a-9a16-ef93d27aafc7",
  tenantSlug: "mezana",
}

export function StudentCreateFormShowcase() {
  return (
    <StudentCreateForm
      className="max-w-6xl"
      formOptions={SHOWCASE_FORM_OPTIONS}
      onSubmit={async () => undefined}
    />
  )
}
