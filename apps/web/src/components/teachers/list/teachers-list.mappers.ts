import type {
  TeacherCardData,
  TeacherCardSocialLink,
} from "@/components/teachers/list/teacher-card.types"
import type { TeachersListItem } from "@/components/teachers/list/teachers-list-api.types"

function getAvatarFallback(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "TR"
}

function normalizePhone(phone: string | null): string {
  if (typeof phone === "string" && phone.trim().length > 0) {
    return phone.trim()
  }

  return "+998 00 000 00 00"
}

function toDigits(phone: string): string {
  return phone.replace(/\D/g, "")
}

function buildSocialLinks(item: TeachersListItem): readonly TeacherCardSocialLink[] {
  const phone = normalizePhone(item.phone)
  const phoneDigits = toDigits(phone)
  const telegramHandle =
    item.email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "_") ?? "talimy_teacher"

  return [
    {
      href: `https://t.me/${telegramHandle}`,
      icon: "mingcute:telegram-line",
      label: "Telegram",
    },
    {
      href: `https://wa.me/${phoneDigits}`,
      icon: "mingcute:whatsapp-line",
      label: "WhatsApp",
    },
  ] as const
}

export function toTeacherCardData(item: TeachersListItem, messageLabel: string): TeacherCardData {
  return {
    avatarFallback: getAvatarFallback(item.fullName),
    avatarUrl: item.avatar ?? undefined,
    email: item.email,
    employeeId: item.employeeId,
    href: `/admin/teachers/${item.id}`,
    messageLabel,
    name: item.fullName,
    phone: normalizePhone(item.phone),
    socials: buildSocialLinks(item),
    subject: item.subject,
  }
}
