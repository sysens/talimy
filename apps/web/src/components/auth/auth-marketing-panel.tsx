import { Avatar, AvatarFallback, Badge, Card, CardContent } from "@talimy/ui"

import {
  getAuthWorkspaceContent,
  type AuthWorkspaceKind,
} from "@/components/auth/auth-workspace-copy"

type AuthMarketingPanelProps = {
  workspaceKind: AuthWorkspaceKind
}

export function AuthMarketingPanel({ workspaceKind }: AuthMarketingPanelProps) {
  const content = getAuthWorkspaceContent(workspaceKind)

  return (
    <div className="flex h-full flex-col rounded-[2rem] bg-[linear-gradient(180deg,rgba(254,204,253,0.82),rgba(254,204,253,0.66))] p-8 text-[color:var(--talimy-color-navy)] shadow-[0_28px_60px_rgba(21,68,110,0.12)] xl:p-10">
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(254,204,253,0.38),rgba(254,204,253,0.16))] p-8">
        <div className="pointer-events-none absolute left-[-4rem] top-14 h-72 w-72 rounded-full border-[22px] border-[color:var(--talimy-color-pink)]/30" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[-6rem] h-80 w-80 rounded-full border-[22px] border-[color:var(--talimy-color-pink)]/14" />

        <div className="relative space-y-5">
          <Badge className="rounded-full bg-white/76 px-4 py-2 text-[0.7rem] font-semibold tracking-[0.28em] text-[color:var(--talimy-color-navy)] uppercase shadow-none">
            {content.workspaceBadge}
          </Badge>
          <div className="space-y-4">
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight xl:text-[3.75rem]">
              {content.marketingTitle}
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--talimy-color-navy)]/82">
              {content.marketingDescription}
            </p>
          </div>
        </div>

        <Card className="relative mt-12 overflow-hidden rounded-[1.75rem] border-none bg-white/92 shadow-[0_26px_70px_rgba(21,68,110,0.14)]">
          <CardContent className="space-y-6 p-8">
            <div className="flex items-start justify-between gap-5">
              <div className="space-y-3">
                <h3 className="text-[1.85rem] font-semibold leading-tight text-[color:var(--talimy-color-navy)]">
                  {content.marketingCardTitle}
                </h3>
                <p className="max-w-xl text-base leading-7 text-slate-600">
                  {content.marketingCardDescription}
                </p>
              </div>
              <div className="hidden rounded-[1.35rem] bg-[color:var(--talimy-color-sky)]/48 p-3 text-[color:var(--talimy-color-navy)] shadow-inner sm:flex">
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

            <div className="grid gap-3 sm:grid-cols-2">
              {content.audiences.map((audience) => (
                <div
                  key={audience.label}
                  className="rounded-2xl border border-slate-200/75 bg-slate-50/92 px-4 py-4"
                >
                  <p className="text-base font-semibold text-[color:var(--talimy-color-navy)]">
                    {audience.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{audience.description}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end">
              <div className="flex -space-x-3">
                {["SA", "TE", "ST"].map((initials) => (
                  <Avatar
                    key={initials}
                    className="size-12 border-2 border-white bg-[color:var(--talimy-color-sky)]/38"
                  >
                    <AvatarFallback className="bg-[color:var(--talimy-color-sky)]/52 text-sm font-semibold text-[color:var(--talimy-color-navy)]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <Avatar className="size-12 border-2 border-white bg-white">
                  <AvatarFallback className="bg-white text-xs font-semibold text-[color:var(--talimy-color-navy)]">
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
