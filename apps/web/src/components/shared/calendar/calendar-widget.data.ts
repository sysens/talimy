import type {
  CalendarAttendanceMonthData,
  CalendarEventsMonthData,
} from "@/components/shared/calendar/calendar-widget.types"

export const CALENDAR_EVENT_MONTHS: readonly CalendarEventsMonthData[] = [
  {
    events: {
      9: [
        {
          colorClassName: "text-orange-500",
          day: 9,
          iconKey: "announcement",
          metaLabel: "09:00 · Main Hall",
          title: "Parent Meeting",
        },
      ],
      20: [
        {
          colorClassName: "text-emerald-500",
          day: 20,
          iconKey: "workshop",
          metaLabel: "11:30 · Staff Room",
          title: "Teaching Workshop",
        },
      ],
    },
    kind: "events",
    key: "2035-02",
    month: "February",
    monthNumber: 2,
    selectedDay: 20,
    year: 2035,
  },
  {
    events: {
      2: [
        {
          colorClassName: "text-fuchsia-500",
          day: 2,
          iconKey: "announcement",
          metaLabel: "08:30 · Admin Office",
          title: "Notice Board Review",
        },
      ],
      5: [
        {
          colorClassName: "text-sky-500",
          day: 5,
          iconKey: "meeting",
          metaLabel: "10:00 · Parents Hall",
          title: "Parent Advisory Meeting",
        },
      ],
      15: [
        {
          colorClassName: "text-amber-500",
          day: 15,
          iconKey: "classroom",
          metaLabel: "13:00 · Grade 9A",
          title: "Academic Review Session",
        },
      ],
      28: [
        {
          colorClassName: "text-violet-500",
          day: 28,
          iconKey: "books",
          metaLabel: "15:30 · Library",
          title: "Reading Club Gathering",
        },
      ],
    },
    kind: "events",
    key: "2035-03",
    month: "March",
    monthNumber: 3,
    selectedDay: 15,
    year: 2035,
  },
  {
    events: {
      4: [
        {
          colorClassName: "text-cyan-500",
          day: 4,
          iconKey: "meeting",
          metaLabel: "09:30 · Meeting Room",
          title: "Teacher Planning Meeting",
        },
      ],
      17: [
        {
          colorClassName: "text-indigo-500",
          day: 17,
          iconKey: "books",
          metaLabel: "12:00 · Resource Center",
          title: "Library Resource Update",
        },
      ],
      23: [
        {
          colorClassName: "text-emerald-500",
          day: 23,
          iconKey: "workshop",
          metaLabel: "14:00 · Innovation Lab",
          title: "Science Fair Workshop",
        },
      ],
    },
    kind: "events",
    key: "2035-04",
    month: "April",
    monthNumber: 4,
    selectedDay: 17,
    year: 2035,
  },
] as const

export const CALENDAR_ATTENDANCE_MONTHS: readonly CalendarAttendanceMonthData[] = [
  {
    key: "2035-02-attendance",
    kind: "attendance",
    month: "February",
    monthNumber: 2,
    selectedDay: 19,
    statuses: {
      3: "present",
      6: "late",
      8: "present",
      11: "present",
      13: "onLeave",
      14: "present",
      18: "late",
      19: "present",
      20: "present",
      24: "present",
      26: "late",
    },
    summary: [
      { colorClassName: "bg-[#b8ebff]", label: "Present", value: 7 },
      { colorClassName: "bg-[#f6b5ff]", label: "Late", value: 3 },
      { colorClassName: "bg-[#1f4b7b]", label: "On Leave", value: 1 },
    ],
    year: 2035,
  },
  {
    key: "2035-03-attendance",
    kind: "attendance",
    month: "March",
    monthNumber: 3,
    selectedDay: 14,
    statuses: {
      1: "present",
      2: "onLeave",
      5: "late",
      6: "present",
      7: "late",
      8: "present",
      9: "present",
      12: "late",
      13: "present",
      14: "onLeave",
      15: "present",
      16: "present",
      19: "present",
      20: "present",
      21: "present",
      22: "late",
      23: "present",
    },
    summary: [
      { colorClassName: "bg-[#b8ebff]", label: "Present", value: 11 },
      { colorClassName: "bg-[#f6b5ff]", label: "Late", value: 4 },
      { colorClassName: "bg-[#1f4b7b]", label: "On Leave", value: 2 },
    ],
    year: 2035,
  },
  {
    key: "2035-04-attendance",
    kind: "attendance",
    month: "April",
    monthNumber: 4,
    selectedDay: 18,
    statuses: {
      2: "present",
      4: "present",
      5: "late",
      10: "present",
      12: "onLeave",
      15: "late",
      18: "present",
      21: "present",
      22: "present",
      24: "late",
      29: "present",
    },
    summary: [
      { colorClassName: "bg-[#b8ebff]", label: "Present", value: 7 },
      { colorClassName: "bg-[#f6b5ff]", label: "Late", value: 3 },
      { colorClassName: "bg-[#1f4b7b]", label: "On Leave", value: 1 },
    ],
    year: 2035,
  },
] as const
