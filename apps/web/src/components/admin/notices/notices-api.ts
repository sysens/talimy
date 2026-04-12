import type {
  NoticeCategoryFilter,
  NoticeListParams,
  NoticeListResponse,
  NoticeStatusFilter,
} from "@/components/admin/notices/notices-api.types"

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTICES: NoticeListResponse["rows"] = [
  {
    id: "1",
    title: "Midterm Exam Timetable Released",
    content:
      "The official midterm exam timetable for Grades 7-9, and 9 has been released. Students are advised to check their class schedules and prepare accordingly. Exams will begin on March 29, 2035 and continue until March 28, 2035. Detailed subject-wise schedules are available in the attachments below.",
    category: "academic",
    status: "active",
    audience: ["students"],
    audienceLabel: "Students (Grade 7–9)",
    postDate: "2035-03-05T08:00:00Z",
    expirationDate: "2035-03-08T23:00:00Z",
    createdBy: "Academic Office",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&h=80&fit=crop",
    attachments: [{ id: "a1", name: "Midterm_Timetable_2035.pdf", sizeLabel: "2.5MB", url: "#" }],
    viewCount: 342,
  },
  {
    id: "2",
    title: "Parent-Teacher Meeting Invitation",
    content:
      "All parents and teachers are cordially invited to attend the term-end Parent-Teacher Meeting. This is an important opportunity to discuss student progress, address concerns, and align on academic goals for the upcoming term.",
    category: "events",
    status: "active",
    audience: ["parents", "teachers"],
    audienceLabel: "Parents & Teachers",
    postDate: "2035-03-06T09:00:00Z",
    expirationDate: "2035-03-12T17:00:00Z",
    createdBy: "Principal's Office",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 218,
  },
  {
    id: "3",
    title: "Science Lab Maintenance Notice",
    content:
      "The school science laboratory will be temporarily closed for maintenance and equipment upgrades. Students and teachers in the Science Department are advised to reschedule any lab-related activities during this period.",
    category: "maintenance",
    status: "scheduled",
    audience: ["students", "teachers"],
    audienceLabel: "Students & Teachers (Science Dept.)",
    postDate: "2035-03-03T07:00:00Z",
    expirationDate: "2035-03-10T18:00:00Z",
    createdBy: "Science Department",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 89,
  },
  {
    id: "4",
    title: "School Fee Payment Reminder",
    content:
      "This is a friendly reminder that the second installment of school fees is due. Please ensure payment is completed by the due date to avoid any disruption to your child's academic activities.",
    category: "finance",
    status: "active",
    audience: ["parents"],
    audienceLabel: "Parents",
    postDate: "2035-04-01T08:00:00Z",
    expirationDate: "2035-04-15T23:59:00Z",
    createdBy: "Work Department",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 156,
  },
  {
    id: "5",
    title: "Fee Payment Reminder Grade 8",
    content:
      "Reminder for Grade 8 parents: The school fee payment deadline is approaching. Kindly settle the outstanding balance before the due date.",
    category: "finance",
    status: "active",
    audience: ["parents"],
    audienceLabel: "Parents/PMU",
    postDate: "2035-04-02T08:00:00Z",
    expirationDate: "2035-04-10T23:59:00Z",
    createdBy: "Admin Office",
    imageUrl: null,
    attachments: [],
    viewCount: 72,
  },
  {
    id: "6",
    title: "National Holiday – School Closed",
    content:
      "Please be informed that the school will be closed on the occasion of the National Holiday. All classes and activities are cancelled for the day. Normal schedule will resume the following working day.",
    category: "holiday",
    status: "archived",
    audience: ["students", "teachers", "parents"],
    audienceLabel: "All Staff",
    postDate: "2035-04-08T07:00:00Z",
    expirationDate: "2035-04-09T23:59:00Z",
    createdBy: "All Departments",
    imageUrl: "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 421,
  },
  {
    id: "7",
    title: "Teacher Development Workshops",
    content:
      "A series of professional development workshops for all teaching staff will be held. Topics include modern pedagogical approaches, digital tools for classroom management, and student engagement strategies.",
    category: "academic",
    status: "scheduled",
    audience: ["teachers"],
    audienceLabel: "All Teachers",
    postDate: "2035-04-10T09:00:00Z",
    expirationDate: "2035-04-20T17:00:00Z",
    createdBy: "HR Department",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 134,
  },
  {
    id: "8",
    title: "Annual Sports Competition",
    content:
      "Get ready for the most exciting event of the year! The Annual Sports Competition will feature track and field events, team sports, and individual challenges. All students are encouraged to participate.",
    category: "sports",
    status: "active",
    audience: ["students"],
    audienceLabel: "Sports Department",
    postDate: "2035-04-14T08:00:00Z",
    expirationDate: "2035-04-20T20:00:00Z",
    createdBy: "Sports Department",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 198,
  },
  {
    id: "9",
    title: "Field Trip Consent Field Club",
    content:
      "Students participating in the Field Club are invited for an educational field trip. Parents are requested to sign and return the attached consent form by the specified deadline.",
    category: "events",
    status: "active",
    audience: ["students", "parents"],
    audienceLabel: "Grade 7-9",
    postDate: "2035-04-16T08:00:00Z",
    expirationDate: "2035-04-22T17:00:00Z",
    createdBy: "Class Teacher",
    imageUrl: "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?w=80&h=80&fit=crop",
    attachments: [],
    viewCount: 87,
  },
]

export async function getNoticesList(params: NoticeListParams): Promise<NoticeListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  let filtered = [...MOCK_NOTICES]

  if (params.category !== "all") {
    filtered = filtered.filter((n) => n.category === params.category)
  }
  if (params.status !== "all") {
    filtered = filtered.filter((n) => n.status === params.status)
  }
  if (params.search && params.search.trim() !== "") {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    )
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / params.limit))
  const page = Math.min(Math.max(params.page, 1), totalPages)
  const start = (page - 1) * params.limit
  const rows = filtered.slice(start, start + params.limit)

  return { meta: { limit: params.limit, page, total, totalPages }, rows }
}
