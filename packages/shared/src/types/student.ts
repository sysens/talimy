export type {
  CreateStudentAlternativeGuardianInput,
  CreateStudentGuardianInput,
  ListStudentsQueryInput,
  CreateStudentInput,
  StudentCreateClassOptionInput,
  StudentCreateModuleSettingsInput,
  StudentFormOptionsQueryInput,
  UpdateStudentInput,
} from "../validators/student.schema"

export type StudentFormOptionItem = {
  id: string
  label: string
}

export type StudentCreateClassOption = {
  feeAmount: number | null
  grade: string
  id: string
  label: string
  section: string
}

export type StudentCreateModuleSettings = {
  contractNumberEnabled: boolean
  dormitoryEnabled: boolean
  financeEnabled: boolean
  grantEnabled: boolean
  mealsEnabled: boolean
  residencePermitEnabled: boolean
}

export type StudentCreateFormOptions = {
  admissionNumberPreview: string
  allowedGenders: readonly ("male" | "female")[]
  classes: readonly StudentCreateClassOption[]
  defaultGender: "male" | "female"
  moduleSettings: StudentCreateModuleSettings
  tenantId: string
  tenantSlug: string
}
