import { BadgeCheck, BookOpenCheck, Pencil, UserRoundPlus } from "lucide-react"

import type { RecentActivityItem } from "@/components/shared/activity/recent-activity.types"

export const RECENT_ACTIVITY_ITEMS: readonly RecentActivityItem[] = [
  {
    description: "New student Alicia Gomez (Class 8B) enrolled by Registrar.",
    icon: UserRoundPlus,
    iconBackgroundClassName: "bg-[#264f79]",
    iconClassName: "text-white",
    id: "student-enrolled",
    timestamp: "March 7, 2035 – 09:15 AM",
  },
  {
    description: "Attendance for Class 7A marked by Teacher John Smith.",
    icon: BadgeCheck,
    iconBackgroundClassName: "bg-[#f5bcff]",
    iconClassName: "text-[#5e547f]",
    id: "attendance-marked",
    timestamp: "March 7, 2035 – 11:30 AM",
  },
  {
    description: "Monthly fee payments verified for Grade 9 students.",
    icon: BookOpenCheck,
    iconBackgroundClassName: "bg-[#264f79]",
    iconClassName: "text-white",
    id: "payments-verified",
    timestamp: "March 8, 2035 – 02:45 PM",
  },
  {
    description: "Exam timetable for Term 2 updated by Academic Coordinator.",
    icon: Pencil,
    iconBackgroundClassName: "bg-[#f5bcff]",
    iconClassName: "text-[#5e547f]",
    id: "exam-updated",
    timestamp: "March 9, 2035 – 10:20 AM",
  },
] as const
