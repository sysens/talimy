import { TeacherCard } from "@/components/teachers/list/teacher-card"
import { TEACHER_CARD_SHOWCASE_ITEMS } from "@/components/shared/ui-showcase/teacher-card-showcase.data"

export function TeachersGridShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {TEACHER_CARD_SHOWCASE_ITEMS.map((item) => (
        <TeacherCard key={item.employeeId} {...item} />
      ))}
    </div>
  )
}
