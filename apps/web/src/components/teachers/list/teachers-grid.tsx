import { TeacherCard } from "@/components/teachers/list/teacher-card"
import { toTeacherCardData } from "@/components/teachers/list/teachers-list.mappers"
import type { TeachersListItem } from "@/components/teachers/list/teachers-list-api.types"

type TeachersGridProps = {
  items: readonly TeachersListItem[]
  messageLabel: string
}

export function TeachersGrid({ items, messageLabel }: TeachersGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <TeacherCard key={item.id} {...toTeacherCardData(item, messageLabel)} />
      ))}
    </div>
  )
}
