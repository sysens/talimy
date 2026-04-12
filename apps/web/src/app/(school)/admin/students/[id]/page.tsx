import { getTranslations } from "next-intl/server"

import { DetailPageHeader } from "@/components/shared/navigation/detail-page-header"
import { StudentDetailPageContent } from "@/components/students/detail/student-detail-page-content"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const [commonT, navT, detailT] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav.admin"),
    getTranslations("adminStudents.detail.header"),
  ])

  return (
    <div className="space-y-6">
      <DetailPageHeader
        backHref="/admin/students"
        backLabel={commonT("back")}
        breadcrumbs={[
          { href: "/admin/dashboard", label: navT("dashboard") },
          { href: "/admin/students", label: navT("students") },
          { label: detailT("title") },
        ]}
        title={detailT("title")}
      />
      <StudentDetailPageContent studentId={id} />
    </div>
  )
}
