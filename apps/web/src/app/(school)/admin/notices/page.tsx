import { getLocale } from "next-intl/server"

import { AdminNoticesBoardSection } from "@/components/admin/notices/admin-notices-board-section"

export default async function Page() {
  const locale = await getLocale()
  return <AdminNoticesBoardSection locale={locale} />
}
