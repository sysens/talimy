export type AuthWorkspaceKind = "platform" | "school"

type WorkspaceAudience = {
  description: string
  label: string
}

export type AuthWorkspaceContent = {
  loginDescription: string
  loginFooter: string
  loginTitle: string
  marketingCardDescription: string
  marketingCardTitle: string
  marketingDescription: string
  marketingTitle: string
  audiences: WorkspaceAudience[]
  workspaceBadge: string
}

const PLATFORM_WORKSPACE_CONTENT: AuthWorkspaceContent = {
  workspaceBadge: "Platform Workspace",
  loginTitle: "Platform admin login",
  loginDescription:
    "Platform admin school onboarding, billing, and tenant operations only platform workspace orqali boshqariladi.",
  loginFooter:
    "Platform admin akkauntlari ichki tartibda yaratiladi. Yangi school admin foydalanuvchilari platform panel orqali taklif qilinadi.",
  marketingTitle: "Manage every school from the Talimy platform workspace.",
  marketingDescription:
    "Platform adminlar maktab qo'shadi, subdomain biriktiradi va school adminlarga tenantga bog'langan magic link yuboradi.",
  marketingCardTitle: "Magic-link onboarding is tenant-bound.",
  marketingCardDescription:
    "Invite link har doim kerakli workspace hostida ochiladi. Platform va school autentifikatsiyasi bir-biridan ajratilgan.",
  audiences: [
    {
      label: "Platform admin",
      description: "Schools, billing, security, and platform-wide settings.",
    },
    {
      label: "School onboarding",
      description: "Add school, assign subdomain, send first admin invite.",
    },
  ],
}

const SCHOOL_WORKSPACE_CONTENT: AuthWorkspaceContent = {
  workspaceBadge: "School Workspace",
  loginTitle: "School workspace login",
  loginDescription:
    "School admin, teacher, student, va parent foydalanuvchilari faqat shu maktab subdomaini orqali kiradi.",
  loginFooter:
    "Hisoblar self-register qilinmaydi. Maktab admini foydalanuvchilarni yaratadi va email magic link yuboradi.",
  marketingTitle: "One school workspace for admins, teachers, students, and parents.",
  marketingDescription:
    "Har bir rol tenantga bog'langan. Invite va forgot-password oqimlari aynan shu maktab domenida ishlaydi.",
  marketingCardTitle: "Password setup and recovery use email magic links.",
  marketingCardDescription:
    "School admin, teacher, student, va parent foydalanuvchilari parolni invite yoki forgot-password magic link orqali o'rnatadi.",
  audiences: [
    {
      label: "School admin",
      description: "Teachers, students, finance, schedule, and school settings.",
    },
    {
      label: "Teacher",
      description: "Attendance, assignments, exams, schedule, and notices.",
    },
    {
      label: "Student",
      description: "Assignments, grades, exams, attendance, and notices.",
    },
    {
      label: "Parent",
      description: "Child overview, attendance, grades, and school notices.",
    },
  ],
}

export function getAuthWorkspaceContent(kind: AuthWorkspaceKind): AuthWorkspaceContent {
  return kind === "platform" ? PLATFORM_WORKSPACE_CONTENT : SCHOOL_WORKSPACE_CONTENT
}
