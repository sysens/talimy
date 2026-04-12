import { BriefcaseBusiness, Clock3, UsersRound } from "lucide-react"

import { SummaryBreakdownCard } from "@/components/shared/cards/summary-breakdown-card"

const SHOWCASE_ITEMS = [
  {
    accentIcon: UsersRound,
    metrics: [
      { id: "students-on-time", label: "On-Time", share: "87.5%", value: "1,090" },
      { id: "students-late", label: "Late", share: "7.2%", value: "90" },
      { id: "students-absent", label: "Absent", share: "5.2%", value: "65" },
    ],
    title: "Students",
    totalChangeLabel: "94.8%",
    totalLabel: "Total Present",
    totalValue: "1,180",
    variant: "pink" as const,
    watermarkIcon: UsersRound,
  },
  {
    accentIcon: Clock3,
    metrics: [
      { id: "teachers-on-time", label: "On-Time", share: "87.2%", value: "75" },
      { id: "teachers-late", label: "Late", share: "5.8%", value: "5" },
      { id: "teachers-absent", label: "Absent", share: "7.0%", value: "6" },
    ],
    title: "Teachers",
    totalChangeLabel: "93.0%",
    totalLabel: "Total Present",
    totalValue: "80",
    variant: "sky" as const,
    watermarkIcon: Clock3,
  },
  {
    accentIcon: BriefcaseBusiness,
    metrics: [
      { id: "staff-on-time", label: "On-Time", share: "82.9%", value: "29" },
      { id: "staff-late", label: "Late", share: "8.5%", value: "3" },
      { id: "staff-absent", label: "Absent", share: "5.7%", value: "2" },
    ],
    title: "Staff",
    totalChangeLabel: "91.4%",
    totalLabel: "Total Present",
    totalValue: "32",
    variant: "navy" as const,
    watermarkIcon: BriefcaseBusiness,
  },
] as const

export function AttendanceSummaryCardsShowcase() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {SHOWCASE_ITEMS.map((item) => (
        <SummaryBreakdownCard key={item.title} {...item} />
      ))}
    </div>
  )
}
