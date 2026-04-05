"use client"

import { Cake, House, Mail, Mars, Phone } from "lucide-react"

import { PersonalInfoCard } from "@/components/shared/profile/personal-info-card"

const SHOWCASE_ITEMS = [
  {
    icon: <Mars className="size-4" />,
    label: "Gender",
    value: "Male",
  },
  {
    icon: <Cake className="size-4" />,
    label: "Date of Birth",
    value: "April 15, 1990",
  },
  {
    icon: <Mail className="size-4" />,
    label: "Email Address",
    value: "cliff.william@studixschool.org",
  },
  {
    icon: <Phone className="size-4" />,
    label: "Phone Number",
    value: "+62 811 5567 2345",
  },
  {
    icon: <House className="size-4" />,
    label: "Address",
    value: "221B Baker Street, London, United Kingdom",
  },
] as const

export function PersonalInfoCardShowcase() {
  return (
    <div className="max-w-75">
      <PersonalInfoCard
        actionLabel="Personal info actions"
        items={SHOWCASE_ITEMS}
        onActionPress={() => undefined}
        title="Personal Info"
      />
    </div>
  )
}
