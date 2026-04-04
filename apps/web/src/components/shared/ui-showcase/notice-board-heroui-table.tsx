"use client"

import { FeedTable } from "@/components/shared/feed/feed-table"
import { NOTICE_BOARD_ROWS } from "@/components/shared/notice-board/notice-board.data"

export function NoticeBoardHerouiTableShowcase() {
  return <FeedTable items={NOTICE_BOARD_ROWS} title="Notice Board" />
}
