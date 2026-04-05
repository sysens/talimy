export type {
  CreateTeacherDocumentInput,
  CreateTeacherInput,
  ListTeachersQueryInput,
  TeacherFormOptionsQueryInput,
  UpdateTeacherInput,
} from "../validators/teacher.schema"

export type TeacherFormOptionItem = {
  id: string
  label: string
}

export type TeacherCreateFormOptions = {
  allowedGenders: readonly ("male" | "female")[]
  classes: readonly TeacherFormOptionItem[]
  defaultGender: "male" | "female"
  subjects: readonly TeacherFormOptionItem[]
  tenantId: string
}
