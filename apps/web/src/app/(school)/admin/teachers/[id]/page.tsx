import { getTranslations } from "next-intl/server"

import { TeacherDetailPageContent } from "@/components/teachers/detail/teacher-detail-page-content"
import { DetailPageHeader } from "@/components/shared/navigation/detail-page-header"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const [commonT, navT, detailT] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav.admin"),
    getTranslations("adminTeachers.detail.header"),
  ])

  return (
    <div className="space-y-6">
      <DetailPageHeader
        backHref="/admin/teachers"
        backLabel={commonT("back")}
        breadcrumbs={[
          { href: "/admin/dashboard", label: navT("dashboard") },
          { href: "/admin/teachers", label: navT("teachers") },
          { label: detailT("title") },
        ]}
        title={detailT("title")}
      />
      <TeacherDetailPageContent teacherId={id} />
    </div>
  )
}
