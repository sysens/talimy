"use client"

import {
  AlarmClockCheck,
  Award,
  CalendarDays,
  CheckSquare2,
  GraduationCap,
  ListTodo,
  Mail,
  Phone,
} from "lucide-react"
import { StatCard } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"

import { AssignmentsPreviewTableCard } from "@/components/shared/assignments/assignments-preview-table-card"
import { MessagesEmptyCard } from "@/components/shared/cards/messages-empty-card"
import { WelcomeProfileCard } from "@/components/shared/cards/welcome-profile-card"
import { PerformanceGaugeCard } from "@/components/shared/charts/performance-gauge-card"
import { RadarMetricsChartCard } from "@/components/shared/charts/radar-metrics-chart-card"
import { ScoreActivityChartCard } from "@/components/shared/charts/score-activity-chart-card"
import { AgendaListCard } from "@/components/shared/events/agenda-list-card"
import { CalendarWidget } from "@/components/shared/calendar/calendar-widget"
import { LessonsOverviewCard } from "@/components/shared/schedule/lessons-overview-card"
import { TeachersPagination } from "@/components/teachers/list/teachers-pagination"
import { TeachersResultsSummary } from "@/components/teachers/list/teachers-results-summary"
import type { AppLocale } from "@/config/site"
import { formatMonthDayYear } from "@/lib/dashboard/dashboard-formatters"

const LIMIT_OPTIONS = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
] as const

export function StudentDashboardPageShowcase() {
  const locale = useLocale() as AppLocale
  const tWelcome = useTranslations("studentDashboard.welcome")
  const tStats = useTranslations("studentDashboard.stats")
  const tPerformance = useTranslations("studentDashboard.performance")
  const tScoreActivity = useTranslations("studentDashboard.scoreActivity")
  const tLessons = useTranslations("studentDashboard.lessons")
  const tSubjects = useTranslations("studentDashboard.subjects")
  const tAssignments = useTranslations("studentDashboard.assignments")
  const tAgenda = useTranslations("studentDashboard.agenda")
  const tMessages = useTranslations("studentDashboard.messages")
  const tCalendar = useTranslations("studentDashboard.calendar")

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_350px]">
          <WelcomeProfileCard
            actionLabel={tWelcome("actionLabel")}
            avatarFallback="MW"
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            metaItems={[
              { icon: GraduationCap, label: tWelcome("classLabel"), value: "Grade 12" },
              {
                icon: CalendarDays,
                label: tWelcome("dateOfBirthLabel"),
                value: formatMonthDayYear(locale, "2009-11-25"),
              },
              { icon: Mail, label: tWelcome("emailLabel"), value: "mia.williams@mail.co" },
              { icon: Phone, label: tWelcome("phoneLabel"), value: "+82 1234 5678" },
            ]}
            name={tWelcome("title", { name: "Mia Williams" })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              className="rounded-[22px]"
              icon={AlarmClockCheck}
              title={tStats("attendancePercentage")}
              tone="sky"
              value="97%"
              variant="finance"
            />
            <StatCard
              className="rounded-[22px]"
              icon={CheckSquare2}
              title={tStats("taskCompletedCount")}
              tone="sky"
              value="258+"
              variant="finance"
            />
            <StatCard
              className="rounded-[22px]"
              icon={ListTodo}
              title={tStats("taskInProgressPercentage")}
              tone="pink"
              value="64%"
              variant="finance"
            />
            <StatCard
              className="rounded-[22px]"
              icon={Award}
              title={tStats("rewardPoints")}
              tone="pink"
              value="245"
              variant="finance"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <PerformanceGaugeCard
            centerLabel={tPerformance("centerLabel")}
            maxValue={4}
            rangeLabel={tPerformance("rangeLabel")}
            remainingLabel={tPerformance("remainingLabel")}
            title={tPerformance("title")}
            value={3.4}
          />
          <ScoreActivityChartCard
            data={[
              { id: "1", label: "Apr 10", value: 52 },
              { id: "2", label: "Apr 11", value: 34 },
              { id: "3", label: "Apr 12", value: 74 },
              { id: "4", label: "Apr 13", value: 68 },
              { id: "5", label: "Apr 14", value: 70 },
              { id: "6", label: "Apr 15", value: 57 },
              { id: "7", label: "Apr 16", value: 82 },
            ]}
            filterAriaLabel={tScoreActivity("filterAriaLabel")}
            filterOptions={[{ label: tScoreActivity("weekly"), value: "weekly" }]}
            metricLabel={tScoreActivity("metricLabel")}
            period="weekly"
            title={tScoreActivity("title")}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <LessonsOverviewCard
            emptyLabel={tLessons("empty")}
            sections={[
              {
                id: "today",
                items: [
                  {
                    id: "t-1",
                    subtitle: "Ms. Carter • Room 204",
                    timeLabel: "10:30",
                    title: "English Literature",
                  },
                  {
                    id: "t-2",
                    subtitle: "Mr. Hale • Lab 2",
                    timeLabel: "12:15",
                    title: "Chemistry",
                  },
                ],
                label: tLessons("today"),
              },
              {
                id: "tomorrow",
                items: [
                  {
                    id: "tm-1",
                    subtitle: "Ms. Clara • Hall A",
                    timeLabel: "09:00",
                    title: "History",
                  },
                  {
                    id: "tm-2",
                    subtitle: "Mr. Kent • Room 101",
                    timeLabel: "11:00",
                    title: "Biology",
                  },
                ],
                label: tLessons("tomorrow"),
              },
            ]}
            title={tLessons("title")}
          />
          <RadarMetricsChartCard
            data={[
              { label: "Biology", value: 88 },
              { label: "Chemistry", value: 76 },
              { label: "Geography", value: 69 },
              { label: "History", value: 84 },
              { label: "Literature", value: 92 },
              { label: "Art", value: 81 },
            ]}
            metricLabel={tSubjects("metricLabel")}
            title={tSubjects("title")}
          />
        </div>

        <div className="space-y-4">
          <AssignmentsPreviewTableCard
            actionLabel={tAssignments("addLabel")}
            columns={{
              action: tAssignments("columns.action"),
              dueDate: tAssignments("columns.dueDate"),
              no: tAssignments("columns.no"),
              status: tAssignments("columns.status"),
              subject: tAssignments("columns.subject"),
              task: tAssignments("columns.task"),
              time: tAssignments("columns.time"),
            }}
            emptyLabel={tAssignments("empty")}
            searchPlaceholder={tAssignments("searchPlaceholder")}
            searchValue=""
            title={tAssignments("title")}
            rows={[
              {
                dueDateLabel: "May 1, 2024",
                id: "1",
                order: "01",
                statusLabel: tAssignments("statuses.inProgress"),
                statusTone: "inProgress",
                subjectName: "English Literature",
                taskTitle: "Read Chapters 1–3",
                timeLabel: "09:00 AM",
              },
              {
                dueDateLabel: "May 3, 2024",
                id: "2",
                order: "02",
                statusLabel: tAssignments("statuses.notStarted"),
                statusTone: "notStarted",
                subjectName: "Mathematics",
                taskTitle: "Complete Problem Set #5",
                timeLabel: "10:30 AM",
              },
              {
                dueDateLabel: "May 5, 2024",
                id: "3",
                order: "03",
                statusLabel: tAssignments("statuses.inProgress"),
                statusTone: "inProgress",
                subjectName: "Chemistry",
                taskTitle: "Write Lab Report on Acid-Base Titration",
                timeLabel: "11:12 AM",
              },
              {
                dueDateLabel: "May 2, 2024",
                id: "4",
                order: "04",
                statusLabel: tAssignments("statuses.notStarted"),
                statusTone: "notStarted",
                subjectName: "History",
                taskTitle: "Prepare for Oral Presentation",
                timeLabel: "12:00 PM",
              },
              {
                dueDateLabel: "May 6, 2024",
                id: "5",
                order: "05",
                statusLabel: tAssignments("statuses.inProgress"),
                statusTone: "inProgress",
                subjectName: "Art",
                taskTitle: "Create Art Piece for Final Project",
                timeLabel: "03:00 PM",
              },
            ]}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <TeachersResultsSummary
              limit={5}
              limitOptions={LIMIT_OPTIONS}
              ofLabel={tAssignments("summary.of")}
              onLimitChange={() => {}}
              resultsLabel={tAssignments("summary.results")}
              showLabel={tAssignments("summary.show")}
              total={12}
            />
            <TeachersPagination
              currentPage={1}
              nextLabel={tAssignments("pagination.next")}
              onPageChange={() => {}}
              previousLabel={tAssignments("pagination.previous")}
              totalPages={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <CalendarWidget
          attendanceSummaryVariant="cards"
          labels={{
            attendanceStatusMeta: {
              absent: {
                description: tCalendar("meta.absentDescription"),
                label: tCalendar("meta.absent"),
              },
              late: {
                description: tCalendar("meta.lateDescription"),
                label: tCalendar("meta.late"),
              },
              onLeave: {
                description: tCalendar("meta.sickDescription"),
                label: tCalendar("meta.sick"),
              },
              present: {
                description: tCalendar("meta.presentDescription"),
                label: tCalendar("meta.present"),
              },
              sick: {
                description: tCalendar("meta.sickDescription"),
                label: tCalendar("meta.sick"),
              },
            },
            weekdayLabels: [
              tCalendar("weekdays.sunday"),
              tCalendar("weekdays.monday"),
              tCalendar("weekdays.tuesday"),
              tCalendar("weekdays.wednesday"),
              tCalendar("weekdays.thursday"),
              tCalendar("weekdays.friday"),
              tCalendar("weekdays.saturday"),
            ],
          }}
          locale={locale}
          variant="attendance"
        />
        <AgendaListCard
          emptyLabel={tAgenda("empty")}
          items={[
            {
              accentClassName: "bg-[var(--talimy-color-sky)]",
              dateLabel: "Monday - March 24, 2030",
              id: "a1",
              subtitle: "Mathematics",
              tagLabel: tAgenda("types.academic"),
              title: "Homeroom & Announcement",
            },
            {
              accentClassName: "bg-[var(--talimy-color-pink)]",
              dateLabel: "Wednesday - April 26, 2024",
              id: "a2",
              subtitle: "Science",
              tagLabel: tAgenda("types.exam"),
              title: "Science Fair Preparation",
            },
            {
              accentClassName: "bg-[#ffe066]",
              dateLabel: "Friday - April 28, 2024",
              id: "a3",
              subtitle: "History",
              tagLabel: tAgenda("types.administration"),
              title: "History Documentary Viewing",
            },
            {
              accentClassName: "bg-[#e7ecf1]",
              dateLabel: "Monday - April 31, 2024",
              id: "a4",
              subtitle: "Art",
              tagLabel: tAgenda("types.events"),
              title: "Art Champion Announcement",
            },
          ]}
          title={tAgenda("title")}
          viewAllLabel={tAgenda("viewAll")}
        />
        <MessagesEmptyCard emptyLabel={tMessages("empty")} title={tMessages("title")} />
      </div>
    </div>
  )
}
