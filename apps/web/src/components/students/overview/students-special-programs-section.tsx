"use client"

import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@heroui/react"
import { cn } from "@talimy/ui"

import { PersonAvatar } from "@/components/shared/avatar/person-avatar"
import { MetricProgressCard } from "@/components/shared/performance/metric-progress-card"
import { getStudentsSpecialPrograms } from "@/components/students/overview/students-overview-api"
import { studentsOverviewQueryKeys } from "@/components/students/overview/students-overview-query-keys"

type SpecialProgramTone = "sky" | "pink" | "mixed"

type SpecialProgramItem = {
  avatarUrl: string
  classLabel: string
  id: string
  name: string
  programName: string
  tone: SpecialProgramTone
  typeLabel: string
}

const PROGRAM_LABEL_CLASS_NAMES: Record<SpecialProgramTone, string> = {
  mixed: "text-[#6f63d9]",
  pink: "text-[#5f7fe9]",
  sky: "text-[#4a9ecf]",
}

function SpecialProgramRow({ item }: { item: SpecialProgramItem }) {
  const avatarFallback = item.name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="grid-cols-[26px_minmax(0,1fr)_auto] items-start gap-x-3 bg-white p-4 flex rounded-2xl">
      <PersonAvatar
        alt={item.name}
        className="mt-0.5 size-[26px] shrink-0 rounded-full"
        fallback={avatarFallback}
        fallbackClassName="bg-[var(--talimy-color-pink)]/45 text-[11px] font-semibold text-talimy-navy"
        src={item.avatarUrl}
      />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold leading-none text-talimy-navy">
          {item.name}
        </p>
        <p className="mt-1 text-[8px] leading-none text-slate-400">
          {item.id} · {item.classLabel}
        </p>
        <p className="mt-1.5 truncate text-[9px] leading-none text-slate-500">{item.programName}</p>
      </div>
      <span
        className={cn(
          "pt-0.5 text-right text-[8px] font-medium leading-none",
          PROGRAM_LABEL_CLASS_NAMES[item.tone]
        )}
      >
        {item.typeLabel}
      </span>
    </div>
  )
}

export function StudentsSpecialProgramsSection() {
  const t = useTranslations("adminStudents.overview.specialPrograms")
  const limit = 4
  const specialProgramsQuery = useQuery({
    queryFn: () => getStudentsSpecialPrograms(limit),
    queryKey: studentsOverviewQueryKeys.specialPrograms(limit),
    staleTime: 60_000,
  })
  const items = (specialProgramsQuery.data?.items ?? []).map((item) => ({
    ...item,
    avatarUrl:
      item.avatarUrl ?? "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
  }))

  return (
    <MetricProgressCard
      bodyClassName="space-y-4"
      className="w-full shadow-none"
      headerEnd={
        <Button
          isIconOnly
          aria-label={t("actionLabel")}
          className="h-7 min-w-7 rounded-full bg-transparent px-0 text-slate-400 shadow-none"
          variant="ghost"
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      }
      title={t("title")}
    >
      {items.map((item) => (
        <SpecialProgramRow item={item} key={item.id} />
      ))}
    </MetricProgressCard>
  )
}
