"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@talimy/ui"
import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslations } from "next-intl"
import { sileo } from "sileo"

import {
  readStudentCreateDraft,
  saveStudentCreateDraft,
} from "@/components/students/form/student-create-draft"
import { StudentCreateAcademicSection } from "@/components/students/form/student-create-academic-section"
import { StudentCreateActions } from "@/components/students/form/student-create-actions"
import { StudentCreateAdditionalSection } from "@/components/students/form/student-create-additional-section"
import { StudentCreateAdministrationSection } from "@/components/students/form/student-create-administration-section"
import { StudentCreateContactSection } from "@/components/students/form/student-create-contact-section"
import { StudentCreateGuardianSection } from "@/components/students/form/student-create-guardian-section"
import { StudentCreateModulesSection } from "@/components/students/form/student-create-modules-section"
import { StudentCreatePersonalSection } from "@/components/students/form/student-create-personal-section"
import {
  createStudentFormSchema,
  STUDENT_CREATE_FORM_DEFAULT_VALUES,
  type StudentCreateFormValues,
} from "@/components/students/form/student-form.schema"
import type { StudentCreateFormProps } from "@/components/students/form/student-form.types"
import {
  buildStudentEmail,
  buildStudentGradeOptions,
  buildStudentSectionOptions,
  resolveStudentClassFeeAmount,
  resolveStudentClassId,
} from "@/components/students/form/student-form.utils"

function buildInitialStudentFormValues(
  formOptions: StudentCreateFormProps["formOptions"]
): StudentCreateFormValues {
  const firstClass = formOptions.classes[0]
  const defaultGrade = firstClass?.grade ?? ""
  const defaultSection = firstClass?.section ?? ""
  const defaultClassId = firstClass?.id ?? ""
  const defaultTotalFee =
    formOptions.moduleSettings.financeEnabled && typeof firstClass?.feeAmount === "number"
      ? String(firstClass.feeAmount)
      : ""

  return {
    ...STUDENT_CREATE_FORM_DEFAULT_VALUES,
    classId: defaultClassId,
    enrollmentDate: format(new Date(), "yyyy-MM-dd"),
    gender: formOptions.defaultGender,
    grade: defaultGrade,
    section: defaultSection,
    totalFee: defaultTotalFee,
  }
}

export function StudentCreateForm({
  className,
  formOptions,
  isSubmitting = false,
  onSubmit,
}: StudentCreateFormProps) {
  const t = useTranslations("adminStudents.create")
  const schema = useMemo(
    () =>
      createStudentFormSchema({
        addressRequired: t("validation.addressRequired"),
        alternativeGuardianFirstNameRequired: t("validation.alternativeGuardianFirstNameRequired"),
        alternativeGuardianLastNameRequired: t("validation.alternativeGuardianLastNameRequired"),
        alternativeGuardianPhoneRequired: t("validation.alternativeGuardianPhoneRequired"),
        alternativeGuardianRelationRequired: t("validation.alternativeGuardianRelationRequired"),
        classRequired: t("validation.classRequired"),
        dateOfBirthRequired: t("validation.dateOfBirthRequired"),
        emailInvalid: t("validation.emailInvalid"),
        emailRequired: t("validation.emailRequired"),
        enrollmentDateRequired: t("validation.enrollmentDateRequired"),
        fatherFirstNameRequired: t("validation.fatherFirstNameRequired"),
        fatherLastNameRequired: t("validation.fatherLastNameRequired"),
        fatherPhoneInvalid: t("validation.fatherPhoneInvalid"),
        firstNameRequired: t("validation.firstNameRequired"),
        gradeRequired: t("validation.gradeRequired"),
        lastNameRequired: t("validation.lastNameRequired"),
        medicalConditionDetailsRequired: t("validation.medicalConditionDetailsRequired"),
        motherFirstNameRequired: t("validation.motherFirstNameRequired"),
        motherLastNameRequired: t("validation.motherLastNameRequired"),
        motherPhoneInvalid: t("validation.motherPhoneInvalid"),
        paidAmountInvalid: t("validation.paidAmountInvalid"),
        paidAmountTooLarge: t("validation.paidAmountTooLarge"),
        phoneInvalid: t("validation.phoneInvalid"),
        phoneRequired: t("validation.phoneRequired"),
        previousSchoolRequired: t("validation.previousSchoolRequired"),
        sectionRequired: t("validation.sectionRequired"),
        totalFeeInvalid: t("validation.totalFeeInvalid"),
      }),
    [t]
  )
  const form = useForm<StudentCreateFormValues>({
    defaultValues: buildInitialStudentFormValues(formOptions),
    mode: "onChange",
    resolver: zodResolver(schema),
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [hasManualEmailOverride, setHasManualEmailOverride] = useState(false)

  const firstName = useWatch({ control: form.control, name: "firstName" })
  const lastName = useWatch({ control: form.control, name: "lastName" })
  const grade = useWatch({ control: form.control, name: "grade" })
  const section = useWatch({ control: form.control, name: "section" })

  const generatedEmail = useMemo(
    () => buildStudentEmail(firstName, lastName, formOptions.tenantSlug),
    [firstName, formOptions.tenantSlug, lastName]
  )
  const gradeOptions = useMemo(
    () => buildStudentGradeOptions(formOptions.classes),
    [formOptions.classes]
  )
  const sectionOptions = useMemo(
    () => buildStudentSectionOptions(formOptions.classes, grade),
    [formOptions.classes, grade]
  )
  const classLabel = useMemo(() => {
    if (grade.length === 0 || section.length === 0) {
      return ""
    }

    const matchingClass = formOptions.classes.find(
      (option) => option.grade === grade && option.section === section
    )

    return matchingClass?.label ?? `${grade}${section}`
  }, [formOptions.classes, grade, section])

  useEffect(() => {
    const draftValues = readStudentCreateDraft(formOptions.tenantId)
    if (!draftValues) {
      return
    }

    form.reset({
      ...buildInitialStudentFormValues(formOptions),
      ...draftValues,
    })

    const nextGeneratedEmail = buildStudentEmail(
      draftValues.firstName,
      draftValues.lastName,
      formOptions.tenantSlug
    )
    setHasManualEmailOverride(
      draftValues.email.trim().length > 0 && draftValues.email.trim() !== nextGeneratedEmail
    )
  }, [form, formOptions])

  useEffect(() => {
    if (grade.length === 0) {
      if (section.length > 0) {
        form.setValue("section", "", { shouldDirty: true, shouldValidate: true })
      }
      form.setValue("classId", "", { shouldDirty: true, shouldValidate: true })
      return
    }

    if (section.length === 0 && sectionOptions.length === 1) {
      const [onlySection] = sectionOptions
      if (onlySection) {
        form.setValue("section", onlySection.value, { shouldDirty: true, shouldValidate: true })
      }
      return
    }

    const nextClassId = resolveStudentClassId(formOptions.classes, grade, section)
    form.setValue("classId", nextClassId, { shouldDirty: true, shouldValidate: true })

    if (section.length > 0 && !sectionOptions.some((option) => option.value === section)) {
      form.setValue("section", "", { shouldDirty: true, shouldValidate: true })
    }

    const classFeeAmount = resolveStudentClassFeeAmount(formOptions.classes, nextClassId)
    if (
      formOptions.moduleSettings.financeEnabled &&
      typeof classFeeAmount === "number" &&
      form.getValues("totalFee").trim().length === 0
    ) {
      form.setValue("totalFee", String(classFeeAmount), {
        shouldDirty: false,
        shouldValidate: true,
      })
    }
  }, [
    form,
    formOptions.classes,
    formOptions.moduleSettings.financeEnabled,
    grade,
    section,
    sectionOptions,
  ])

  useEffect(() => {
    if (hasManualEmailOverride) {
      return
    }

    form.setValue("email", generatedEmail, { shouldDirty: false, shouldValidate: true })
  }, [form, generatedEmail, hasManualEmailOverride])

  function handleSaveDraft() {
    saveStudentCreateDraft(formOptions.tenantId, form.getValues())
    sileo.success({
      title: t("toasts.draftSavedTitle"),
      description: t("toasts.draftSavedDescription"),
      position: "top-center",
    })
  }

  async function handleValidSubmit(values: StudentCreateFormValues) {
    await onSubmit({
      avatarFile,
      values,
    })
  }

  return (
    <form className={cn("space-y-6", className)} onSubmit={form.handleSubmit(handleValidSubmit)}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <StudentCreatePersonalSection
            avatarFile={avatarFile}
            disabled={isSubmitting}
            form={form}
            formOptions={formOptions}
            onAvatarFileChange={setAvatarFile}
          />
          <StudentCreateContactSection
            disabled={isSubmitting}
            form={form}
            onEmailEdited={() => setHasManualEmailOverride(true)}
          />
          <StudentCreateGuardianSection disabled={isSubmitting} form={form} />
        </div>

        <div className="space-y-6">
          <StudentCreateAdministrationSection
            disabled={isSubmitting}
            form={form}
            gradeOptions={gradeOptions}
            sectionOptions={sectionOptions}
          />
          <StudentCreateAdditionalSection disabled={isSubmitting} form={form} />
          <StudentCreateAcademicSection
            classLabel={classLabel}
            disabled={isSubmitting}
            form={form}
            formOptions={formOptions}
          />
          <StudentCreateModulesSection
            disabled={isSubmitting}
            form={form}
            formOptions={formOptions}
          />
        </div>
      </div>

      <StudentCreateActions isSubmitting={isSubmitting} onSaveDraft={handleSaveDraft} />
    </form>
  )
}
