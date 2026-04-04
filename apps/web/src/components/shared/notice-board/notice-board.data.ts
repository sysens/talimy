import type { FeedItem } from "@/components/shared/feed/feed-table"

export const NOTICE_BOARD_ROWS: FeedItem[] = [
  {
    id: "notice-1",
    title: "Science Fair Registration Opens",
    badges: [
      { className: "bg-fuchsia-100 text-fuchsia-700", label: "Academic" },
      { className: "bg-sky-100 text-sky-700", label: "Event" },
    ],
    metadata: [
      { label: "Audience", value: "All Students" },
      { label: "Date", value: "March 8, 2035" },
      { label: "Created By", value: "Academic Coordinator" },
    ],
    imageUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    imageFallback: "SF",
    popularity: 95,
    publishedAt: "2035-03-08",
  },
  {
    id: "notice-2",
    title: "Teacher Development Workshop",
    badges: [{ className: "bg-slate-800 text-white", label: "Training" }],
    metadata: [
      { label: "Audience", value: "All Teachers" },
      { label: "Date", value: "March 10, 2035" },
      { label: "Created By", value: "Principal's Office" },
    ],
    imageUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    imageFallback: "TD",
    popularity: 90,
    publishedAt: "2035-03-10",
  },
  {
    id: "notice-3",
    title: "New Library Books Arrived",
    badges: [{ className: "bg-blue-100 text-blue-700", label: "Resources" }],
    metadata: [
      { label: "Audience", value: "Students & Teachers" },
      { label: "Date", value: "March 12, 2035" },
      { label: "Created By", value: "Librarian" },
    ],
    imageUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    imageFallback: "NB",
    popularity: 84,
    publishedAt: "2035-03-12",
  },
  {
    id: "notice-4",
    title: "Field Trip Consent Forms Due",
    badges: [{ className: "bg-violet-100 text-violet-700", label: "Announcement" }],
    metadata: [
      { label: "Audience", value: "Grade 7 & 8 Students" },
      { label: "Date", value: "March 14, 2035" },
      { label: "Created By", value: "Class Advisor" },
    ],
    imageUrl: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    imageFallback: "FT",
    popularity: 80,
    publishedAt: "2035-03-14",
  },
]
