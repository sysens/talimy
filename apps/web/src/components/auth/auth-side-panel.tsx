"use client"

import { Avatar, AvatarFallback, Badge, Card, CardContent } from "@talimy/ui"
import { useTranslations } from "next-intl"

import {
  getAuthWorkspaceContent,
  type AuthWorkspaceKind,
} from "@/components/auth/auth-workspace-content"

type AuthSidePanelProps = {
  workspaceKind: AuthWorkspaceKind
}

export function AuthSidePanel({ workspaceKind }: AuthSidePanelProps) {
  const t = useTranslations("authPage")
  const content = getAuthWorkspaceContent(t, workspaceKind)

  return (
    <div className="flex h-full flex-col rounded-[2rem] bg-[linear-gradient(180deg,rgba(254,204,253,0.92),rgba(254,204,253,0.78))] text-talimy-navy shadow-[0_28px_60px_rgba(21,68,110,0.12)] xl:p-6">
      <div className="relative flex h-full flex-col justify-around overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(254,204,253,0.35),rgba(254,204,253,0.18))]">
        <div className="pointer-events-none absolute -left-40 top-16 h-96 w-96 rounded-full border-26 border-(--talimy-color-pink)/24" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-104 w-104 rounded-full border-26 border-(--talimy-color-pink)/14" />

        <div className="relative space-y-6">
          <div className="space-y-4">
            <h2 className="max-w-[18ch] text-[52px] font-semibold leading-[1.08] tracking-tight">
              {content.marketingTitle}
            </h2>
            <p className="max-w-xl text-lg leading-8 text-talimy-navy/82">
              {content.marketingDescription}
            </p>
          </div>
        </div>

        <Card className="relative overflow-hidden rounded-[1.75rem] border-none bg-white/95 shadow-[0_26px_70px_rgba(21,68,110,0.14)]">
          <CardContent className="relative space-y-5 p-8">
            <div className="absolute right-0 top-0 flex size-16 items-center justify-center rounded-bl-[1.5rem] bg-white">
              <div className="rounded-[1.15rem] bg-talimy-sky/48 p-3 text-talimy-navy shadow-inner">
                <svg
                  aria-hidden="true"
                  className="size-8"
                  fill="none"
                  viewBox="0 0 34 34"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 7.5V26.5M7.5 17H26.5M10.25 10.25L23.75 23.75M23.75 10.25L10.25 23.75"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.4"
                  />
                </svg>
              </div>
            </div>

            <div className="max-w-xl space-y-3 pr-14">
              <h3 className="text-[1.8rem] font-semibold leading-tight text-talimy-navy">
                {content.marketingCardTitle}
              </h3>
              <p className="text-base leading-7 text-slate-600">
                {content.marketingCardDescription}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <div className="flex -space-x-3">
                {["SA", "TE", "ST"].map((initials) => (
                  <Avatar key={initials} className="size-12 border-2 border-white bg-talimy-sky/38">
                    <AvatarFallback className="bg-talimy-sky/52 text-sm font-semibold text-talimy-navy">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <Avatar className="size-12 border-2 border-white bg-white">
                  <AvatarFallback className="bg-white text-xs font-semibold text-talimy-navy">
                    +365
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
