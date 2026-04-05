"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent } from "@talimy/ui"
import { Icon } from "@iconify/react"
import { Eye, Mail, Phone } from "lucide-react"

import type { TeacherCardData } from "@/components/teachers/list/teacher-card.types"

export function TeacherCard({
  avatarFallback,
  avatarUrl,
  email,
  employeeId,
  href,
  messageLabel = "Message",
  name,
  phone,
  socials,
  subject,
}: TeacherCardData) {
  const router = useRouter()

  function handleView(): void {
    if (typeof href === "string" && href.length > 0) {
      router.push(href)
    }
  }

  return (
    <Card className="relative w-full rounded-[28px] border border-slate-100 bg-white p-4 shadow-none transition-shadow duration-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] flex flex-col justify-center">
      <CardContent className="gap-4 p-0">
        <div className="flex min-h-[76px] items-start gap-3">
          <Avatar className="size-[52px] rounded-full">
            {avatarUrl ? <AvatarImage alt={name} src={avatarUrl} className="object-cover" /> : null}
            <AvatarFallback className="bg-[var(--talimy-color-pink)]/45 text-sm font-semibold text-talimy-navy">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold leading-6 text-talimy-navy">{name}</p>
            <p className="mt-1 min-h-10 text-sm leading-5 text-slate-400">
              {employeeId} · {subject}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-4xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Phone className="size-4 text-slate-400" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Mail className="size-4 text-slate-400" />
            <span className="truncate">{email}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <Button
                size="icon"
                aria-label={social.label}
                className="size-9 min-w-9 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-none hover:bg-slate-50"
                key={social.label}
                onClick={() => {
                  window.open(social.href, "_blank", "noopener,noreferrer")
                }}
                variant="outline"
              >
                <Icon className="size-4 text-slate-700" icon={social.icon} />
              </Button>
            ))}
          </div>

          <Button
            className="h-10 rounded-2xl bg-[var(--talimy-color-sky)]/55 px-4 text-sm font-medium text-talimy-navy shadow-none hover:bg-[var(--talimy-color-sky)]/75"
            onClick={handleView}
            variant="secondary"
          >
            <Eye className="size-4" />
            <span>{messageLabel}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
