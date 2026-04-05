import { TeacherCard } from "@/components/teachers/list/teacher-card"
import { TEACHER_CARD_SHOWCASE_ITEMS } from "@/components/shared/ui-showcase/teacher-card-showcase.data"

export function TeacherCardShowcase() {
  const teacher = TEACHER_CARD_SHOWCASE_ITEMS[0]

  if (!teacher) {
    return null
  }

  return <TeacherCard {...teacher} />
}
