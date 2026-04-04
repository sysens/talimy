import type { ComponentPropsWithoutRef } from "react"

type BrandIconProps = ComponentPropsWithoutRef<"svg">

function AnnouncementIcon(props: BrandIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2a3.5 3.5 0 0 0-3.5 3.5v1.2A5.2 5.2 0 0 0 5 11.6v4.3l-1.2 1.2A.75.75 0 0 0 4.33 18h15.34a.75.75 0 0 0 .53-1.28L19 15.9v-4.3a5.2 5.2 0 0 0-3.5-4.9V5.5A3.5 3.5 0 0 0 12 2Zm0 20a2.6 2.6 0 0 0 2.45-1.75h-4.9A2.6 2.6 0 0 0 12 22Z" />
    </svg>
  )
}

function BooksIcon(props: BrandIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M4 5.25A2.25 2.25 0 0 1 6.25 3h5.25a2.75 2.75 0 0 1 2 .86A2.75 2.75 0 0 1 15.5 3h2.25A2.25 2.25 0 0 1 20 5.25v13A1.75 1.75 0 0 1 18.25 20H15.5a2.5 2.5 0 0 0-1.77.73L12 22.46l-1.73-1.73A2.5 2.5 0 0 0 8.5 20H5.75A1.75 1.75 0 0 1 4 18.25v-13Zm8 13.76.67-.67A4 4 0 0 1 15.5 17.2h2.75a.25.25 0 0 0 .25-.25v-11.7a.75.75 0 0 0-.75-.75H15.5A1.5 1.5 0 0 0 14 6v11.04c-.63.2-1.21.54-1.7.97l-.3.3Zm-1.8-.97A4 4 0 0 0 8.5 17.2H5.75a.25.25 0 0 1-.25-.25v-11.7a.75.75 0 0 1 .75-.75H8.5A1.5 1.5 0 0 1 10 6v12.06l-.3-.3Z" />
    </svg>
  )
}

function ClassroomIcon(props: BrandIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M2.75 5A1.75 1.75 0 0 0 1 6.75v8.5C1 16.22 1.78 17 2.75 17H9v2H6.75a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H15v-2h6.25c.97 0 1.75-.78 1.75-1.75v-8.5A1.75 1.75 0 0 0 21.25 5H2.75Zm-.25 1.75a.25.25 0 0 1 .25-.25h18.5a.25.25 0 0 1 .25.25v7.5a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25v-7.5Z" />
    </svg>
  )
}

function MeetingIcon(props: BrandIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm6 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-6.8 1.5A4.2 4.2 0 0 0 4 16.7V18a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.3a4.2 4.2 0 0 0-4.2-4.2H8.2Zm7.6 0c-.52 0-1.02.1-1.47.28A5.5 5.5 0 0 1 16 16.7V19h3a1 1 0 0 0 1-1v-.9a4.6 4.6 0 0 0-4.2-4.6Z" />
    </svg>
  )
}

function WorkshopIcon(props: BrandIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M3.75 4A1.75 1.75 0 0 0 2 5.75v12.5C2 19.22 2.78 20 3.75 20h16.5c.97 0 1.75-.78 1.75-1.75V5.75A1.75 1.75 0 0 0 20.25 4H3.75Zm.25 2h16v8H4V6Zm2 10a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 6 16Zm4 0a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 10 16Zm4 0a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 14 16Z" />
    </svg>
  )
}

export const CALENDAR_ICONS = {
  announcement: AnnouncementIcon,
  books: BooksIcon,
  classroom: ClassroomIcon,
  meeting: MeetingIcon,
  workshop: WorkshopIcon,
} as const
