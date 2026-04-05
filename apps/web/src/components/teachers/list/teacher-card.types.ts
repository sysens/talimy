export type TeacherCardSocialLink = {
  href: string
  icon: string
  label: string
}

export type TeacherCardData = {
  avatarFallback: string
  avatarUrl?: string
  href?: string
  email: string
  employeeId: string
  messageLabel?: string
  name: string
  phone: string
  socials: readonly TeacherCardSocialLink[]
  subject: string
}
